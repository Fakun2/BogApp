import { UserCheck, UsersRound, UserX, Workflow } from "lucide-react";
import type { StaffListResponse } from "../../_types/staff.types";
import { getStaffMetricCounts } from "../../_utils/staff-metrics";
import { StaffMetricCard } from "./staff-metric-card";

export function StaffMetrics({ staffData }: { staffData: StaffListResponse | undefined }) {
  const counts = getStaffMetricCounts(staffData);
  const metrics = [
    {
      detail: "Areas disponibles para el equipo",
      icon: Workflow,
      label: "Areas de trabajo",
      value: counts.practiceAreasCount
    },
    {
      detail: "Total del equipo",
      icon: UsersRound,
      label: "Personal",
      value: counts.totalWorkers
    },
    {
      detail: "Personal con acceso activo",
      icon: UserCheck,
      label: "Personal activo",
      value: counts.activeWorkers
    },
    {
      detail: "Invitado o suspendido",
      icon: UserX,
      label: "Personal inactivo",
      value: counts.inactiveWorkers
    }
  ];

  return (
    <section className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-4">
      {metrics.map((metric) => (
        <StaffMetricCard
          detail={metric.detail}
          icon={metric.icon}
          key={metric.label}
          label={metric.label}
          value={metric.value}
        />
      ))}
    </section>
  );
}
