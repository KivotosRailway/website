import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

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
    <html lang="zh-CN" suppressHydrationWarning>
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
      </head>
      <body>
        <SiteHeader />{children}<SiteFooter />
      </body>
    </html>
  );
}
