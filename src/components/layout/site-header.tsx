"use client";

import { useRouteLocale } from "@/components/layout/locale-context";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { withLocale, getLocaleMessages, localeLabels, locales, localeShortLabels, type Locale } from "@/lib/i18n";

export function SiteHeader() {
  const locale = useRouteLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const changeLocale = (nextLocale: Locale) => {
    try {
      window.localStorage.setItem("kr-locale", nextLocale);
    } catch { /* The URL remains the source of truth when storage is unavailable. */ }

    const href = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    router.replace(withLocale(href, nextLocale));
  };

  const messages = getLocaleMessages(locale);

  return (
    <header className="site-header">
      <Link className="site-logo" href={withLocale("/", locale)} aria-label={`Kivotos Railway ${localeLabels[locale]}`}>
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
          const href = ["/", "/news", "/railway", "/city", "/about"][index] ?? "/";
          return (
            <Link key={href} href={withLocale(href, locale)} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          );
        })}
        <div className="site-mobile-locale" aria-label="语言选择">
          {locales.map((item) => (
            <button
              key={item}
              type="button"
              className={item === locale ? "active" : ""}
              aria-pressed={item === locale}
              onClick={() => {
                changeLocale(item);
              }}
              aria-label={localeLabels[item]}
              title={localeLabels[item]}
            >
              <span className="locale-button-label">{localeShortLabels[item]}</span>
            </button>
          ))}
        </div>
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
                changeLocale(item);
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
