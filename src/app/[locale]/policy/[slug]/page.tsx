import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PolicyPageContent } from "@/components/policy/policy-page-content";
import { getPolicyDocument, getPolicySlugs } from "@/data/policy";
import { isLocale } from "@/lib/i18n";
import { descriptionFromMarkdown, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPolicySlugs();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  if (!isLocale(locale)) notFound();
  const document = await getPolicyDocument(slug, locale);
  if (!document) notFound();
  return pageMetadata(locale, `/policy/${slug}`, { title: document.title, description: descriptionFromMarkdown(document.body) });
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  if (!isLocale(locale)) notFound();
  const document = await getPolicyDocument(slug, locale);
  if (!document) notFound();
  return <PolicyPageContent document={document} locale={locale} />;
}
