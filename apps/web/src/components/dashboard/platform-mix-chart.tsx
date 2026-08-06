"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TRENDS } from "@/lib/data/generators/trends";
import { PLATFORM_META } from "@/lib/data/constants";

const counts = new Map<string, number>();
TRENDS.forEach((t) => counts.set(t.platform, (counts.get(t.platform) ?? 0) + 1));
const data = [...counts.entries()]
  .map(([platform, value]) => ({ platform: PLATFORM_META[platform as keyof typeof PLATFORM_META].label, value }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 7);

const chartConfig = {
  value: { label: "Tendências detectadas", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function PlatformMixChart() {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.3} />
        <XAxis type="number" hide />
        <YAxis
          dataKey="platform"
          type="category"
          tickLine={false}
          axisLine={false}
          width={110}
          fontSize={11.5}
        />
        <ChartTooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 6, 6, 0]} barSize={16} />
      </BarChart>
    </ChartContainer>
  );
}
