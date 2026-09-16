import type { Metadata } from "next";
import { FriendlyLinksPage } from "@/components/links/friendly-links-page";
import { getLocaleMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: getLocaleMessages(isLocale(locale) ? locale : "zh-Hans").footer.legal[2] };
}

export default async function LinksPage({ params }: { params: Promise<{ locale?: string }> }) {
  const { locale } = await params;
  return <FriendlyLinksPage locale={isLocale(locale) ? locale : "zh-Hans"} />;
}
