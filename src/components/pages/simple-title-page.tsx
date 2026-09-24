import { PageLocation } from "@/components/layout/page-location";
import { PageTitleHero } from "@/components/layout/page-title-hero";
import { getLocaleMessages, type Locale } from "@/lib/i18n";

export function SimpleTitlePage({
  locale,
  title,
  image,
  imagePosition,
}: {
  locale: Locale;
  title: string;
  image: string;
  imagePosition?: string;
}) {
  const messages = getLocaleMessages(locale);

  return (
    <>
      <main className="title-page"><PageTitleHero title={title} image={image} imagePosition={imagePosition} /></main>
      <PageLocation ariaLabel={messages.common.pagePosition} items={[{ label: messages.common.home, href: "/" }, { label: title }]} />
    </>
  );
}
