import Script from "next/script";
import "@/app/globals.css";

export { metadata, viewport } from "@/components/layout/site-document";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans" suppressHydrationWarning>
      <body>
        {children}
        <Script id="theme-preference" src="/init-theme.js" strategy="beforeInteractive" />
        <Script id="locale-canonicalization" src="/init-locale.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
