import { PlatformPage } from "@/components/shared/platform-page";
import { getTrends, getPosts } from "@/lib/api/fetchers";

export default async function YoutubeShortsPage() {
  const [trends, posts] = await Promise.all([getTrends(), getPosts()]);

  return (
    <PlatformPage
      platform="youtube_shorts"
      emoji="▶️"
      label="YouTube Shorts"
      description="Vídeos curtos com maior retenção e viralização no YouTube Shorts."
      allTrends={trends}
      allPosts={posts}
    />
  );
}
