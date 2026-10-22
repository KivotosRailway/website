import { getAiTranslationNotice, getLocaleMessages, type Locale } from "@/lib/i18n";
import type { PolicyDocument } from "@/data/policy";
import { PageLocation } from "@/components/layout/page-location";
import { PageTitleHero } from "@/components/layout/page-title-hero";

export function PolicyPageContent({ document, locale }: { document: PolicyDocument; locale: Locale }) {
  const isTranslated = document.contentLocale !== "zh-Hans";
  const messages = getLocaleMessages(locale);

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
