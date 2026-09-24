"use client";

import { useRouteLocale } from "@/components/layout/locale-context";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NewsItem } from "@/data/news";
import { applyLocale, getInitialLocale, withLocale, getLocaleMessages, type Locale } from "@/lib/i18n";

const homeFeatureCopy: Record<Locale, {
  railway: { title: [string, string]; description: [string, string] };
  city: { title: [string, string]; description: [string, string] };
  about: string;
  join: string;
}> = {
  "zh-Hans": {
    railway: { title: ["从点", "到网"], description: ["从一个车站扩展到线网", "铁路承载了根基"] },
    city: { title: ["从地面", "到天空"], description: ["城建蓬勃发展", "自由盛放"] },
    about: "关于我们",
    join: "加入我们",
  },
  "zh-Hant": {
    railway: { title: ["從點", "到網"], description: ["從一個車站擴展至路網", "鐵路承載了根基"] },
    city: { title: ["從地面", "到天空"], description: ["城市建設蓬勃發展", "自由綻放"] },
    about: "關於我們",
    join: "加入我們",
  },
  en: {
    railway: { title: ["From a stop", "to a network"], description: ["From one station to a network.", "Railways carry the foundation."] },
    city: { title: ["From ground", "to sky"], description: ["Cities thrive and grow.", "Ideas bloom freely."] },
    about: "About us",
    join: "Join us",
  },
  jp: {
    railway: { title: ["一点から", "ネットワークへ"], description: ["ひとつの駅から路線網へ。", "鉄道がその基盤を支えます。"] },
    city: { title: ["地上から", "空へ"], description: ["都市は大きく発展し、", "自由に花開きます。"] },
    about: "私たちについて",
    join: "参加する",
  },
};

export function HomePageContent({ newsByLocale }: { newsByLocale: Record<Locale, NewsItem[]> }) {
  const [locale, setLocale] = useState<Locale>(useRouteLocale());

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
  const visibleNews = newsByLocale[locale] ?? newsByLocale["zh-Hans"] ?? [];
  const features = homeFeatureCopy[locale];

  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="hero-scene" aria-hidden="true" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="hero-kicker">{t.home.kicker}</p>
          <h1 id="hero-title">{t.home.title[0]}<br />{t.home.title[1]}</h1>
          <p>{t.home.subtitle}</p>
          <a className="hero-link" href="#about">{t.home.cta} <span>→</span></a>
        </div>
      </section>

      <section className="home-stories" aria-label={t.home.title.join(" ")}>
        <article className="home-story">
          <div className="home-story-image home-story-image--railway" aria-hidden="true" />
          <div className="home-story-copy">
            <h2>{features.railway.title[0]}<br />{features.railway.title[1]}</h2>
            <p>{features.railway.description[0]}<br />{features.railway.description[1]}</p>
            <Link className="home-story-arrow" href={withLocale("/railway", locale)} aria-label={t.header.nav[2]}>→</Link>
          </div>
        </article>

        <article className="home-story home-story--city">
          <div className="home-story-copy home-story-copy--city">
            <h2>{features.city.title[0]}<br />{features.city.title[1]}</h2>
            <p>{features.city.description[0]}<br />{features.city.description[1]}</p>
            <Link className="home-story-arrow" href={withLocale("/city", locale)} aria-label={t.header.nav[3]}>←</Link>
          </div>
          <div className="home-story-image home-story-image--city" aria-hidden="true" />
        </article>
      </section>

      <section className="home-collage" aria-hidden="true">
        <div className="home-collage-tile home-collage-wide" />
        <div className="home-collage-tile home-collage-medium" />
        <div className="home-collage-tile home-collage-small" />
        <div className="home-collage-tile home-collage-bottom" />
        <div className="home-collage-tile home-collage-tall" />
      </section>

      <section className="home-news" id="about" aria-labelledby="latest-news-title">
        <div className="news-header">
          <h2 id="latest-news-title">{t.home.latest}</h2>
          <Link href={withLocale("/news", locale)} className="news-more-link">
            {t.home.more} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="news-grid" aria-label={t.home.latest}>
          {visibleNews.slice(0, 3).map((post) => (
            <article key={post.id} className="news-card">
              <Link href={withLocale(post.href, locale)} className="news-card-link" aria-label={post.title}>
                <div className="news-visual" style={{ backgroundImage: `url(${post.cover})` }} />
                <h3>{post.title}</h3>
                <time dateTime={post.date}>{post.date}</time>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-actions" aria-label={t.common.siteTitle}>
        <Link href={withLocale("/about", locale)} className="home-action-card">
          <div className="home-action-image home-action-image--about" aria-hidden="true" />
          <span>{features.about} <b aria-hidden="true">→</b></span>
        </Link>
        <Link href={withLocale("/join-us", locale)} className="home-action-card">
          <div className="home-action-image home-action-image--join" aria-hidden="true" />
          <span>{features.join} <b aria-hidden="true">→</b></span>
        </Link>
      </section>
    </main>
  );
}
