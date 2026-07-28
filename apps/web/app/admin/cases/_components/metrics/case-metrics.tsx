import { casesPageSize } from "../../_constants/cases.constants";
import type { CasesListResponse } from "../../_types/cases.types";
import { CaseMetricCard } from "./case-metric-card";

export function CaseMetrics({ casesData }: { casesData?: CasesListResponse }) {
  const pageInfo = casesData?.pageInfo;

  return (
    <div className="grid shrink-0 grid-cols-2 gap-3 md:grid-cols-3">
      <CaseMetricCard label="Resultados" value={casesData?.items.length ?? 0} />
      <CaseMetricCard label="Items por pagina" value={pageInfo?.limit ?? casesPageSize} />
      <CaseMetricCard
        label="Pagina"
        value={Math.floor((pageInfo?.offset ?? 0) / casesPageSize) + 1}
      />
    </div>
  );
}
