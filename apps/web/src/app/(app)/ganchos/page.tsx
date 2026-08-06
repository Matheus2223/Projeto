import { PageHeader } from "@/components/shared/page-header";
import { BankExplorer } from "@/components/shared/bank-explorer";
import { BANKS } from "@/lib/data/generators/banks";

export default function GanchosPage() {
  return (
    <div>
      <PageHeader
        title="💬 Biblioteca de Ganchos"
        description={`${BANKS.hooks.length} ganchos testados para prender atenção nos primeiros segundos, prontos para usar em qualquer formato.`}
      />
      <BankExplorer items={BANKS.hooks} />
    </div>
  );
}
