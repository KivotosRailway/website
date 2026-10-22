import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { getLocaleMessages, locales, isLocale } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const title = getLocaleMessages(locale).common.siteTitle;
  return { title: { default: title, template: `%s | ${title}` }, icons: { icon: "/icon/icon.svg" } };
}

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SiteShell locale={locale}>{children}</SiteShell>;
}
