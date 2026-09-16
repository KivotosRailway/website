import type { Metadata, Viewport } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "基沃托斯铁道公团 KivotosRailway",
    template: "%s | 基沃托斯铁道公团 KivotosRailway",
  },
  description: "Kivotos Railway website",
  icons: {
    icon: "/icon/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans" suppressHydrationWarning>
      <head>
        {/* Run during HTML parsing, before the body can paint. */}
        <script
          id="theme-preference"
          dangerouslySetInnerHTML={{ __html: `(() => {
            const isTheme = (value) => value === 'light' || value === 'system' || value === 'dark';
            let preference = 'system';
            try {
              const cookieTheme = document.cookie.split(';').map((entry) => entry.trim()).find((entry) => entry.startsWith('kr-theme='))?.slice('kr-theme='.length);
              const savedTheme = isTheme(cookieTheme) ? cookieTheme : localStorage.getItem('kr-theme');
              if (isTheme(savedTheme)) preference = savedTheme;
            } catch {}
            const theme = preference === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : preference;
            document.documentElement.dataset.theme = theme;
            document.documentElement.style.colorScheme = theme;
          })();` }}
        />
        <script
          id="locale-canonicalization"
          dangerouslySetInnerHTML={{ __html: `(() => {
            const canonicalLocale = (value) => {
              const language = value?.toLowerCase().replaceAll('_', '-');
              if (!language) return null;
              if (/^zh(?:-|$)/.test(language)) return /^zh-(tw|hk|mo)(-|$)|-hant(?:-|$)/.test(language) ? 'zh-Hant' : 'zh-Hans';
              if (/^en(?:-|$)/.test(language)) return 'en';
              if (/^(ja|jp)(?:-|$)/.test(language)) return 'jp';
              return null;
            };
            const parts = location.pathname.split('/');
            const firstSegment = parts[1];
            const pathLocale = canonicalLocale(firstSegment);
            const isUnknownLanguagePath = !pathLocale && /^[a-z]{2,3}(?:-[a-z0-9]+)*$/i.test(firstSegment ?? '');
            let locale = pathLocale;
            if (!locale) {
              try { locale = canonicalLocale(localStorage.getItem('kr-locale')); } catch {}
            }
            if (!locale) {
              for (const language of navigator.languages?.length ? navigator.languages : [navigator.language]) {
                locale = canonicalLocale(language);
                if (locale) break;
              }
            }
            locale ??= 'en';
            const path = pathLocale || isUnknownLanguagePath ? '/' + parts.slice(2).join('/') : location.pathname;
            const normalizedPath = path.replace(/\\/$/, '');
            const destination = '/' + locale + normalizedPath + '/';
            const search = new URLSearchParams(location.search);
            search.delete('lang');
            const canonicalUrl = destination + (search.size ? '?' + search : '') + location.hash;
            if (location.pathname + location.search + location.hash !== canonicalUrl) location.replace(canonicalUrl);
          })();` }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
