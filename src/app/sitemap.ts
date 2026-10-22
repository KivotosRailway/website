import type { MetadataRoute } from "next";
import { getNewsList } from "@/data/news";
import { getPolicySlugs } from "@/data/policy";
import { locales } from "@/lib/i18n";
import { languageAlternates, localizedUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = ["/", "/news", "/about", "/railway", "/city", "/join-us", "/members", "/links",
    ...getPolicySlugs().map(({ slug }) => `/policy/${slug}`),
    ...(await getNewsList()).map(({ href }) => href),
  ];
  return paths.flatMap((href) => locales.map((locale) => ({
    url: localizedUrl(href, locale),
    alternates: { languages: languageAlternates(href) },
  })));
}
