import fs from "fs/promises";
import path from "path";
import type { Locale } from "@/lib/i18n";
import { parseFrontmatter } from "@/data/news";
import { markdownToHtml } from "@/lib/markdown";

export const policySlugs = ["user-agreement", "privacy-policy", "disclaimer", "resource-pack"] as const;
export type PolicySlug = (typeof policySlugs)[number];

export type PolicyDocument = {
  slug: PolicySlug;
  title: string;
  translationLabel: string;
  body: string;
  html: string;
  markdownFile: string;
};

function isPolicySlug(slug: string): slug is PolicySlug {
  return policySlugs.includes(slug as PolicySlug);
}

async function readPolicy(slug: PolicySlug, locale: Locale): Promise<PolicyDocument | null> {
  const filePath = path.join(process.cwd(), "src", "data", "policy", locale, `${slug}.md`);

  try {
    const body = await fs.readFile(filePath, "utf-8");
    const frontmatter = parseFrontmatter(body);
    const title = frontmatter.title?.trim();
    const translationLabel = frontmatter.translationLabel?.trim() || "AI translated";
    const content = body.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();

    if (!title || !content) return null;

    return {
      slug,
      title,
      translationLabel,
      body: content,
      html: markdownToHtml(content),
      markdownFile: `src/data/policy/${locale}/${slug}.md`,
    };
  } catch {
    return null;
  }
}

export async function getPolicyCatalog(slug: string): Promise<Partial<Record<Locale, PolicyDocument>>> {
  if (!isPolicySlug(slug)) return {};

  const entries = await Promise.all(
    (["zh-CN", "zh-TW", "en", "ja"] as Locale[]).map(async (locale) => [locale, await readPolicy(slug, locale)] as const),
  );

  return Object.fromEntries(entries.filter(([, document]) => document)) as Partial<Record<Locale, PolicyDocument>>;
}

export function getPolicySlugs() {
  return policySlugs.map((slug) => ({ slug }));
}