import { HomePageContent } from "@/components/home/home-page-content";
import { getLatestNews } from "@/data/news";

export default async function Home() {
  const news = await getLatestNews();

  return <HomePageContent news={news} />;
}
