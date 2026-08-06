"use client";

import { Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { TopListCard } from "@/components/shared/top-list";
import { TrendExplorer } from "@/components/shared/trend-explorer";
import { DASHBOARD_EXTRAS } from "@/lib/data/generators/dashboard-extras";
import type { Trend } from "@/lib/data/types";

export function GoogleTrendsClient({ trends }: { trends: Trend[] }) {
  return (
    <div>
      <PageHeader
        title="📊 Google Trends"
        description="Picos de busca relacionados a internet, provedores e conectividade em todo o Brasil."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TopListCard title="Top pesquisas no Google" icon={Search} items={DASHBOARD_EXTRAS.topSearches} />
      </div>

      <TrendExplorer trends={trends} visibleFilters={{ platform: false }} />
    </div>
  );
}
