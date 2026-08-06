import { Rng } from "../rng";

export interface DailyMetric {
  date: string;
  tendencias: number;
  engajamento: number;
  ideias: number;
}

export function generateTimeseries(days = 14, seed: string | number = "timeseries-v1"): DailyMetric[] {
  const rng = new Rng(seed);
  const out: DailyMetric[] = [];
  let base = rng.int(40, 60);

  for (let i = days - 1; i >= 0; i--) {
    base = Math.max(20, Math.min(95, base + rng.int(-8, 10)));
    const date = new Date(Date.now() - i * 86400000);
    out.push({
      date: date.toISOString(),
      tendencias: base,
      engajamento: Math.max(10, Math.min(100, base + rng.int(-15, 15))),
      ideias: rng.int(120, 190),
    });
  }

  return out;
}

export const DASHBOARD_TIMESERIES = generateTimeseries(14);
