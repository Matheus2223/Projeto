import { PageHeader } from "@/components/shared/page-header";
import { BankExplorer } from "@/components/shared/bank-explorer";
import { BANKS } from "@/lib/data/generators/banks";

export default function CtasPage() {
  return (
    <div>
      <PageHeader
        title="📣 Banco de CTA"
        description={`${BANKS.ctas.length} chamadas para ação prontas para fechar mais conversões em qualquer post ou anúncio.`}
      />
      <BankExplorer items={BANKS.ctas} />
    </div>
  );
}
