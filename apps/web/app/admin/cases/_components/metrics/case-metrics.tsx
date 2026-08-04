import { BriefcaseBusiness } from "lucide-react";
import { AdminMetricsGrid } from "../../../_components/admin-metrics-grid";
import type { CasesMetricsDto } from "../../_types/cases.types";

export function CaseMetrics({ metrics }: { metrics?: CasesMetricsDto }) {
  return (
    <AdminMetricsGrid
      metrics={[
        { icon: BriefcaseBusiness, label: "Total expedientes", value: metrics?.totalCases ?? 0 },
        {
          icon: BriefcaseBusiness,
          label: "Expedientes abiertos",
          value: metrics?.openCases ?? 0
        },
        {
          icon: BriefcaseBusiness,
          label: "Expedientes cerrados",
          value: metrics?.closedCases ?? 0
        },
        { icon: BriefcaseBusiness, label: "Tareas pendientes", value: metrics?.pendingTasks ?? 0 }
      ]}
    />
  );
}
