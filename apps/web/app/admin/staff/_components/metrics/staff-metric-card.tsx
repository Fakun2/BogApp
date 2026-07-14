import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  adminSurfaceClassName,
  adminSurfaceMutedClassName,
  adminSurfacePrimaryClassName
} from "../../../_constants/dashboard";

export function StaffMetricCard({
  detail,
  icon: Icon,
  label,
  value
}: {
  detail: string;
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} gap-3 border-0 py-3 shadow-[var(--admin-card-shadow)] sm:gap-4 sm:py-4`}
    >
      <CardHeader className="flex-row items-start justify-between gap-2 px-3 sm:items-center sm:gap-3 sm:px-4">
        <CardTitle className={`text-xs font-medium leading-4 sm:text-sm ${adminSurfaceMutedClassName}`}>
          {label}
        </CardTitle>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary/70 text-secondary-foreground sm:size-9">
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent className="px-3 sm:px-4">
        <div className={`font-mono text-xl font-semibold sm:text-2xl ${adminSurfacePrimaryClassName}`}>
          {value}
        </div>
        <p className={`mt-1 hidden text-xs sm:block ${adminSurfaceMutedClassName}`}>{detail}</p>
      </CardContent>
    </Card>
  );
}
