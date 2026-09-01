import type { Metadata } from "next";
import { getNewsCatalog } from "@/data/news";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { NewsList } from "@/components/news/news-list";
import { NewsPageHeading } from "@/components/news/news-page-heading";

export const metadata: Metadata = {
  title: "新闻",
};

export default async function NewsPage() {
  const catalog = await getNewsCatalog();

  return (
    <main className="news-page">
      <div className="news-page-inner">
        <header className="news-page-header">
          <NewsPageHeading />
        </header>

        <NewsList catalog={catalog} />
      </div>
      <div className="page-bottom-nav">
        <div className="page-bottom-nav-inner">
          <PageBreadcrumb items={[{ label: "首页", href: "/" }, { label: "新闻" }]} />
        </div>
      </div>
    </main>
  );
}
