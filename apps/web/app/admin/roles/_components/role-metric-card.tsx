import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  adminSurfaceClassName,
  adminSurfaceMutedClassName,
  adminSurfacePrimaryClassName
} from "../../_constants/dashboard";

export function RoleMetricCard({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} border-0 shadow-[var(--admin-card-shadow)]`}
    >
      <CardContent className="flex min-h-[104px] flex-col items-start justify-between gap-3 p-4 sm:min-h-0 sm:flex-row sm:items-center sm:justify-start sm:gap-4 sm:p-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground sm:size-11 sm:rounded-2xl">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className={`text-xs font-medium leading-4 sm:text-sm ${adminSurfaceMutedClassName}`}>
            {label}
          </p>
          <p className={`mt-1 text-xl font-semibold sm:text-2xl ${adminSurfacePrimaryClassName}`}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
