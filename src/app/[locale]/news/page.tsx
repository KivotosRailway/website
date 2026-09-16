import { notFound } from "next/navigation";
import { getNewsList } from "@/data/news";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { NewsList } from "@/components/news/news-list";
import { NewsPageHeading } from "@/components/news/news-page-heading";
import { getLocaleMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: getLocaleMessages(locale).common.news };
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getLocaleMessages(locale);

  return (
    <main className="news-page">
      <div className="news-page-inner">
        <header className="news-page-header"><NewsPageHeading /></header>
        <NewsList news={await getNewsList(locale)} />
      </div>
      <div className="page-bottom-nav"><div className="page-bottom-nav-inner"><PageBreadcrumb items={[{ label: messages.common.home, href: "/" }, { label: messages.common.news }]} /></div></div>
    </main>
  );
}
