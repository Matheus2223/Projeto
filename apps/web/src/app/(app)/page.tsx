import { getTrends, getIdeas, getDailyReport, getPosts, getBankItems, getNews } from "@/lib/api/fetchers";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const [trends, ideas, dailyReport, posts, questions, news] = await Promise.all([
    getTrends(),
    getIdeas(),
    getDailyReport(),
    getPosts(),
    getBankItems("questions"),
    getNews(),
  ]);

  const topQuestions = [...questions].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 8);

  return (
    <DashboardClient
      trends={trends}
      ideas={ideas}
      dailyReport={dailyReport}
      posts={posts}
      topQuestions={topQuestions}
      news={news}
    />
  );
}
