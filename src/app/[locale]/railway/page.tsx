import { notFound } from "next/navigation";
import { SimpleTitlePage } from "@/components/pages/simple-title-page";
import { getLocaleMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: getLocaleMessages(locale).header.nav[2] };
}

export default async function RailwayPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SimpleTitlePage locale={locale} title={getLocaleMessages(locale).header.nav[2]} image="/pages/railway-hero.png" imagePosition="47% 24%" />;
}
