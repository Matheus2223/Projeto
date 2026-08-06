import { PageHeader } from "@/components/shared/page-header";
import { TrendExplorer } from "@/components/shared/trend-explorer";
import { TRENDS } from "@/lib/data/generators/trends";

export const metadata = { title: "Assuntos em Alta" };

export default function TendenciasPage() {
  return (
    <div>
      <PageHeader
        title="🔥 Assuntos em Alta"
        description="Todos os assuntos que a IA está monitorando agora, com índice de crescimento, velocidade e confiança."
      />
      <TrendExplorer trends={TRENDS} />
    </div>
  );
}
