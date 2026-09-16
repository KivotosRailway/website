import SiteDocument from "@/components/layout/site-document";

export { metadata, viewport } from "@/components/layout/site-document";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteDocument>{children}</SiteDocument>;
}
