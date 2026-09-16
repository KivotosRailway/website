"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { applyLocale, getInitialLocale } from "@/lib/i18n";

export function LocaleUrlSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    applyLocale(getInitialLocale());
  }, [pathname, searchParams]);

  return null;
}
