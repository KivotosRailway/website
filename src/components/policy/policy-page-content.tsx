"use client";

import { useRouteLocale } from "@/components/layout/locale-context";

import { useEffect, useState } from "react";
import { getAiTranslationNotice, getInitialLocale, getLocaleMessages, type Locale } from "@/lib/i18n";
import type { PolicyDocument } from "@/data/policy";
import { PageLocation } from "@/components/layout/page-location";
import { PageTitleHero } from "@/components/layout/page-title-hero";

type PolicyCatalog = Partial<Record<Locale, PolicyDocument>>;

export function PolicyPageContent({ catalog }: { catalog: PolicyCatalog }) {
  const [locale, setLocale] = useState<Locale>(useRouteLocale());
  const document = catalog[locale] ?? catalog["zh-Hans"];
  const isTranslated = locale !== "zh-Hans" && Boolean(catalog[locale]);
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
      <main className="title-page policy-page">
        <PageTitleHero title={document.title} image="/policy-hero.webp" />
        <article className="policy-card">
          {isTranslated && (
            <div className="news-detail-ai-banner" aria-label="AI translated content">
              {getAiTranslationNotice(locale)}
            </div>
          )}
          <div className="policy-body" dangerouslySetInnerHTML={{ __html: document.html }} />
        </article>
      </main>
      <PageLocation
        ariaLabel={messages.common.pagePosition}
        items={[
          { label: messages.common.home, href: "/" },
          { label: messages.footer.columns[0].title },
          { label: document.title },
        ]}
      />
    </>
  );
}
