import { expect, test } from "@playwright/test";
import { siteOrigin } from "../../src/lib/seo";

test.beforeEach(async ({ page }) => {
  // Keep UI tests deterministic and independent of external image hosts.
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, (route) => route.abort());
});

test("exported HTML has correct languages, canonical URLs and social metadata before JavaScript", async ({ request }) => {
  for (const [locale, language] of [["zh-Hans", "zh-Hans"], ["zh-Hant", "zh-Hant"], ["en", "en"], ["jp", "ja"]]) {
    for (const suffix of ["", "news/", "policy/privacy-policy/"]) {
      const response = await request.get(`/${locale}/${suffix}`);
      expect(response.status()).toBe(200);
      const html = await response.text();
      expect(html).toContain(`lang="${language}"`);
      expect(html).toContain(`rel="canonical" href="${siteOrigin}/${locale}/${suffix}"`);
      expect(html).toContain('hrefLang="ja"');
      expect(html).toContain('property="og:title"');
      expect(html).toContain('name="twitter:card"');
      expect(html).toContain('id="kr-theme-init"');
      expect(html.indexOf('id="kr-theme-init"')).toBeLessThan(html.indexOf("</head>"));
      expect(html).not.toContain('\\"body\\":');
      if (!suffix) expect(Buffer.byteLength(html)).toBeLessThan(70_000);
    }
  }
});

test("sitemap URLs resolve, expose all languages and omit error routes", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain(`Sitemap: ${siteOrigin}/sitemap.xml`);
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  expect(xml).toContain('hreflang="ja"');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  expect(urls.length).toBeGreaterThan(200);
  expect(urls.some((url) => /\/(403|404|500|502|503|504)\//.test(url))).toBe(false);
  for (const url of urls) {
    expect((await request.get(new URL(url).pathname)).status(), url).toBe(200);
  }
  expect((await request.get("/en/non-existent-page/")).status()).toBe(404);
});

test("footer navigation, language changes and back navigation stay in the same document", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/zh-Hans/");
  await page.locator('.theme-toggle button[aria-pressed="true"]').waitFor();
  await page.evaluate(() => { document.documentElement.dataset.navigationCheck = "same-document"; });
  await page.locator('.site-footer a[href="/zh-Hans/members/"]').click();
  await expect(page).toHaveURL(/\/zh-Hans\/members\/$/);
  await page.locator('.site-locale button[aria-label="English"]').click();
  await expect(page).toHaveURL(/\/en\/members\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('.site-footer a[href="/en/join-us/"]')).toBeVisible();
  await page.locator('.site-locale button[aria-label="日本語"]').click();
  await expect(page).toHaveURL(/\/jp\/members\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await page.goBack();
  await expect(page).toHaveURL(/\/zh-Hans\/$/);
  await expect(page.locator("html")).toHaveAttribute("data-navigation-check", "same-document");
  expect(errors).toEqual([]);
});

for (const [system, saved] of [["light", "dark"], ["dark", "light"]] as const) {
  test(`saved ${saved} theme applies before React on a ${system} system`, async ({ page, context }) => {
    await page.emulateMedia({ colorScheme: system });
    await context.addCookies([{ name: "kr-theme", value: saved, url: "http://127.0.0.1:4173" }]);
    await page.route("**/_next/**/*.js", (route) => route.abort());
    await page.goto("/en/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", saved);
    await expect(page.locator("body")).toHaveCSS("background-color", saved === "dark" ? "rgb(16, 21, 29)" : "rgb(255, 255, 255)");
    expect(await page.locator('meta[name="theme-color"]').first().getAttribute("content")).toBe(saved === "dark" ? "#10151d" : "#ffffff");
  });
}

test("theme switching persists through refresh, SPA navigation and mobile menu opening", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/en/");
  await page.locator('.theme-toggle button').first().click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator('.site-footer a[href="/en/members/"]').click();
  await expect(page).toHaveURL(/\/en\/members\/$/);
  await page.locator(".site-menu-button").click();
  await expect(page.locator(".site-navigation")).toHaveCSS("background-color", "rgb(26, 34, 45)");
  await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute("content", "#10151d");
  await page.locator('.theme-toggle button').last().click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("themes still work when localStorage is blocked", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", { value: () => { throw new Error("blocked"); } });
    Object.defineProperty(Storage.prototype, "setItem", { value: () => { throw new Error("blocked"); } });
  });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/en/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator('.theme-toggle button').nth(1).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
