"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NewsItem } from "@/data/news";
import { getAiTranslationNotice, getInitialLocale, getLocaleMessages, type Locale } from "@/lib/i18n";
import { markdownToHtml } from "@/lib/markdown";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { NewsShare } from "@/components/news/news-share";

export function NewsDetailClient({ catalog, slug }: { catalog: Record<Locale, NewsItem[]>; slug: string }) {
  const [locale, setLocale] = useState<Locale>("zh-CN");
  const messages = getLocaleMessages(locale);
  const item = catalog[locale].find((entry) => entry.slug === slug) ?? catalog["zh-CN"].find((entry) => entry.slug === slug);

  useEffect(() => {
    const syncLocale = () => setLocale(getInitialLocale());
    syncLocale();
    window.addEventListener("kr-locale-change", syncLocale);
    window.addEventListener("storage", syncLocale);
    return () => {
      window.removeEventListener("kr-locale-change", syncLocale);
      window.removeEventListener("storage", syncLocale);
    };
  }, []);

  if (!item) return <main className="news-detail-page"><div className="news-detail-inner"><p>未找到该文章。</p><Link href="/news">{messages.common.backToNews}</Link></div></main>;

  return <main className="news-detail-page">
    <div className="news-detail-inner">
      <Link href="/news" className="back-link">← {messages.common.backToNews}</Link>
      <article className="news-detail-card">
        <p className="news-detail-tag">{item.category}</p>
        <h1>{item.title}</h1>
        <time>{item.date}</time>
        {locale !== "zh-CN" && (
          <div className="news-detail-ai-banner" aria-label="AI translated content">
            {getAiTranslationNotice(locale)}
          </div>
        )}
        <div className="news-detail-cover" style={{ backgroundImage: `url(${item.cover})` }} />
        <div className="news-detail-body" dangerouslySetInnerHTML={{ __html: markdownToHtml(item.body) }} />
        <NewsShare title={item.title} />
      </article>
    </div>
    <div className="page-bottom-nav"><div className="page-bottom-nav-inner"><PageBreadcrumb ariaLabel={messages.common.pagePosition} items={[{ label: messages.common.home, href: "/" }, { label: messages.common.news, href: "/news" }, { label: item.title }]} /></div></div>
  </main>;
}