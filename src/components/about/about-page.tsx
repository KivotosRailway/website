import { PageActionCards } from "@/components/layout/page-action-cards";
import { PageLocation } from "@/components/layout/page-location";
import { PageTitleHero } from "@/components/layout/page-title-hero";
import { getLocaleMessages, type Locale } from "@/lib/i18n";

const introduction: Record<Locale, { label: string; title: [string, string, string] }> = {
  "zh-Hans": { label: "小简介", title: ["铁道+建筑+生存", "一个以高兴就好的", "小服务器"] },
  "zh-Hant": { label: "小簡介", title: ["鐵道＋建築＋生存", "一個以開心為主的", "小伺服器"] },
  en: { label: "A short introduction", title: ["Railways, building", "and survival — a small", "server built for joy."] },
  jp: { label: "紹介", title: ["鉄道・建築・サバイバル", "楽しさを大切にする", "小さなサーバーです"] },
};

export function AboutPage({ locale }: { locale: Locale }) {
  const messages = getLocaleMessages(locale);
  const title = messages.footer.columns[1].links[0];
  const copy = introduction[locale];

  return (
    <>
      <main className="title-page about-page">
        <PageTitleHero title={title} image="/pages/about-hero.png" imagePosition="center 52%" />

        <section className="about-introduction" aria-labelledby="about-introduction-title">
          <div className="about-introduction-copy">
            <p>{copy.label}</p>
            <h2 id="about-introduction-title">{copy.title[0]}<br />{copy.title[1]}<br />{copy.title[2]}</h2>
          </div>
          <div className="about-introduction-image" aria-hidden="true" />
        </section>

        <PageActionCards
          locale={locale}
          label={messages.footer.columns[1].title}
          className="about-action-cards"
          items={[
            { href: "/members", image: "/home/about-card.png", label: messages.footer.columns[1].links[1] },
            { href: "/join-us", image: "/home/join-card.png", label: messages.footer.columns[1].links[2] },
          ]}
        />
      </main>
      <PageLocation
        ariaLabel={messages.common.pagePosition}
        items={[{ label: messages.common.home, href: "/" }, { label: messages.footer.columns[1].title }, { label: title }]}
      />
    </>
  );
}
