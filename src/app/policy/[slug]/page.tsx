import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PolicyPageContent } from "@/components/policy/policy-page-content";
import { getPolicyCatalog, getPolicySlugs } from "@/data/policy";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPolicySlugs();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await getPolicyCatalog(slug);
  return { title: catalog["zh-CN"]?.title ?? "法律信息" };
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalog = await getPolicyCatalog(slug);
  if (!catalog["zh-CN"]) notFound();

  return (
    <main className="policy-page">
      <div className="policy-page-inner">
        <PolicyPageContent catalog={catalog} />
      </div>
    </main>
  );
}