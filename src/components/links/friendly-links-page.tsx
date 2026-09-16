import links from "@/data/links.json";
import type { CSSProperties } from "react";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { getLocaleMessages, type Locale } from "@/lib/i18n";

type LocalizedText = Partial<Record<Locale, string>>;
type LinkEntry = {
  name: string;
  description: string;
  logo: string;
  url?: string;
  archived?: boolean;
  i18n?: { name?: LocalizedText; description?: LocalizedText };
};
type LinkSection = { id: string; title: Record<Locale, string>; links: LinkEntry[] };

const linkSections = links.sections as LinkSection[];

function localized(value: string, translations: LocalizedText | undefined, locale: Locale) {
  return translations?.[locale] ?? value;
}

function FriendlyLinkCard({ link, locale, visitLabel }: { link: LinkEntry; locale: Locale; visitLabel: string }) {
  const name = localized(link.name, link.i18n?.name, locale);
  const description = localized(link.description, link.i18n?.description, locale);
  const content = (
    <>
      <span className="friendly-link-card-content">
        <span className="friendly-link-card-heading">
          <span className="friendly-link-card-logo">
            {/* eslint-disable-next-line @next/next/no-img-element -- Static export has no Image Optimization API. */}
            <img src={link.logo} alt="" width={66} height={66} />
          </span>
          <span>{name}</span>
        </span>
        <span className="friendly-link-card-description">{description}</span>
      </span>
      {link.archived && <span className="friendly-link-card-archive">已归档</span>}
    </>
  );

  return link.url ? (
    <a className="friendly-link-card" href={link.url} target="_blank" rel="noreferrer" aria-label={`${visitLabel} ${name}`}>
      {content}
    </a>
  ) : <article className="friendly-link-card">{content}</article>;
}

export function FriendlyLinksPage({ locale }: { locale: Locale }) {
  const messages = getLocaleMessages(locale);
  const heroStyle = { "--policy-hero-image": 'url("/links/friendly-links-hero.png")' } as CSSProperties;
  const visitLabels: Record<Locale, string> = { "zh-Hans": "访问", "zh-Hant": "造訪", en: "Visit", jp: "訪問" };

  return (
    <main className="policy-page friendly-links-page">
      <div className="policy-page-inner friendly-links-page-inner">
        <section className="policy-hero friendly-links-hero" aria-labelledby="friendly-links-title" style={heroStyle}>
          <div className="policy-hero-inner"><h1 id="friendly-links-title">{messages.footer.legal[2]}</h1></div>
        </section>
        <div className="friendly-links-content">
          {linkSections.map((section) => (
            <section className="friendly-links-section" key={section.id} aria-labelledby={`friendly-links-${section.id}`}>
              <h2 id={`friendly-links-${section.id}`}>{section.title[locale]}</h2>
              <div className="friendly-links-grid">
                {section.links.map((link, index) => <FriendlyLinkCard key={`${section.id}-${link.name}-${index}`} link={link} locale={locale} visitLabel={visitLabels[locale]} />)}
              </div>
            </section>
          ))}
        </div>
      </div>
      <div className="page-bottom-nav"><div className="page-bottom-nav-inner"><PageBreadcrumb items={[{ label: messages.common.home, href: "/" }, { label: messages.footer.legal[2] }]} /></div></div>
    </main>
  );
}
