import { PlatformPage } from "@/components/shared/platform-page";
import { getTrends, getPosts } from "@/lib/api/fetchers";

export default async function TikTokPage() {
  const [trends, posts] = await Promise.all([getTrends(), getPosts()]);

  return (
    <PlatformPage
      platform="tiktok"
      emoji="🎵"
      label="TikTok"
      description="Tendências, áudios e formatos que estão performando no TikTok para provedores de internet."
      allTrends={trends}
      allPosts={posts}
    />
  );
}
