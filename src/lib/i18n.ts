import zhCN from "@/locales/zh-CN.json";
import zhTW from "@/locales/zh-TW.json";
import en from "@/locales/en.json";
import ja from "@/locales/ja.json";

export const locales = ["zh-CN", "zh-TW", "en", "ja"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  en: "English",
  ja: "日本語",
};

export const localeShortLabels: Record<Locale, string> = {
  "zh-CN": "简",
  "zh-TW": "繁",
  en: "EN",
  ja: "JP",
};

export const translations = {
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  en,
  ja,
} as const;

export function applyLocale(locale: Locale) {
  if (typeof window === "undefined") return;

  if (!locales.includes(locale)) return;

  window.localStorage.setItem("kr-locale", locale);
  document.documentElement.lang = locale;
  document.documentElement.setAttribute("data-locale", locale);
  window.dispatchEvent(new CustomEvent("kr-locale-change", { detail: { locale } }));
}

export function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "zh-CN";

  const saved = window.localStorage.getItem("kr-locale") as Locale | null;
  if (saved && locales.includes(saved)) return saved;

  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith("zh-tw") || browserLanguage.startsWith("zh-hk")) return "zh-TW";
  if (browserLanguage.startsWith("en")) return "en";
  if (browserLanguage.startsWith("ja")) return "ja";
  return "zh-CN";
}

export function getLocaleMessages(locale: Locale) {
  return translations[locale];
}

export function getAiTranslationNotice(locale: Locale) {
  if (locale === "zh-TW") {
    return "此文章由 AI 從簡體中文翻譯而成，如有任何歧義，以簡體中文版本為準。";
  }

  if (locale === "en") {
    return "This text was translated from Simplified Chinese using AI; in the event of any discrepancies, the Simplified Chinese version prevails.";
  }

  return "このテキストは簡体字中国語から AI により翻訳されています。相違がある場合は、簡体字中国語版を優先します。";
}
