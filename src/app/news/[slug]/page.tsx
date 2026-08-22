import type { Metadata } from "next";
import Link from "next/link";
import { getNewsBySlug, markdownToHtml } from "@/data/news";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { NewsShare } from "@/components/news/news-share";

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
  const item = await getNewsBySlug(slug);

  if (!item) {
    return (
      <main className="news-detail-page">
        <div className="news-detail-inner">
          <p>未找到该文章。</p>
          <Link href="/news">返回新闻列表</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="news-detail-page">
      <div className="news-detail-inner">
        <Link href="/news" className="back-link">← 返回新闻</Link>
        <article className="news-detail-card">
          <p className="news-detail-tag">{item.category}</p>
          <h1>{item.title}</h1>
          <time>{item.date}</time>
          <div className="news-detail-cover" style={{ backgroundImage: `url(${item.cover})` }} />
          <div className="news-detail-body" dangerouslySetInnerHTML={{ __html: markdownToHtml(item.body) }} />
          <NewsShare title={item.title} />
        </article>
      </div>
      <div className="page-bottom-nav">
        <div className="page-bottom-nav-inner">
          <PageBreadcrumb items={[{ label: "首页", href: "/" }, { label: "新闻", href: "/news" }, { label: item.title }]} />
        </div>
      </div>
    </main>
  );
}
