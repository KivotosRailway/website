"use client";

import { useRouteLocale } from "@/components/layout/locale-context";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { applyLocale, getInitialLocale, withLocale, getLocaleMessages, type Locale } from "@/lib/i18n";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const footerColumnHrefs = [
  ["/policy/user-agreement", "/policy/privacy-policy", "/policy/disclaimer", "/policy/resource-pack"],
  ["/about", "/members", "/join-us"],
  ["mailto:connect@kivotos.cc", "mailto:infringement@kivotos.cc"],
] as const;

const footerLegalHrefs = ["https://wiki.kivotosrailway.com", "https://url.kivotos.cc/status", "/links"] as const;

const socialLinks = [
  { label: "Bilibili", icon: "/icon/social/bilibili.svg", width: 28, height: 25, href: "https://space.bilibili.com/14823193" },
  { label: "X", icon: "/icon/social/x.svg", width: 27, height: 28, href: "https://x.com/kivotosrailway" },
  { label: "Xiaohongshu", icon: "/icon/social/xiaohongshu.svg", width: 28, height: 10, href: "https://www.xiaohongshu.com/user/profile/655396cf0000000008003eea" },
] as const;

function isIcpVisibleHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" || hostname.endsWith(".kivotos.cc");
}

const subscribeToHost = () => () => {};
const getIcpVisibility = () => typeof window !== "undefined" && isIcpVisibleHost(window.location.hostname);
const getServerIcpVisibility = () => false;

export function SiteFooter() {
  const [locale, setLocale] = useState<Locale>(useRouteLocale());
  const showIcp = useSyncExternalStore(subscribeToHost, getIcpVisibility, getServerIcpVisibility);

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
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className="site-footer-icon" title={social.label}>
                  <Image src={social.icon} alt="" width={social.width} height={social.height} />
                </a>
              ))}
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="site-footer-main">
          <div className="site-footer-columns">
            {messages.footer.columns.map((group, groupIndex) => (
              <div key={`column-${groupIndex}`} className="site-footer-column">
                <h3>{group.title}</h3>
                <ul>
                  {group.links.map((link, linkIndex) => {
                    const href = withLocale(footerColumnHrefs[groupIndex][linkIndex], locale);
                    return <li key={`column-${groupIndex}-link-${linkIndex}`}>
                      {href.startsWith("/") ? <Link href={href}>{link}</Link> : <a href={href}>{link}</a>}
                    </li>;
                  })}
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
            {messages.footer.legal.map((item, itemIndex) => {
              const href = withLocale(footerLegalHrefs[itemIndex], locale);
              return href.startsWith("/")
                ? <Link key={`legal-${itemIndex}`} href={href}>{item}</Link>
                : <a key={`legal-${itemIndex}`} href={href}>{item}</a>;
            })}
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
