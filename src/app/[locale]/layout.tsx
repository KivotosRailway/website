import { notFound } from "next/navigation";
import SiteDocument from "@/components/layout/site-document";
import { getLocaleMessages, locales, matchLocale } from "@/lib/i18n";

export { viewport } from "@/components/layout/site-document";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...locales,
    "zh-hans",
    "zh-hant",
    "zh-CN",
    "zh-cn",
    "zh-SG",
    "zh-sg",
    "zh-TW",
    "zh-tw",
    "zh-HK",
    "zh-hk",
    "zh-MO",
    "zh-mo",
    "ja",
  ].map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const canonicalLocale = matchLocale(locale);
  if (!canonicalLocale) notFound();
  const title = getLocaleMessages(canonicalLocale).common.siteTitle;
  return { title: { default: title, template: `%s | ${title}` }, icons: { icon: "/icon/icon.svg" } };
}

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const canonicalLocale = matchLocale(locale);
  if (!canonicalLocale) notFound();
  return <SiteDocument locale={canonicalLocale}>{children}</SiteDocument>;
}
