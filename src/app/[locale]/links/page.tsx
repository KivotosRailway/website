import { notFound } from "next/navigation";
import { FriendlyLinksPage } from "@/components/links/friendly-links-page";
import { getLocaleMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: getLocaleMessages(locale).footer.legal[2] };
}

export default async function LinksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <FriendlyLinksPage locale={locale} />;
}
