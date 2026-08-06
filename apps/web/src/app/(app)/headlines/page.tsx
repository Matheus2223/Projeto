import { PageHeader } from "@/components/shared/page-header";
import { BankExplorer } from "@/components/shared/bank-explorer";
import { getBankItems } from "@/lib/api/fetchers";

export default async function HeadlinesPage() {
  const headlines = await getBankItems("headlines");

  return (
    <div>
      <PageHeader
        title="📝 Banco de Headlines"
        description={`${headlines.length} títulos de alta conversão para anúncios, posts e páginas de captura.`}
      />
      <BankExplorer items={headlines} />
    </div>
  );
}
