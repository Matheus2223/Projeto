import { PlatformPage } from "@/components/shared/platform-page";
import { getTrends, getPosts } from "@/lib/api/fetchers";

export default async function FacebookPage() {
  const [trends, posts] = await Promise.all([getTrends(), getPosts()]);

  return (
    <PlatformPage
      platform="facebook"
      emoji="👍"
      label="Facebook"
      description="O que está funcionando nos grupos e páginas de Facebook para o público de provedores de internet."
      allTrends={trends}
      allPosts={posts}
    />
  );
}
