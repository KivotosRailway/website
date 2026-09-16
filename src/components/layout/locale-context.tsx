"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n";

export const LocaleContext = createContext<Locale>("zh-Hans");
export function useRouteLocale() { return useContext(LocaleContext); }

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
