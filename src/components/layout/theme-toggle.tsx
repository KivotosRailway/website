"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getInitialLocale, getLocaleMessages, type Locale } from "@/lib/i18n";

type ThemePreference = "light" | "system" | "dark";
type ResolvedTheme = "light" | "dark";
const themeCookieName = "kr-theme";

function getThemeCookie(): ThemePreference | null {
  const value = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${themeCookieName}=`))
    ?.slice(themeCookieName.length + 1);

  return value === "light" || value === "system" || value === "dark" ? value : null;
}

function getInitialThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "system";

  const cookieTheme = getThemeCookie();
  if (cookieTheme) return cookieTheme;

  const savedTheme = window.localStorage.getItem("kr-theme");
  return savedTheme === "light" || savedTheme === "system" || savedTheme === "dark" ? savedTheme : "system";
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(preference: ThemePreference) {
  const theme = resolveTheme(preference);
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem("kr-theme", preference);
  document.cookie = `${themeCookieName}=${preference}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function ThemeToggle() {
  const [themePreference, setThemePreference] = useState<ThemePreference>("system");
  const [locale, setLocale] = useState<Locale>("zh-CN");

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
  }, []);

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
