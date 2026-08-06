import { PageHeader } from "@/components/shared/page-header";
import { BankExplorer } from "@/components/shared/bank-explorer";
import { getBankItems } from "@/lib/api/fetchers";

export default async function CtasPage() {
  const ctas = await getBankItems("ctas");

  return (
    <div>
      <PageHeader
        title="📣 Banco de CTA"
        description={`${ctas.length} chamadas para ação prontas para fechar mais conversões em qualquer post ou anúncio.`}
      />
      <BankExplorer items={ctas} />
    </div>
  );
}
