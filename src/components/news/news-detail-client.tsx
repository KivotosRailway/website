import Link from "next/link";
import type { NewsItem } from "@/data/news";
import { getAiTranslationNotice, getLocaleMessages, withLocale, type Locale } from "@/lib/i18n";
import { markdownToHtml } from "@/lib/markdown";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { NewsShare } from "@/components/news/news-share";

export function NewsDetailClient({ item, locale }: { item: NewsItem; locale: Locale }) {
  const messages = getLocaleMessages(locale);

  return (
    <main className="news-detail-page">
      <div className="news-detail-inner">
        <Link href={withLocale("/news", locale)} className="back-link">← {messages.common.backToNews}</Link>
        <article className="news-detail-card">
          <p className="news-detail-tag">{item.category}</p>
          <h1>{item.title}</h1>
          <time>{item.date}</time>
          {item.contentLocale !== "zh-Hans" && <div className="news-detail-ai-banner" aria-label="AI translated content">{getAiTranslationNotice(locale)}</div>}
          <div className="news-detail-cover" style={{ backgroundImage: `url(${item.cover})` }} />
          <div className="news-detail-body" dangerouslySetInnerHTML={{ __html: markdownToHtml(item.body) }} />
          <NewsShare title={item.title} />
        </article>
      </div>
      <div className="page-bottom-nav"><div className="page-bottom-nav-inner"><PageBreadcrumb ariaLabel={messages.common.pagePosition} items={[{ label: messages.common.home, href: "/" }, { label: messages.common.news, href: "/news" }, { label: item.title }]} /></div></div>
    </main>
  );
}
