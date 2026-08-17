import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kivotos Railway",
  description: "Kivotos Railway website",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
