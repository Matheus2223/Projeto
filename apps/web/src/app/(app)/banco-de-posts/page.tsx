import { PageHeader } from "@/components/shared/page-header";
import { PostExplorer } from "@/components/shared/post-explorer";
import { POSTS } from "@/lib/data/generators/posts";

export default function BancoDePostsPage() {
  return (
    <div>
      <PageHeader
        title="🗂️ Banco de Posts"
        description="Todo o histórico de posts, rascunhos e publicações organizados em um só lugar."
      />
      <PostExplorer posts={POSTS} showPostStatus />
    </div>
  );
}
