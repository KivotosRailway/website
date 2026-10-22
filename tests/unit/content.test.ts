import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import { createNewsReader } from "../../src/data/news";
import { isLocale, localeLanguageTags, withLocale } from "../../src/lib/i18n";
import { languageAlternates, pageMetadata } from "../../src/lib/seo";

const news = createNewsReader(path.resolve("tests/fixtures/news"));

test("a partially translated catalog keeps new source articles and uses available translations", async () => {
  const list = await news.getNewsList("en");
  assert.deepEqual(list.map((item) => item.slug), ["one", "two", "three", "four"]);
  assert.equal(list[0].title, "最新中文文章");
  assert.equal(list[1].title, "The translated second article");
  for (const item of list) {
    assert.equal("body" in item, false);
    assert.equal("markdownFile" in item, false);
  }
});

test("detail fallback is per slug and records the real content language", async () => {
  const fallback = await news.getNewsBySlug("one", "en");
  assert.equal(fallback?.contentLocale, "zh-Hans");
  assert.match(fallback?.body ?? "", /最新正文/);
  const translated = await news.getNewsBySlug("two", "en");
  assert.equal(translated?.contentLocale, "en");
  assert.match(translated?.body ?? "", /English translation/);
  assert.equal(await news.getNewsBySlug("missing", "en"), null);
});

test("a missing language directory falls back and the homepage receives only three summaries", async () => {
  assert.equal((await news.getNewsList("jp")).length, 4);
  const latest = await news.getLatestNews("en");
  assert.deepEqual(latest.map((item) => item.slug), ["one", "two", "three"]);
  assert.ok(latest.every((item) => !("body" in item)));
});

test("locale URLs retain query/hash and SEO language tags do not change public routes", () => {
  assert.equal(withLocale("/zh-Hans/news/?page=2&lang=zh-CN#recent", "jp"), "/jp/news/?page=2#recent");
  assert.equal(withLocale("mailto:connect@kivotos.cc", "en"), "mailto:connect@kivotos.cc");
  assert.equal(isLocale("ja"), false);
  assert.equal(localeLanguageTags.jp, "ja");
  assert.match(languageAlternates("/news").ja, /\/jp\/news\/$/);
  const metadata = pageMetadata("en", "/about", { title: "About" });
  assert.match(String(metadata.alternates?.canonical), /\/en\/about\/$/);
  assert.ok(metadata.twitter && "card" in metadata.twitter);
  assert.equal(metadata.twitter.card, "summary_large_image");
});
