import fs from "fs/promises";
import path from "path";
import { localeContentDirectory, type Locale } from "@/lib/i18n";
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
  contentLocale: Locale;
};

function isPolicySlug(slug: string): slug is PolicySlug {
  return policySlugs.includes(slug as PolicySlug);
}

async function readPolicy(slug: PolicySlug, locale: Locale): Promise<PolicyDocument | null> {
  const filePath = path.join(process.cwd(), "src", "data", "policy", localeContentDirectory[locale], `${slug}.md`);

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
      markdownFile: `src/data/policy/${localeContentDirectory[locale]}/${slug}.md`,
      contentLocale: locale,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function getPolicyDocument(slug: string, locale: Locale): Promise<PolicyDocument | null> {
  if (!isPolicySlug(slug)) return null;
  const document = await readPolicy(slug, locale);
  return document ?? (locale === "zh-Hans" ? null : readPolicy(slug, "zh-Hans"));
}

export function getPolicySlugs() {
  return policySlugs.map((slug) => ({ slug }));
}
