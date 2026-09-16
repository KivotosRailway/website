"use client";

import { useRouteLocale } from "@/components/layout/locale-context";

import { useEffect, useState } from "react";
import { getInitialLocale, getLocaleMessages, type Locale } from "@/lib/i18n";

export function NewsPageHeading() {
  const [locale, setLocale] = useState<Locale>(useRouteLocale());
  useEffect(() => {
    const sync = () => setLocale(getInitialLocale());
    sync();
    window.addEventListener("kr-locale-change", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("kr-locale-change", sync); window.removeEventListener("storage", sync); };
  }, []);
  return <h1>{getLocaleMessages(locale).common.news}</h1>;
}