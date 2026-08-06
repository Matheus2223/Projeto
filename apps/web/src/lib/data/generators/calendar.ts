import { Rng } from "../rng";
import { PLATFORMS, CONTENT_FORMATS, OBJECTIVES } from "../constants";
import { TOPICS, HOOK_TEMPLATES, CTA_TEMPLATES } from "../vocab";
import type { CalendarEntry } from "../types";

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const TIMES = ["08:00", "12:30", "15:00", "18:00", "19:30", "21:00"];

export function generateCalendar(days = 30, seed: string | number = "calendar-v1"): CalendarEntry[] {
  const rng = new Rng(seed);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const entries: CalendarEntry[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(start.getTime() + i * 86400000);
    const topic = rng.pick(TOPICS);
    const hook = rng.pick(HOOK_TEMPLATES).replace("{topic}", topic);
    const cta = rng.pick(CTA_TEMPLATES).replace("{topic}", topic);
    const status: CalendarEntry["status"] = i < 2 ? "publicado" : i < 5 ? "produzido" : "planejado";

    entries.push({
      id: `cal-${i}`,
      date: date.toISOString(),
      weekday: WEEKDAYS[date.getDay()],
      theme: `${topic[0].toUpperCase()}${topic.slice(1)}`,
      objective: rng.pick(OBJECTIVES),
      format: rng.pick(CONTENT_FORMATS),
      platform: rng.pick(PLATFORMS),
      script: hook,
      caption: `${hook} ${cta}`,
      cta,
      suggestedTime: rng.pick(TIMES),
      status,
    });
  }

  return entries;
}

export const CALENDAR_ENTRIES = generateCalendar(30);
