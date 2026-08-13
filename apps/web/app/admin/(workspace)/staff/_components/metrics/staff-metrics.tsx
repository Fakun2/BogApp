import { UserCheck, UsersRound, UserX, Workflow } from "lucide-react";
import { AdminMetricsGrid } from "../../../_components/admin-metrics-grid";
import type { StaffListResponse } from "../../_types/staff.types";
import { getStaffMetricCounts } from "../../_utils/staff-metrics";

export function StaffMetrics({ staffData }: { staffData: StaffListResponse | undefined }) {
  const counts = getStaffMetricCounts(staffData);
  const metrics = [
    {
      icon: Workflow,
      label: "Areas de trabajo",
      value: counts.practiceAreasCount
    },
    {
      icon: UsersRound,
      label: "Personal",
      value: counts.totalWorkers
    },
    {
      icon: UserCheck,
      label: "Personal activo",
      value: counts.activeWorkers
    },
    {
      icon: UserX,
      label: "Personal inactivo",
      value: counts.inactiveWorkers
    }
  ];

  return <AdminMetricsGrid metrics={metrics} />;
}
