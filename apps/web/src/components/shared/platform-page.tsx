"use client";

import { Flame, Gauge, Hash } from "lucide-react";
import { PageHeader } from "./page-header";
import { StatCard } from "./stat-card";
import { TrendExplorer } from "./trend-explorer";
import { PostExplorer } from "./post-explorer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Platform } from "@/lib/data/constants";
import type { Trend, PostItem } from "@/lib/data/types";

export function PlatformPage({
  platform,
  emoji,
  label,
  description,
  allTrends,
  allPosts,
}: {
  platform: Platform;
  emoji: string;
  label: string;
  description: string;
  allTrends: Trend[];
  allPosts: PostItem[];
}) {
  const trends = allTrends.filter((t) => t.platform === platform);
  const posts = allPosts.filter((p) => p.platform === platform).sort((a, b) => b.metrics.views - a.metrics.views);
  const avgGrowth = trends.length ? Math.round(trends.reduce((s, t) => s + t.growthIndex, 0) / trends.length) : 0;
  const hashtagCounts = new Map<string, number>();
  trends.forEach((t) => t.hashtags.forEach((h) => hashtagCounts.set(h, (hashtagCounts.get(h) ?? 0) + 1)));
  const topHashtag = [...hashtagCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return (
    <div>
      <PageHeader title={`${emoji} ${label}`} description={description} />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard index={0} label="Tendências ativas" value={String(trends.length)} icon={Flame} iconClassName="bg-warning/15 text-warning" />
        <StatCard index={1} label="Crescimento médio" value={`${avgGrowth}/100`} icon={Gauge} iconClassName="bg-primary/15 text-primary" />
        <StatCard index={2} label="Hashtag em destaque" value={topHashtag} icon={Hash} iconClassName="bg-info/15 text-info" />
      </div>

      <Tabs defaultValue="trends">
        <TabsList className="mb-5">
          <TabsTrigger value="trends">Tendências ({trends.length})</TabsTrigger>
          <TabsTrigger value="posts">Conteúdos ({posts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="trends">
          <TrendExplorer trends={trends} visibleFilters={{ platform: false }} />
        </TabsContent>
        <TabsContent value="posts">
          <PostExplorer posts={posts} visibleFilters={{ platform: false }} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
