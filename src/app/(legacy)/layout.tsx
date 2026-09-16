import { SiteShell } from "@/components/layout/site-shell";

export default function LegacyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell locale="zh-Hans">{children}</SiteShell>;
}
