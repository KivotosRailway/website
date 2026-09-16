import zhCN from "@/locales/zh-CN.json";
import zhTW from "@/locales/zh-TW.json";
import en from "@/locales/en.json";
import ja from "@/locales/ja.json";

export const locales = ["zh-Hans", "zh-Hant", "en", "jp"] as const;
export type Locale = (typeof locales)[number];

// Content storage retains its original names; public URLs use script subtags.
export const localeContentDirectory: Record<Locale, string> = {
  "zh-Hans": "zh-CN", "zh-Hant": "zh-TW", en: "en", jp: "ja",
};

export function matchLocale(value: string | null): Locale | null {
  const language = value?.toLowerCase().replaceAll("_", "-");
  if (!language) return null;
  if (/^zh(?:-|$)/.test(language)) {
    if (language.includes("-hant")) return "zh-Hant";
    if (language.includes("-hans")) return "zh-Hans";
    return /^zh-(tw|hk|mo)(-|$)/.test(language) ? "zh-Hant" : "zh-Hans";
  }
  if (/^en(?:-|$)/.test(language)) return "en";
  if (/^(ja|jp)(?:-|$)/.test(language)) return "jp";
  return null;
}

export function getPathLocale(pathname: string): Locale | null {
  return matchLocale(pathname.split("/")[1]);
}

export function withoutLocale(pathname: string): string {
  return getPathLocale(pathname) ? `/${pathname.split("/").slice(2).join("/")}` : pathname;
}

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.some((locale) => locale === value);
}

export function withLocale(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const url = new URL(href, "https://locale.invalid");
  const path = withoutLocale(url.pathname).replace(/\/$/, "");
  url.pathname = `/${locale}${path}/`;
  url.searchParams.delete("lang");
  return `${url.pathname}${url.search}${url.hash}`;
}

export const localeLabels: Record<Locale, string> = {
  "zh-Hans": "简体中文",
  "zh-Hant": "繁體中文",
  en: "English",
  jp: "日本語",
};

export const localeShortLabels: Record<Locale, string> = {
  "zh-Hans": "简",
  "zh-Hant": "繁",
  en: "EN",
  jp: "JP",
};

export const translations = {
  "zh-Hans": zhCN,
  "zh-Hant": zhTW,
  en,
  jp: ja,
} as const;

export function applyLocale(locale: Locale) {
  if (typeof window === "undefined") return;

  if (!locales.includes(locale)) return;

  const href = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const localizedHref = withLocale(href, locale);
  try {
    window.localStorage.setItem("kr-locale", locale);
  } catch { /* The URL remains the source of truth when storage is unavailable. */ }
  if (href !== localizedHref) {
    window.location.replace(localizedHref);
    return;
  }
  document.documentElement.lang = locale;
  document.documentElement.setAttribute("data-locale", locale);
  window.dispatchEvent(new CustomEvent("kr-locale-change", { detail: { locale } }));
}

export function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "zh-Hans";

  const pathLocale = getPathLocale(window.location.pathname);
  if (pathLocale) return pathLocale;
  const urlLocale = matchLocale(new URLSearchParams(window.location.search).get("lang"));
  if (urlLocale) return urlLocale;

  try {
    const saved = matchLocale(window.localStorage.getItem("kr-locale"));
    if (saved) return saved;
  } catch { /* Fall back to the browser language. */ }

  for (const language of navigator.languages?.length ? navigator.languages : [navigator.language]) {
    const locale = matchLocale(language);
    if (locale) return locale;
  }
  return "en";
}

export function getLocaleMessages(locale: Locale) {
  return translations[locale];
}

export function getAiTranslationNotice(locale: Locale) {
  if (locale === "zh-Hant") {
    return "此文章由 AI 從簡體中文翻譯而成，如有任何歧義，以簡體中文版本為準。";
  }

  if (locale === "en") {
    return "This text was translated from Simplified Chinese using AI; in the event of any discrepancies, the Simplified Chinese version prevails.";
  }

  return "このテキストは簡体字中国語から AI により翻訳されています。相違がある場合は、簡体字中国語版を優先します。";
}
