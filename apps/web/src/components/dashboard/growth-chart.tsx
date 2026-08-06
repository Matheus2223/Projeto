"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { DASHBOARD_TIMESERIES } from "@/lib/data/generators/timeseries";
import { formatDate } from "@/lib/format";

const chartConfig = {
  tendencias: { label: "Índice de tendências", color: "var(--chart-1)" },
  engajamento: { label: "Engajamento médio", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function GrowthChart() {
  const data = DASHBOARD_TIMESERIES.map((d) => ({ ...d, day: formatDate(d.date) }));

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillTendencias" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillEngajamento" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} fontSize={11} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <Area dataKey="tendencias" type="monotone" fill="url(#fillTendencias)" stroke="var(--chart-1)" strokeWidth={2} />
        <Area dataKey="engajamento" type="monotone" fill="url(#fillEngajamento)" stroke="var(--chart-2)" strokeWidth={2} />
      </AreaChart>
    </ChartContainer>
  );
}
