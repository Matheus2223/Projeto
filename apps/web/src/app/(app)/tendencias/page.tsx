import { PageHeader } from "@/components/shared/page-header";
import { TrendExplorer } from "@/components/shared/trend-explorer";
import { getTrends } from "@/lib/api/fetchers";

export const metadata = { title: "Assuntos em Alta" };

export default async function TendenciasPage() {
  const trends = await getTrends();

  return (
    <div>
      <PageHeader
        title="🔥 Assuntos em Alta"
        description="Todos os assuntos que a IA está monitorando agora, com índice de crescimento, velocidade e confiança."
      />
      <TrendExplorer trends={trends} />
    </div>
  );
}
