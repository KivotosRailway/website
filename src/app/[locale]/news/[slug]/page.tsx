import { notFound } from "next/navigation";
import { getNewsBySlug, getNewsList } from "@/data/news";
import { NewsDetailClient } from "@/components/news/news-detail-client";
import { isLocale } from "@/lib/i18n";
import { descriptionFromMarkdown, pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getNewsList()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  if (!isLocale(locale)) notFound();
  const item = await getNewsBySlug(slug, locale);
  if (!item) notFound();
  return pageMetadata(locale, item.href, { title: item.title, description: descriptionFromMarkdown(item.body), article: true });
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  if (!isLocale(locale)) notFound();
  const item = await getNewsBySlug(slug, locale);
  if (!item) notFound();
  return <NewsDetailClient item={item} locale={locale} />;
}
