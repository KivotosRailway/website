"use client";

import { useState } from "react";

export function NewsShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

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
      <h2 id="news-share-title">分享</h2>
      <div className="news-share-actions">
        <button type="button" className="news-share-button" onClick={copyLink} aria-label="复制链接">
          {copied ? "已复制" : "复制链接"}
        </button>
        <button type="button" className="news-share-button news-share-x" onClick={shareOnX} aria-label="分享到 X">X</button>
        <button type="button" className="news-share-button news-share-qq" onClick={shareOnQq} aria-label="分享到 QQ">QQ</button>
      </div>
    </section>
  );
}
