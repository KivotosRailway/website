"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { applyLocale, getInitialLocale, getLocaleMessages, localeLabels, locales, localeShortLabels, type Locale } from "@/lib/i18n";

export function SiteHeader() {
  const [locale, setLocale] = useState<Locale>("zh-CN");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateDocumentTitle = (nextLocale: Locale) => {
      const messages = getLocaleMessages(nextLocale);
      const pathname = window.location.pathname;
      const currentTitle = document.title.split(" | ")[0];
      const pageLabel = pathname === "/"
        ? ""
        : pathname === "/news"
          ? messages.common.news
          : currentTitle;

      document.title = pageLabel ? `${pageLabel} | ${messages.common.siteTitle}` : messages.common.siteTitle;
    };

    const syncLocale = (nextLocale: Locale) => {
      setLocale(nextLocale);
      updateDocumentTitle(nextLocale);
    };

    const handleLocaleChange = (event: Event) => {
      const nextLocale = (event as CustomEvent<{ locale?: Locale }>).detail?.locale ?? getInitialLocale();
      syncLocale(nextLocale);
    };

    const handleStorage = () => {
      syncLocale(getInitialLocale());
    };

    const currentLocale = getInitialLocale();
    syncLocale(currentLocale);
    applyLocale(currentLocale);

    window.addEventListener("kr-locale-change", handleLocaleChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("kr-locale-change", handleLocaleChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const messages = getLocaleMessages(locale);

  return (
    <header className="site-header">
      <Link className="site-logo" href="/" aria-label={`Kivotos Railway ${localeLabels[locale]}`}>
        <Image
          className="site-logo-image"
          src="/icon/kivotosrailway.svg"
          alt="Kivotos Railway"
          width={240}
          height={64}
          priority
        />
      </Link>
      <nav className={`site-navigation${menuOpen ? " is-open" : ""}`} aria-label={localeLabels[locale]}>
        {messages.header.nav.map((label, index) => {
          const href = ["/", "/news", "/railway", "/about", "/members"][index] ?? "/";
          return (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="site-header-actions">
        <div className="site-locale" aria-label="语言选择">
          {locales.map((item) => (
            <button
              key={item}
              type="button"
              className={item === locale ? "active" : ""}
              aria-pressed={item === locale}
              onClick={() => {
                setLocale(item);
                applyLocale(item);
              }}
              aria-label={localeLabels[item]}
              title={localeLabels[item]}
            >
              <span className="locale-button-label">{localeShortLabels[item]}</span>
            </button>
          ))}
        </div>
        <button
          className="site-menu-button"
          type="button"
          aria-label="打开导航"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
