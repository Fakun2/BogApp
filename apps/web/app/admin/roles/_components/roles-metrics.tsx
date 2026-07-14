import { CircleCheck, CircleSlash, ShieldCheck } from "lucide-react";
import type { RoleDto } from "@bogaap/api-client";
import { RoleMetricCard } from "./role-metric-card";

export function RolesMetrics({ roles }: { roles: RoleDto[] }) {
  const activeRoles = roles.filter((role) => role.active).length;

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      <RoleMetricCard icon={ShieldCheck} label="Cantidad de roles" value={roles.length} />
      <RoleMetricCard icon={CircleCheck} label="Roles activos" value={activeRoles} />
      <RoleMetricCard
        icon={CircleSlash}
        label="Roles inactivos"
        value={roles.length - activeRoles}
      />
    </section>
  );
}
