export type HexoPost = {
  id: string;
  title: string;
  date: string;
  cover: string;
  href: string;
};

const FALLBACK_HEXO_POSTS: HexoPost[] = [
  {
    id: "news-1",
    title: "腾讯公布第二季度二零二五年度业绩",
    date: "2026年08月12日",
    cover:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    href: "/news/1",
  },
  {
    id: "news-2",
    title: "腾讯发布中期报告",
    date: "2026年08月17日",
    cover:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    href: "/news/2",
  },
  {
    id: "news-3",
    title: "腾讯启动2027全球校园招聘",
    date: "2026年08月18日",
    cover:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    href: "/news/3",
  },
];

function normalizePost(raw: unknown): HexoPost | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;
  const title = typeof item.title === "string" ? item.title.trim() : "";
  const date = typeof item.date === "string" ? item.date : typeof item.published === "string" ? item.published : "";
  const href = typeof item.href === "string" ? item.href : typeof item.link === "string" ? item.link : "/news";
  const cover =
    typeof item.cover === "string"
      ? item.cover
      : typeof item.image === "string"
        ? item.image
        : "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80";

  if (!title) return null;

  return {
    id: typeof item.id === "string" ? item.id : `${title}-${date}`,
    title,
    date,
    cover,
    href,
  };
}

export async function getLatestHexoPosts(): Promise<HexoPost[]> {
  const postsSource = process.env.NEXT_PUBLIC_HEXO_POSTS_URL;

  if (!postsSource) {
    return FALLBACK_HEXO_POSTS.slice(0, 3);
  }

  try {
    const response = await fetch(postsSource, { next: { revalidate: 3600 } });
    if (!response.ok) {
      throw new Error(`Hexo posts request failed: ${response.status}`);
    }

    const payload = await response.json();
    const rawPosts = Array.isArray(payload) ? payload : Array.isArray((payload as { posts?: unknown[] })?.posts) ? (payload as { posts: unknown[] }).posts : [];
    const normalized = rawPosts.map(normalizePost).filter(Boolean) as HexoPost[];

    return normalized.length > 0 ? normalized.slice(0, 3) : FALLBACK_HEXO_POSTS.slice(0, 3);
  } catch {
    return FALLBACK_HEXO_POSTS.slice(0, 3);
  }
}
