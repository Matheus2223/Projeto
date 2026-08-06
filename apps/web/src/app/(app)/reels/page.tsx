"use client";

import { PageHeader } from "@/components/shared/page-header";
import { PostExplorer } from "@/components/shared/post-explorer";
import { POSTS } from "@/lib/data/generators/posts";

export default function ReelsPage() {
  const reels = POSTS.filter((p) => p.format === "Reels").sort((a, b) => b.metrics.views - a.metrics.views);

  return (
    <div>
      <PageHeader
        title="🎬 Reels Virais"
        description="Os Reels de melhor performance identificados pela IA, prontos para inspirar sua próxima gravação."
      />
      <PostExplorer posts={reels} />
    </div>
  );
}
