import assert from "node:assert/strict";
import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { locales, withLocale } from "../../src/lib/i18n";

// Existing issue #1 is outside this change. Keep the exact baseline visible;
// any newly missing asset fails this test. Remove entries when the cache is repaired.
const knownMissing = new Set([
  "/media/news/897d764a65897170.jpg", "/media/news/8ecb7a6b90f318e0.png",
  "/media/news/852dd5b369bf377d.jpg", "/media/news/7f7c61ff4b22140d.png",
  "/media/news/acd56aafe8b41f05.png", "/media/news/7ae2b8fba574195b.png",
  "/media/news/faa9264b9cbf052b.png", "/media/news/02882b262ac53ec2.png",
  // This relative cover already exists in all four source files in HEAD.
  ...locales.map((locale) => `${withLocale("/news/20240917-mcnews", locale)}2024-09-18_00.24.45.png`),
]);

async function files(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory()
    ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]))).flat();
}

test("exported HTML/CSS references no newly missing static assets", async (t) => {
  const output = path.resolve("out");
  const assets = new Set<string>();
  for (const file of (await files(output)).filter((name) => /\.(html|css)$/.test(name))) {
    const text = (await readFile(file, "utf8"))
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replaceAll("&quot;", '"').replaceAll("&amp;", "&");
    const base = new URL(path.relative(output, file).replaceAll(path.sep, "/"), "https://export.invalid/");
    for (const match of text.matchAll(/(?:\bsrc=["']|url\(["']?)([^\s"'<>)]*)/g)) {
      if (!match[1]) continue;
      const url = new URL(match[1], base);
      if (url.origin === base.origin) assets.add(decodeURIComponent(url.pathname));
    }
  }
  const missing: string[] = [];
  for (const asset of assets) {
    try { await access(path.join(output, asset)); }
    catch { missing.push(asset); }
  }
  const baseline = missing.filter((asset) => knownMissing.has(asset));
  if (baseline.length) t.diagnostic(`Existing missing image URLs (excluded image repair): ${baseline.join(", ")}`);
  assert.deepEqual(missing.filter((asset) => !knownMissing.has(asset)), []);
});
