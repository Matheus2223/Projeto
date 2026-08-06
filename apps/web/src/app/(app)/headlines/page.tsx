import { PageHeader } from "@/components/shared/page-header";
import { BankExplorer } from "@/components/shared/bank-explorer";
import { BANKS } from "@/lib/data/generators/banks";

export default function HeadlinesPage() {
  return (
    <div>
      <PageHeader
        title="📝 Banco de Headlines"
        description={`${BANKS.headlines.length} títulos de alta conversão para anúncios, posts e páginas de captura.`}
      />
      <BankExplorer items={BANKS.headlines} />
    </div>
  );
}
