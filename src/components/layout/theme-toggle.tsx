"use client";

import { useRouteLocale } from "@/components/layout/locale-context";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { applyTheme, getInitialThemePreference, type ThemePreference } from "@/lib/theme";
import { useEffect, useState } from "react";
import { getInitialLocale, getLocaleMessages, type Locale } from "@/lib/i18n";

export function ThemeToggle() {
  const pathname = usePathname();
  const [themePreference, setThemePreference] = useState<ThemePreference>("system");
  const [locale, setLocale] = useState<Locale>(useRouteLocale());

  useEffect(() => {
    const syncTheme = () => {
      const preference = getInitialThemePreference();
      setThemePreference(preference);
      applyTheme(preference);
    };
    const syncLocale = () => setLocale(getInitialLocale());
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => {
      if (getInitialThemePreference() === "system") applyTheme("system");
    };

    syncTheme();
    syncLocale();
    window.addEventListener("kr-locale-change", syncLocale);
    window.addEventListener("storage", syncTheme);
    mediaQuery.addEventListener("change", syncSystemTheme);

    return () => {
      window.removeEventListener("kr-locale-change", syncLocale);
      window.removeEventListener("storage", syncTheme);
      mediaQuery.removeEventListener("change", syncSystemTheme);
    };
  }, [pathname]);

  const messages = getLocaleMessages(locale);
  const options: { theme: ThemePreference; label: string; icon: string }[] = [
    { theme: "dark", label: messages.common.useDarkTheme, icon: "/icon/theme/light.svg" },
    { theme: "light", label: messages.common.useLightTheme, icon: "/icon/theme/system.svg" },
    { theme: "system", label: messages.common.useSystemTheme, icon: "/icon/theme/dark.svg" },
  ];

  return (
    <div className="theme-toggle" aria-label={messages.common.theme}>
      {options.map((option) => (
        <button
          key={option.theme}
          type="button"
          className={themePreference === option.theme ? "active" : ""}
          aria-label={option.label}
          aria-pressed={themePreference === option.theme}
          title={option.label}
          onClick={() => {
            setThemePreference(option.theme);
            applyTheme(option.theme);
          }}
        >
          <Image src={option.icon} alt="" width={14} height={14} />
        </button>
      ))}
    </div>
  );
}
