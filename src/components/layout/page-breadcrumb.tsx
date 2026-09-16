"use client";

import { useRouteLocale } from "@/components/layout/locale-context";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getInitialLocale, withLocale, type Locale } from "@/lib/i18n";

export function PageBreadcrumb({
  items,
  ariaLabel = "Page position",
}: {
  items: Array<{ label: string; href?: string }>;
  ariaLabel?: string;
}) {
  const [locale, setLocale] = useState<Locale>(useRouteLocale());

  useEffect(() => {
    const syncLocale = () => setLocale(getInitialLocale());
    syncLocale();
    window.addEventListener("kr-locale-change", syncLocale);
    return () => window.removeEventListener("kr-locale-change", syncLocale);
  }, []);

  return (
    <nav className="page-breadcrumb" aria-label={ariaLabel}>
      {items.map((item, index) => (
        <span className="page-breadcrumb-item" key={`${item.label}-${index}`}>
          {index > 0 && <span className="page-breadcrumb-separator" aria-hidden="true">›</span>}
          {item.href ? <Link href={withLocale(item.href, locale)}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
