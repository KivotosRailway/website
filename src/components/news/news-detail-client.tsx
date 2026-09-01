"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NewsItem } from "@/data/news";
import { getInitialLocale, getLocaleMessages, type Locale } from "@/lib/i18n";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { NewsShare } from "@/components/news/news-share";

function renderMarkdown(markdown: string) {
  const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (text: string) => escape(text)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
  const output: string[] = [];
  let paragraph: string[] = [];
  let list: "ul" | "ol" | null = null;
  let items: string[] = [];
  const flushParagraph = () => { if (paragraph.length) { output.push(`<p>${inline(paragraph.join(" ").trim())}</p>`); paragraph = []; } };
  const flushList = () => { if (list && items.length) output.push(`<${list}>${items.map((item) => `<li>${inline(item)}</li>`).join("")}</${list}>`); list = null; items = []; };
  for (const rawLine of markdown.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (!line) { flushParagraph(); flushList(); continue; }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) { flushParagraph(); flushList(); output.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); continue; }
    const unordered = line.match(/^[-*]\s+(.+)$/);
    const ordered = line.match(/^\d+[.)]\s+(.+)$/);
    if (unordered || ordered) { flushParagraph(); const next = unordered ? "ul" : "ol"; if (list && list !== next) flushList(); list = next; items.push((unordered ?? ordered)![1]); continue; }
    flushList(); paragraph.push(line);
  }
  flushParagraph(); flushList();
  return output.join("");
}

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

  const aiNotice = locale === "zh-TW"
    ? "此文章由 AI 從簡體中文翻譯而成，如有任何歧義，以簡體中文版本為準。"
    : locale === "en"
      ? "This text was translated from Simplified Chinese using AI; in the event of any discrepancies, the Simplified Chinese version prevails."
      : "このテキストは簡体字中国語から AI により翻訳されています。相違がある場合は、簡体字中国語版を優先します。";

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
            {aiNotice}
          </div>
        )}
        <div className="news-detail-cover" style={{ backgroundImage: `url(${item.cover})` }} />
        <div className="news-detail-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(item.body) }} />
        <NewsShare title={item.title} />
      </article>
    </div>
    <div className="page-bottom-nav"><div className="page-bottom-nav-inner"><PageBreadcrumb items={[{ label: messages.common.home, href: "/" }, { label: messages.common.news, href: "/news" }, { label: item.title }]} /></div></div>
  </main>;
}