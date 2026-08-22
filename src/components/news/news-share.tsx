"use client";

import { useEffect, useState } from "react";
import { getInitialLocale, getLocaleMessages, type Locale } from "@/lib/i18n";

export function NewsShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
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

  const getPageUrl = () => window.location.href;

  const copyLink = async () => {
    await navigator.clipboard.writeText(getPageUrl());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const shareOnX = () => {
    const url = encodeURIComponent(getPageUrl());
    const text = encodeURIComponent(title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank", "noopener,noreferrer");
  };

  const shareOnQq = () => {
    const url = encodeURIComponent(getPageUrl());
    const text = encodeURIComponent(title);
    window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="news-share" aria-labelledby="news-share-title">
      <h2 id="news-share-title">{messages.common.share}</h2>
      <div className="news-share-actions">
        <button type="button" className="news-share-button" onClick={copyLink} aria-label={messages.common.copyLink}>
          {copied ? messages.common.copied : messages.common.copyLink}
        </button>
        <button type="button" className="news-share-button news-share-x" onClick={shareOnX} aria-label={messages.common.shareX}>X</button>
        <button type="button" className="news-share-button news-share-qq" onClick={shareOnQq} aria-label={messages.common.shareQq}>QQ</button>
      </div>
    </section>
  );
}
