"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { applyLocale, getInitialLocale, getLocaleMessages, type Locale } from "@/lib/i18n";

const footerColumnHrefs = [
  ["/policy/user-agreement", "/policy/privacy-policy", "/policy/disclaimer", "/policy/resource-pack"],
  ["/about", "/join-us"],
  ["mailto:connect@kivotos.cc", "mailto:infringement@kivotos.cc"],
] as const;

const footerLegalHrefs = ["https://wiki.kivotosrailway.com", "https://url.kivotos.cc/status", "/links"] as const;

function isIcpVisibleHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" || hostname.endsWith(".kivotos.cc");
}

export function SiteFooter() {
  const [locale, setLocale] = useState<Locale>("zh-CN");
  const [showIcp, setShowIcp] = useState(false);

  useEffect(() => {
    const syncLocale = (nextLocale: Locale) => setLocale(nextLocale);
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
    setShowIcp(isIcpVisibleHost(window.location.hostname));
    window.addEventListener("kr-locale-change", handleLocaleChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("kr-locale-change", handleLocaleChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const messages = getLocaleMessages(locale);

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <div className="site-footer-socials" aria-label="socials">
            <span className="site-footer-title">{messages.footer.follow}</span>
            <div className="site-footer-icons">
              {messages.footer.social.map((item, index) => (
                <a key={`social-${index}`} href="#" aria-label={item} className="site-footer-icon" title={item}>
                  {[
                    "◌",
                    "◍",
                    "X",
                    "in",
                    "▶",
                  ][index] ?? "•"}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="site-footer-main">
          <div className="site-footer-columns">
            {messages.footer.columns.map((group, groupIndex) => (
              <div key={`column-${groupIndex}`} className="site-footer-column">
                <h3>{group.title}</h3>
                <ul>
                  {group.links.map((link, linkIndex) => (
                    <li key={`column-${groupIndex}-link-${linkIndex}`}><a href={footerColumnHrefs[groupIndex][linkIndex]}>{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="site-footer-brand-wrap">
            <div className="site-footer-brand" aria-label="Kivotos Railway">
              <Image
                src="/icon/kivotosrailway.svg"
                alt="Kivotos Railway"
                width={270}
                height={58}
                className="site-footer-brand-logo"
              />
            </div>
          </div>
        </div>

        <div className="site-footer-meta">
          <div className="site-footer-legal-row">
            {messages.footer.legal.map((item, itemIndex) => (
              <a key={`legal-${itemIndex}`} href={footerLegalHrefs[itemIndex]}>{item}</a>
            ))}
          </div>
          <p className="site-footer-description">{messages.footer.description}</p>
          <div className="site-footer-copyright-row">
            <span>{messages.footer.copyright}</span>
            {showIcp && (
              <a
                className="site-footer-icp"
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noreferrer"
              >
                {messages.footer.icp}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
