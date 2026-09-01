import fs from "fs/promises";
import path from "path";
import type { Locale } from "@/lib/i18n";

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  cover: string;
  href: string;
  category: string;
  tags: string[];
  markdownFile: string;
  body: string;
};

type NewsFrontmatter = {
  title?: string;
  date?: string;
  cover?: string;
  category?: string | string[];
  tags?: string[];
  slug?: string;
};

function parseFrontmatter(markdown: string): NewsFrontmatter {
  const frontmatterMatch = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!frontmatterMatch) {
    return {};
  }

  const frontmatter = frontmatterMatch[1];
  const result: Record<string, string | string[]> = {};
  let listKey: "tags" | "category" | null = null;

  for (const line of frontmatter.split(/\r?\n/)) {
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && listKey) {
      const values = Array.isArray(result[listKey]) ? result[listKey] as string[] : [];
      values.push(listItem[1].trim());
      result[listKey] = values;
      continue;
    }

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['\"]|['\"]$/g, "");

    if (key) {
      listKey = value === "" && (key === "tags" || key === "category") ? key : null;
      result[key] = value;
    }
  }

  return result;
}

function stripFrontmatter(markdown: string): string {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
}

const DEFAULT_NEWS_COVER = "https://r2-image.kivotosrailway.com/2025/05/01/681397ba4e763.png";

function normalizeNewsItem(fileName: string, raw: NewsFrontmatter, body: string): NewsItem | null {
  const title = raw.title?.trim();
  const date = raw.date?.trim() || "未注明日期";
  const category = (Array.isArray(raw.category) ? raw.category[0] : raw.category)?.trim() || "未分类";
  const tags = raw.tags ?? [];
  const cover = raw.cover?.trim() || DEFAULT_NEWS_COVER;
  const slug = raw.slug?.trim() || fileName.replace(/\.md$/i, "");

  if (!title) {
    return null;
  }

  return {
    id: slug,
    slug,
    title,
    date,
    cover,
    href: `/news/${slug}`,
    category,
    tags,
    markdownFile: `src/data/news/posts/${fileName}`,
    body,
  };
}

export function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, "\n").trim().split("\n");
  const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const renderInline = (text: string) =>
    escapeHtml(text)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt: string, source: string) =>
        `<img src="${source.replace(/"/g, "&quot;")}" alt="${alt.replace(/"/g, "&quot;")}" />`,
      )
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");

  const html: string[] = [];
  let paragraph: string[] = [];
  let listType: "ol" | "ul" | null = null;
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push(`<p>${renderInline(paragraph.join(" ").trim())}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listType && listItems.length > 0) {
      html.push(`<${listType}>${listItems.map((item) => `<li>${renderInline(item)}</li>`).join("")}</${listType}>`);
    }
    listType = null;
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushParagraph();
      flushList();
      html.push(`<p><img src="${imageMatch[2].replace(/"/g, "&quot;")}" alt="${imageMatch[1].replace(/"/g, "&quot;")}" /></p>`);
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);
    const orderedMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (unorderedMatch || orderedMatch) {
      flushParagraph();
      const nextListType = unorderedMatch ? "ul" : "ol";
      if (listType && listType !== nextListType) flushList();
      listType = nextListType;
      listItems.push((unorderedMatch ?? orderedMatch)?.[1] ?? "");
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  return html.join("");
}

async function readNewsList(locale: Locale): Promise<NewsItem[]> {
  const directory = path.join(process.cwd(), "src", "data", "news", "posts", locale);

  try {
    const files = (await fs.readdir(directory))
      .filter((file) => file.toLowerCase().endsWith(".md"))
      .sort();

    const items = await Promise.all(
      files.map(async (fileName) => {
        const filePath = path.join(directory, fileName);
        const content = await fs.readFile(filePath, "utf-8");
        const frontmatter = parseFrontmatter(content);
        const body = stripFrontmatter(content);
        return normalizeNewsItem(fileName, frontmatter, body);
      }),
    );

    const validItems = items.filter(Boolean) as NewsItem[];
    return validItems.sort((first, second) => {
      const secondTime = Date.parse(second.date);
      const firstTime = Date.parse(first.date);
      return (Number.isNaN(secondTime) ? 0 : secondTime) - (Number.isNaN(firstTime) ? 0 : firstTime);
    });
  } catch {
    return [];
  }
}

export async function getNewsList(locale: Locale = "zh-CN"): Promise<NewsItem[]> {
  const items = await readNewsList(locale);
  return locale === "zh-CN" || items.length > 0 ? items : readNewsList("zh-CN");
}

export async function getNewsCatalog(): Promise<Record<Locale, NewsItem[]>> {
  const source = await readNewsList("zh-CN");
  const entries = await Promise.all((["zh-CN", "zh-TW", "en", "ja"] as Locale[]).map(async (locale) => {
    if (locale === "zh-CN") return [locale, source] as const;

    const translated = await readNewsList(locale);
    const bySlug = new Map(translated.map((item) => [item.slug, item]));
    return [locale, source.map((item) => bySlug.get(item.slug) ?? item)] as const;
  }));
  return Object.fromEntries(entries) as Record<Locale, NewsItem[]>;
}

export async function getNewsBySlug(slug: string, locale: Locale = "zh-CN"): Promise<NewsItem | null> {
  const items = await getNewsList(locale);
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getLatestNews(locale: Locale = "zh-CN") {
  const items = await getNewsList(locale);
  return items.slice(0, 3);
}
