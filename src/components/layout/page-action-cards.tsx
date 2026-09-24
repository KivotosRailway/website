import Link from "next/link";
import { withLocale, type Locale } from "@/lib/i18n";

export type PageActionCard = {
  href: string;
  image: string;
  label: string;
};

export function PageActionCards({
  locale,
  label,
  items,
  className = "",
}: {
  locale: Locale;
  label: string;
  items: PageActionCard[];
  className?: string;
}) {
  return (
    <section className={`page-action-cards ${className}`.trim()} aria-label={label}>
      {items.map((item) => (
        <Link key={item.href} href={withLocale(item.href, locale)} className="page-action-card">
          <div className="page-action-image" style={{ backgroundImage: `url("${item.image}")` }} aria-hidden="true" />
          <span>{item.label} <b aria-hidden="true">→</b></span>
        </Link>
      ))}
    </section>
  );
}
