import { PageHeader } from "@/components/shared/page-header";
import { TrendExplorer } from "@/components/shared/trend-explorer";
import { PostExplorer } from "@/components/shared/post-explorer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getTrends, getPosts } from "@/lib/api/fetchers";

export default async function ViraisPage() {
  const [trends, posts] = await Promise.all([getTrends(), getPosts()]);
  const viralTrends = trends.filter((t) => t.status === "viral" || t.status === "explodindo");
  const viralPosts = [...posts].sort((a, b) => b.metrics.views - a.metrics.views);

  return (
    <div>
      <PageHeader
        title="✨ Conteúdos Virais"
        description="O que está bombando agora nas redes, cruzando tendências detectadas pela IA com os posts de maior alcance."
      />
      <Tabs defaultValue="trends">
        <TabsList className="mb-5">
          <TabsTrigger value="trends">Tendências virais ({viralTrends.length})</TabsTrigger>
          <TabsTrigger value="posts">Posts virais ({viralPosts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="trends">
          <TrendExplorer trends={viralTrends} initialFilters={{ status: "todos" }} />
        </TabsContent>
        <TabsContent value="posts">
          <PostExplorer posts={viralPosts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
