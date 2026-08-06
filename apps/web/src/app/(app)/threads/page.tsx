import { PlatformPage } from "@/components/shared/platform-page";
import { getTrends, getPosts } from "@/lib/api/fetchers";

export default async function ThreadsPage() {
  const [trends, posts] = await Promise.all([getTrends(), getPosts()]);

  return (
    <PlatformPage
      platform="threads"
      emoji="🧵"
      label="Threads"
      description="Discussões e formatos de texto que estão gerando conversa no Threads."
      allTrends={trends}
      allPosts={posts}
    />
  );
}
