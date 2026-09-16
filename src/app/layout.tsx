import "@/app/globals.css";

export { metadata, viewport } from "@/components/layout/site-document";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
