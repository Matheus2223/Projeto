import { getDailyReport } from "@/lib/api/fetchers";
import { RelatorioClient } from "./relatorio-client";

export default async function RelatorioPage() {
  const report = await getDailyReport();
  return <RelatorioClient report={report} />;
}
