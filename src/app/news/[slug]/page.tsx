import type { Metadata } from "next";
import { getNewsBySlug, getNewsCatalog, getNewsList } from "@/data/news";
import { NewsDetailClient } from "@/components/news/news-detail-client";

export async function generateStaticParams() {
  const news = await getNewsList();

  return news.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  return {
    title: item?.title ?? "新闻",
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <NewsDetailClient catalog={await getNewsCatalog()} slug={slug} />;
}
