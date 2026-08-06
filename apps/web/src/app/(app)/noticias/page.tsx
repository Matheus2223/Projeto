import { getNews } from "@/lib/api/fetchers";
import { NoticiasClient } from "./noticias-client";

export default async function NoticiasPage() {
  const news = await getNews();
  return <NoticiasClient news={news} />;
}
