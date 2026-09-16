"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getInitialLocale, type Locale } from "@/lib/i18n";

export type HttpStatusCode = 403 | 404 | 500 | 502 | 503 | 504;

const statusMessages: Record<Locale, Record<HttpStatusCode, string>> = {
  "zh-CN": {
    403: "你没有权限访问此页面",
    404: "人与人的悲欢不尽相同",
    500: "服务器遇到了一点问题",
    502: "服务暂时无法连接",
    503: "服务暂时不可用",
    504: "服务响应超时",
  },
  "zh-TW": {
    403: "你沒有權限存取此頁面",
    404: "人與人的悲歡並不相同",
    500: "伺服器遇到了一點問題",
    502: "服務暫時無法連線",
    503: "服務暫時無法使用",
    504: "服務回應逾時",
  },
  en: {
    403: "You do not have permission to access this page",
    404: "We do not all share the same joys and sorrows",
    500: "The server ran into a problem",
    502: "The service is temporarily unreachable",
    503: "The service is temporarily unavailable",
    504: "The service took too long to respond",
  },
  ja: {
    403: "このページにアクセスする権限がありません",
    404: "人それぞれ、喜びも悲しみも違う",
    500: "サーバーで問題が発生しました",
    502: "サービスに一時的に接続できません",
    503: "サービスは一時的に利用できません",
    504: "サービスの応答がタイムアウトしました",
  },
};

const backLabels: Record<Locale, string> = {
  "zh-CN": "回到上一页",
  "zh-TW": "回到上一頁",
  en: "Go back",
  ja: "前のページに戻る",
};

function parseLocalizedMessages(source: string): Partial<Record<Locale, string[]>> {
  const messages: Partial<Record<Locale, string[]>> = {};
  let locale: Locale | null = null;

  for (const line of source.split(/\r?\n/)) {
    const localeMatch = line.match(/^(zh-CN|zh-TW|en|ja):\s*$/);
    if (localeMatch) {
      locale = localeMatch[1] as Locale;
      messages[locale] = [];
      continue;
    }

    const messageMatch = line.match(/^\s+-\s+(.+)$/);
    if (locale && messageMatch) messages[locale]?.push(messageMatch[1].trim());
  }

  return messages;
}

export function HttpStatusPage({ code }: { code: HttpStatusCode }) {
  const [locale, setLocale] = useState<Locale>("zh-CN");
  const [randomMessages, setRandomMessages] = useState<Partial<Record<Locale, string[]>>>({});
  const [randomMessage, setRandomMessage] = useState<string | null>(null);

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
    if (code !== 404) return;

    fetch("/error/404-messages.yml")
      .then((response) => response.ok ? response.text() : Promise.reject(new Error("Could not load 404 messages")))
      .then((source) => setRandomMessages(parseLocalizedMessages(source)))
      .catch(() => setRandomMessages({}));
  }, [code]);

  useEffect(() => {
    const messages = randomMessages[locale] ?? randomMessages["zh-CN"];
    if (!messages?.length) return;
    setRandomMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, [locale, randomMessages]);

  const returnToPreviousPage = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.assign("/");
  };

  return (
    <main className="status-page">
      <section className="status-content" aria-labelledby="status-title">
        <div className="status-content-inner">
          <p className="status-code">{code}</p>
          <Image src="/error/status-illustration.png" alt="" width={56} height={115} preload unoptimized />
          <h1 id="status-title">{code === 404 && randomMessage ? randomMessage : statusMessages[locale][code]}</h1>
          <button type="button" className="status-back-button" onClick={returnToPreviousPage}>
            {backLabels[locale]}
          </button>
        </div>
      </section>
    </main>
  );
}
