"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NewsItem } from "@/data/news";
import { getInitialLocale, getLocaleMessages, type Locale } from "@/lib/i18n";

export function NewsList({ news }: { news: NewsItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>("zh-CN");
  const messages = getLocaleMessages(locale);

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
  const categories = Array.from(new Set(news.map((item) => item.category).filter(Boolean)));
  const visibleNews = activeCategory
    ? news.filter((item) => item.category === activeCategory)
    : news;

  return (
    <>
      <div className="news-toolbar" aria-label="新闻筛选和布局控制">
        <div className="news-toolbar-actions">
          <button
            type="button"
            className={`news-filter-button${activeCategory === null ? " active" : ""}`}
            onClick={() => setActiveCategory(null)}
          >
            {messages.common.all}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`news-filter-button${activeCategory === category ? " active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="news-toolbar-right">
          <button type="button" className="news-view-toggle" aria-label={messages.common.listView}>☰</button>
        </div>
      </div>

      <div className="news-list-grid">
        {visibleNews.map((item) => (
          <article key={item.id} className="news-list-card">
            <Link href={item.href} className="news-list-link">
              <div className="news-list-cover" style={{ backgroundImage: `url(${item.cover})` }} />
              <div className="news-list-meta">
                <span className="news-list-tag">{item.category}</span>
                <h3>{item.title}</h3>
                <time dateTime={item.date}>{item.date}</time>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
