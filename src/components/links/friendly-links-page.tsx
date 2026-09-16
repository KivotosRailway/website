import links from "@/data/links.json";
import type { CSSProperties } from "react";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { getLocaleMessages, type Locale } from "@/lib/i18n";

type LinkEntry = { name: string; description: string; logo: string; url?: string; archived?: boolean };
type LocalizedText = Record<Locale, string>;
type LinkSection = { id: string; title: LocalizedText; links: LinkEntry[] };
const linkSections = links.sections as LinkSection[];

function FriendlyLinkCard({ link }: { link: LinkEntry }) {
  const content = <><span className="friendly-link-card-content"><span className="friendly-link-card-heading"><img src={link.logo} alt="" width={48} height={48} /><span>{link.name}</span></span><span className="friendly-link-card-description">{link.description}</span></span>{link.archived && <span className="friendly-link-card-archive">已归档</span>}</>;
  return link.url ? <a className="friendly-link-card" href={link.url} target="_blank" rel="noreferrer" aria-label={`访问 ${link.name}`}>{content}</a> : <article className="friendly-link-card">{content}</article>;
}

export function FriendlyLinksPage({ locale }: { locale: Locale }) {
  const messages = getLocaleMessages(locale);
  const heroStyle = { "--policy-hero-image": 'url("/links/friendly-links-hero.png")' } as CSSProperties;
  return <main className="policy-page friendly-links-page"><div className="policy-page-inner friendly-links-page-inner"><section className="policy-hero friendly-links-hero" aria-labelledby="friendly-links-title" style={heroStyle}><div className="policy-hero-inner"><h1 id="friendly-links-title">{messages.footer.legal[2]}</h1></div></section><div className="friendly-links-content">{linkSections.map((section) => <section className="friendly-links-section" key={section.id} aria-labelledby={`friendly-links-${section.id}`}><h2 id={`friendly-links-${section.id}`}>{section.title[locale]}</h2><div className="friendly-links-grid">{section.links.map((link, index) => <FriendlyLinkCard key={`${section.id}-${link.name}-${index}`} link={link} />)}</div></section>)}</div></div><div className="page-bottom-nav"><div className="page-bottom-nav-inner"><PageBreadcrumb items={[{ label: messages.common.home, href: "/" }, { label: messages.footer.legal[2] }]} /></div></div></main>;
}
