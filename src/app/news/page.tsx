import Link from "next/link";
import { getNewsList } from "@/data/news";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { NewsList } from "@/components/news/news-list";

export default async function NewsPage() {
  const news = await getNewsList();

  return (
    <main className="news-page">
      <div className="news-page-inner">
        <header className="news-page-header">
          <h1>新闻</h1>
        </header>

        <NewsList news={news} />
      </div>
      <div className="page-bottom-nav">
        <div className="page-bottom-nav-inner">
          <PageBreadcrumb items={[{ label: "首页", href: "/" }, { label: "新闻" }]} />
        </div>
      </div>
    </main>
  );
}
