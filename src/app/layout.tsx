import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body><SiteHeader />{children}<SiteFooter /></body>
    </html>
  );
}
