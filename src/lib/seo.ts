import type { Metadata } from "next";
import { getLocaleMessages, localeLanguageTags, locales, withLocale, type Locale } from "@/lib/i18n";

export const siteOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.kivotos.cc").origin;

const descriptions: Record<Locale, string> = {
  "zh-Hans": "基沃托斯铁道公团官方网站。了解我们的 Minecraft 铁路与城市建设，阅读最新新闻，认识团队并获取加入信息。",
  "zh-Hant": "基沃托斯鐵道公團官方網站。了解我們的 Minecraft 鐵路與城市建設，閱讀最新消息，認識團隊並取得加入資訊。",
  en: "The official KivotosRailway website. Explore our Minecraft railways and cities, read the latest news, meet the team, and find information about joining us.",
  jp: "キヴォトス鉄道公団の公式サイト。Minecraft の鉄道・都市開発、最新ニュース、メンバー紹介、参加に関する情報をお届けします。",
};

const openGraphLocales: Record<Locale, string> = {
  "zh-Hans": "zh_CN", "zh-Hant": "zh_TW", en: "en_US", jp: "ja_JP",
};

export function localizedUrl(href: string, locale: Locale) {
  return new URL(withLocale(href, locale), siteOrigin).href;
}

export function languageAlternates(href: string) {
  return Object.fromEntries(locales.map((locale) => [localeLanguageTags[locale], localizedUrl(href, locale)]));
}

export function descriptionFromMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>|]/g, "")
    .replace(/\s+/g, " ").trim().slice(0, 160);
}

export function pageMetadata(locale: Locale, href: string, options: {
  title?: string;
  description?: string;
  article?: boolean;
} = {}): Metadata {
  const siteTitle = getLocaleMessages(locale).common.siteTitle;
  const title = options.title ? `${options.title} | ${siteTitle}` : siteTitle;
  const description = options.description || (options.title ? `${options.title} — ${descriptions[locale]}` : descriptions[locale]);
  const url = localizedUrl(href, locale);
  const image = new URL("/home-hero-scene.webp", siteOrigin).href;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: { ...languageAlternates(href), "x-default": localizedUrl(href, "zh-Hans") } },
    openGraph: {
      type: options.article ? "article" : "website",
      title, description, url, siteName: siteTitle,
      locale: openGraphLocales[locale],
      alternateLocale: locales.filter((item) => item !== locale).map((item) => openGraphLocales[item]),
      images: [{ url: image, width: 1440, height: 743, alt: siteTitle }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
