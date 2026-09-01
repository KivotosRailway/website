"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NewsItem } from "@/data/news";
import { applyLocale, getInitialLocale, getLocaleMessages, type Locale } from "@/lib/i18n";

export function HomePageContent({ newsByLocale }: { newsByLocale: Record<Locale, NewsItem[]> }) {
  const [locale, setLocale] = useState<Locale>("zh-CN");

  useEffect(() => {
    const syncLocale = (nextLocale: Locale) => setLocale(nextLocale);

    const currentLocale = getInitialLocale();
    syncLocale(currentLocale);
    applyLocale(currentLocale);

    const onLocaleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ locale?: Locale }>).detail;
      if (detail?.locale) {
        setLocale(detail.locale);
      }
    };

    const handleStorage = () => {
      const nextLocale = getInitialLocale();
      syncLocale(nextLocale);
      applyLocale(nextLocale);
    };

    window.addEventListener("kr-locale-change", onLocaleChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("kr-locale-change", onLocaleChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const t = getLocaleMessages(locale);
  const visibleNews = newsByLocale[locale] ?? newsByLocale["zh-CN"] ?? [];

  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="hero-scene" aria-hidden="true">
          <div className="hero-sky" />
          <div className="hero-city hero-city-left" />
          <div className="hero-city hero-city-right" />
          <div className="hero-overpass" />
          <div className="hero-track hero-track-one" />
          <div className="hero-track hero-track-two" />
          <div className="hero-train"><span /><span /><span /><span /></div>
        </div>
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="hero-kicker">{t.home.kicker}</p>
          <h1 id="hero-title">{t.home.title[0]}<br />{t.home.title[1]}</h1>
          <p>{t.home.subtitle}</p>
          <a className="hero-link" href="#about">{t.home.cta} <span>→</span></a>
        </div>
      </section>

      <section className="home-news" id="about" aria-labelledby="latest-news-title">
        <div className="news-header">
          <h2 id="latest-news-title">{t.home.latest}</h2>
          <Link href="/news" className="news-more-link">
            {t.home.more} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="news-grid" aria-label={t.home.latest}>
          {visibleNews.slice(0, 3).map((post) => (
            <article key={post.id} className="news-card">
              <Link href={post.href} className="news-card-link" aria-label={post.title}>
                <div className="news-visual" style={{ backgroundImage: `url(${post.cover})` }} />
                <h3>{post.title}</h3>
                <time dateTime={post.date}>{post.date}</time>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
