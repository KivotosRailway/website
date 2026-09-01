"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NewsItem } from "@/data/news";
import { getInitialLocale, getLocaleMessages, type Locale } from "@/lib/i18n";

const ITEMS_PER_PAGE = 12;

export function NewsList({ catalog }: { catalog: Record<Locale, NewsItem[]> }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>("zh-CN");
  const [currentPage, setCurrentPage] = useState(1);
  const messages = getLocaleMessages(locale);
  const news = catalog[locale];

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

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const categories = Array.from(new Set(news.map((item) => item.category).filter(Boolean)));
  const visibleNews = activeCategory
    ? news.filter((item) => item.category === activeCategory)
    : news;

  const totalPages = Math.ceil(visibleNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedNews = visibleNews.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        {paginatedNews.map((item) => (
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

      {totalPages > 1 && (
        <div className="news-pagination">
          <button
            type="button"
            className="news-pagination-button"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            aria-label="上一页"
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`news-pagination-button${currentPage === page ? " active" : ""}`}
              onClick={() => handlePageClick(page)}
              aria-label={`第 ${page} 页`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="news-pagination-button"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            aria-label="下一页"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}

