"use client";

import { useEffect, useState } from "react";
import { getAiTranslationNotice, getInitialLocale, getLocaleMessages, type Locale } from "@/lib/i18n";
import type { PolicyDocument } from "@/data/policy";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";

type PolicyCatalog = Partial<Record<Locale, PolicyDocument>>;

export function PolicyPageContent({ catalog }: { catalog: PolicyCatalog }) {
  const [locale, setLocale] = useState<Locale>("zh-CN");
  const document = catalog[locale] ?? catalog["zh-CN"];
  const isTranslated = locale !== "zh-CN" && Boolean(catalog[locale]);
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

  if (!document) return null;

  return (
    <>
      <section className="policy-hero" aria-labelledby="policy-title">
        <div className="policy-hero-inner">
          <h1 id="policy-title">{document.title}</h1>
        </div>
      </section>
      <article className="policy-card">
        {isTranslated && (
          <div className="news-detail-ai-banner" aria-label="AI translated content">
            {getAiTranslationNotice(locale)}
          </div>
        )}
        <div className="policy-body" dangerouslySetInnerHTML={{ __html: document.html }} />
      </article>
      <div className="page-bottom-nav">
        <div className="page-bottom-nav-inner">
          <PageBreadcrumb
            ariaLabel={messages.common.pagePosition}
            items={[
              { label: messages.common.home, href: "/" },
              { label: messages.footer.columns[0].title },
              { label: document.title },
            ]}
          />
        </div>
      </div>
    </>
  );
}