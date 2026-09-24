import { notFound } from "next/navigation";
import { SimpleTitlePage } from "@/components/pages/simple-title-page";
import { getLocaleMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: getLocaleMessages(locale).footer.columns[1].links[2] };
}

export default async function JoinUsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getLocaleMessages(locale);
  return <SimpleTitlePage locale={locale} title={messages.footer.columns[1].links[2]} image="/pages/join-hero.webp" imagePosition="center" />;
}
