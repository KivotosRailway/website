import fs from "fs/promises";
import path from "path";
import { localeContentDirectory, type Locale } from "@/lib/i18n";
import { imageMap } from "@/lib/image-map.generated";

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
  contentLocale: Locale;
};

export type NewsSummary = Pick<NewsItem, "id" | "slug" | "title" | "date" | "cover" | "href" | "category">;

function summarize(item: NewsItem): NewsSummary {
  const { id, slug, title, date, cover, href, category } = item;
  return { id, slug, title, date, cover, href, category };
}

type NewsFrontmatter = {
  title?: string;
  translationLabel?: string;
  date?: string;
  cover?: string;
  category?: string | string[];
  tags?: string[];
  slug?: string;
};

export function parseFrontmatter(markdown: string): NewsFrontmatter {
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

const DEFAULT_NEWS_COVER = "https://assets.kivotos.cc/image/2025/05/01/681397ba4e763.png";

function normalizeNewsItem(fileName: string, raw: NewsFrontmatter, body: string, locale: Locale): NewsItem | null {
  const title = raw.title?.trim();
  const date = raw.date?.trim() || "未注明日期";
  const category = (Array.isArray(raw.category) ? raw.category[0] : raw.category)?.trim() || "未分类";
  const tags = raw.tags ?? [];
  const coverSource = raw.cover?.trim() || DEFAULT_NEWS_COVER;
  const cover = imageMap[coverSource] ?? coverSource;
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
    contentLocale: locale,
  };
}

async function readNewsList(root: string, locale: Locale): Promise<NewsItem[]> {
  const directory = path.join(root, localeContentDirectory[locale]);

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
        return normalizeNewsItem(fileName, frontmatter, body, locale);
      }),
    );

    const validItems = items.filter(Boolean) as NewsItem[];
    return validItems.sort((first, second) => {
      const secondTime = Date.parse(second.date);
      const firstTime = Date.parse(first.date);
      return (Number.isNaN(secondTime) ? 0 : secondTime) - (Number.isNaN(firstTime) ? 0 : firstTime);
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

// The source catalog defines public slugs; a missing translation falls back per article.
export function createNewsReader(root: string) {
  async function readLocalizedNews(locale: Locale) {
    const [source, translated] = await Promise.all([
      readNewsList(root, "zh-Hans"),
      locale === "zh-Hans" ? Promise.resolve([]) : readNewsList(root, locale),
    ]);
    const bySlug = new Map(translated.map((item) => [item.slug, item]));
    return source.map((item) => bySlug.get(item.slug) ?? item);
  }

  return {
    async getNewsList(locale: Locale = "zh-Hans"): Promise<NewsSummary[]> {
      return (await readLocalizedNews(locale)).map(summarize);
    },
    async getNewsBySlug(slug: string, locale: Locale = "zh-Hans"): Promise<NewsItem | null> {
      return (await readLocalizedNews(locale)).find((item) => item.slug === slug) ?? null;
    },
    async getLatestNews(locale: Locale = "zh-Hans"): Promise<NewsSummary[]> {
      return (await readLocalizedNews(locale)).slice(0, 3).map(summarize);
    },
  };
}

export const { getNewsList, getNewsBySlug, getLatestNews } = createNewsReader(
  path.join(process.cwd(), "src", "data", "news", "posts"),
);
