import { notFound } from "next/navigation";
import { getNewsBySlug, getNewsList } from "@/data/news";
import { NewsDetailClient } from "@/components/news/news-detail-client";
import { isLocale } from "@/lib/i18n";

export async function generateStaticParams() {
  return (await getNewsList()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  if (!isLocale(locale)) notFound();
  const item = await getNewsBySlug(slug, locale);
  return { title: item?.title ?? "新闻" };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  if (!isLocale(locale)) notFound();
  return <NewsDetailClient item={await getNewsBySlug(slug, locale)} locale={locale} />;
}
