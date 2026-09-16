import type { Metadata } from "next";
import { getNewsCatalog } from "@/data/news";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { NewsList } from "@/components/news/news-list";
import { NewsPageHeading } from "@/components/news/news-page-heading";
import { getLocaleMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: getLocaleMessages(isLocale(locale) ? locale : "zh-Hans").common.news };
}

export default async function NewsPage({ params }: { params: Promise<{ locale?: string }> }) {
  const { locale } = await params;
  const messages = getLocaleMessages(isLocale(locale) ? locale : "zh-Hans");
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
          <PageBreadcrumb items={[{ label: messages.common.home, href: "/" }, { label: messages.common.news }]} />
        </div>
      </div>
    </main>
  );
}
