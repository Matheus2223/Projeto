import { getCompetitors } from "@/lib/api/fetchers";
import { ConcorrenciaClient } from "./concorrencia-client";

export default async function ConcorrenciaPage() {
  const competitors = await getCompetitors();
  return <ConcorrenciaClient initialCompetitors={competitors} />;
}
