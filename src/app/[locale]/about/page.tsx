import { notFound } from "next/navigation";
import { AboutPage } from "@/components/about/about-page";
import { getLocaleMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: getLocaleMessages(locale).footer.columns[1].links[0] };
}

export default async function AboutRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AboutPage locale={locale} />;
}
