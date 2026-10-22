import { HomePageContent } from "@/components/home/home-page-content";
import { getLatestNews } from "@/data/news";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("zh-Hans", "/");

export default async function Home() {
  return <HomePageContent locale="zh-Hans" news={await getLatestNews("zh-Hans")} />;
}
