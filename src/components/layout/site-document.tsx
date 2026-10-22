import type { Metadata, Viewport } from "next";
import { siteOrigin } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "基沃托斯铁道公团 KivotosRailway",
    template: "%s | 基沃托斯铁道公团 KivotosRailway",
  },
  description: "基沃托斯铁道公团官方网站，提供 Minecraft 铁路与城市建设、新闻、团队和加入信息。",
  icons: { icon: "/icon/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#10151d" },
  ],
};
