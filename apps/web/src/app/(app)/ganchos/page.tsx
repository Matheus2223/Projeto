import { PageHeader } from "@/components/shared/page-header";
import { BankExplorer } from "@/components/shared/bank-explorer";
import { getBankItems } from "@/lib/api/fetchers";

export default async function GanchosPage() {
  const hooks = await getBankItems("hooks");

  return (
    <div>
      <PageHeader
        title="💬 Biblioteca de Ganchos"
        description={`${hooks.length} ganchos testados para prender atenção nos primeiros segundos, prontos para usar em qualquer formato.`}
      />
      <BankExplorer items={hooks} />
    </div>
  );
}
