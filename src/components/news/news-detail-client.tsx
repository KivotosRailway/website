import Link from "next/link";
import Image from "next/image";
import type { NewsItem } from "@/data/news";
import { getAiTranslationNotice, getLocaleMessages, withLocale, type Locale } from "@/lib/i18n";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { NewsShare } from "@/components/news/news-share";

export function NewsDetailClient({ item, locale, html }: { item: NewsItem; locale: Locale; html: string }) {
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
          <div className="news-detail-cover"><Image src={item.cover} alt="" fill sizes="(max-width: 768px) 100vw, 900px" loading="eager" unoptimized /></div>
          <div className="news-detail-body" dangerouslySetInnerHTML={{ __html: html }} />
          <NewsShare title={item.title} />
        </article>
      </div>
      <div className="page-bottom-nav"><div className="page-bottom-nav-inner"><PageBreadcrumb ariaLabel={messages.common.pagePosition} items={[{ label: messages.common.home, href: "/" }, { label: messages.common.news, href: "/news" }, { label: item.title }]} /></div></div>
    </main>
  );
}
