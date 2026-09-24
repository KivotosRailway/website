import members from "@/data/members.json";
import { PageLocation } from "@/components/layout/page-location";
import { PageTitleHero } from "@/components/layout/page-title-hero";
import { getLocaleMessages, type Locale } from "@/lib/i18n";

type LocalizedText = Record<Locale, string>;
type MemberEntry = {
  name: string;
  role: string;
  avatar?: string;
  url?: string;
  i18n?: { name?: Partial<LocalizedText>; role?: Partial<LocalizedText> };
};
type MemberSection = { id: string; title: LocalizedText; members: MemberEntry[] };
type MembersData = { title: LocalizedText; empty: LocalizedText; sections: MemberSection[] };

const memberData = members as MembersData;

function localized(value: string, translations: Partial<LocalizedText> | undefined, locale: Locale) {
  return translations?.[locale] ?? value;
}

function MemberCard({ member, locale }: { member: MemberEntry; locale: Locale }) {
  const name = localized(member.name, member.i18n?.name, locale);
  const role = localized(member.role, member.i18n?.role, locale);
  const content = (
    <>
      <div className="member-card-avatar">
        {member.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element -- Member data may use static or remote avatar URLs in a static export.
          <img src={member.avatar} alt="" width={285} height={285} />
        ) : <span aria-hidden="true">{name.slice(0, 1)}</span>}
      </div>
      <div className="member-card-copy"><h3>{name}</h3>{role && <p>{role}</p>}</div>
    </>
  );

  return member.url ? (
    <a className="member-card" href={member.url} target="_blank" rel="noreferrer" aria-label={name}>{content}</a>
  ) : <article className="member-card">{content}</article>;
}

export function MembersPage({ locale }: { locale: Locale }) {
  const messages = getLocaleMessages(locale);
  const pageTitle = memberData.title[locale];

  return (
    <>
      <main className="title-page members-page">
        <PageTitleHero title={pageTitle} image="/members/members-hero.png" imagePosition="center 47%" />
        <div className="members-sections">
          {memberData.sections.map((section) => (
            <section className="member-section" key={section.id} aria-labelledby={`members-${section.id}`}>
              <header className="member-section-heading"><h2 id={`members-${section.id}`}>{section.title[locale]}</h2><span aria-hidden="true" /></header>
              {section.members.length ? (
                <div className="member-grid">
                  {section.members.map((member, index) => <MemberCard key={`${section.id}-${member.name}-${index}`} member={member} locale={locale} />)}
                </div>
              ) : <p className="member-empty">{memberData.empty[locale]}</p>}
            </section>
          ))}
        </div>
      </main>
      <PageLocation
        ariaLabel={messages.common.pagePosition}
        items={[{ label: messages.common.home, href: "/" }, { label: messages.footer.columns[1].title }, { label: pageTitle }]}
      />
    </>
  );
}
