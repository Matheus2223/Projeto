import { PlatformPage } from "@/components/shared/platform-page";
import { getTrends, getPosts } from "@/lib/api/fetchers";

export default async function InstagramPage() {
  const [trends, posts] = await Promise.all([getTrends(), getPosts()]);

  return (
    <PlatformPage
      platform="instagram"
      emoji="📸"
      label="Instagram"
      description="Reels, Stories e Carrosséis em alta no Instagram, com formatos e ganchos que estão engajando."
      allTrends={trends}
      allPosts={posts}
    />
  );
}
