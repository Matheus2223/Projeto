import { getCalendar } from "@/lib/api/fetchers";
import { CalendarioClient } from "./calendario-client";

export default async function CalendarioPage() {
  const entries = await getCalendar();
  return <CalendarioClient entries={entries} />;
}
