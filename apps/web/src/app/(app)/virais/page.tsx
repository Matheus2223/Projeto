"use client";

import { PageHeader } from "@/components/shared/page-header";
import { TrendExplorer } from "@/components/shared/trend-explorer";
import { PostExplorer } from "@/components/shared/post-explorer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TRENDS } from "@/lib/data/generators/trends";
import { POSTS } from "@/lib/data/generators/posts";

export default function ViraisPage() {
  const viralTrends = TRENDS.filter((t) => t.status === "viral" || t.status === "explodindo");
  const viralPosts = [...POSTS].sort((a, b) => b.metrics.views - a.metrics.views);

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
