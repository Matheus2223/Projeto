import { PageHeader } from "@/components/shared/page-header";
import { PostExplorer } from "@/components/shared/post-explorer";
import { getPosts } from "@/lib/api/fetchers";

export default async function BancoDePostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <PageHeader
        title="🗂️ Banco de Posts"
        description="Todo o histórico de posts, rascunhos e publicações organizados em um só lugar."
      />
      <PostExplorer posts={posts} showPostStatus />
    </div>
  );
}
