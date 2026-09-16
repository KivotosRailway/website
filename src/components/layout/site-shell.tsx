import { Suspense } from "react";
import type { Locale } from "@/lib/i18n";
import { LocaleProvider } from "@/components/layout/locale-context";
import { LocaleUrlSync } from "@/components/layout/locale-url-sync";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function SiteShell({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return (
    <LocaleProvider locale={locale}>
      <Suspense fallback={null}><LocaleUrlSync /></Suspense>
      <SiteHeader />{children}<SiteFooter />
    </LocaleProvider>
  );
}
