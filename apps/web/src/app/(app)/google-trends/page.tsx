import { getTrends } from "@/lib/api/fetchers";
import { GoogleTrendsClient } from "./google-trends-client";

export default async function GoogleTrendsPage() {
  const allTrends = await getTrends();
  const trends = allTrends.filter((t) => t.platform === "google_trends");
  return <GoogleTrendsClient trends={trends} />;
}
