import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "基沃托斯铁道公团 KivotosRailway",
    template: "%s | 基沃托斯铁道公团 KivotosRailway",
  },
  description: "Kivotos Railway website",
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
