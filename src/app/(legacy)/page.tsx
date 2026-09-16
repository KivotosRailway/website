import { HomePageContent } from "@/components/home/home-page-content";
import { getNewsCatalog } from "@/data/news";

export default async function Home() {
  const newsByLocale = await getNewsCatalog();

  return <HomePageContent newsByLocale={newsByLocale} />;
}
