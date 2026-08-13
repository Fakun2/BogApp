import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { adminSurfaceClassName, adminSurfacePrimaryClassName } from "../_constants/dashboard";

export function AdminMetricCard({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
}) {
  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} min-w-0 border-0 py-0 shadow-[var(--admin-card-shadow)]`}
    >
      <CardContent className="flex min-h-[94px] items-center gap-2 p-2 sm:min-h-[118px] sm:gap-4 sm:p-4">
        <span
          data-admin-metric-icon
          className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-btn-primary/10 text-btn-primary shadow-[0_10px_28px_-18px_currentColor] sm:size-8 sm:rounded-2xl"
        >
          <Icon className="h-4 w-4 sm:h-[16px] sm:w-[16px]" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium leading-4 text-foreground/65 sm:text-sm">
            {label}
          </p>
          <p
            className={`mt-1 truncate text-xl font-semibold leading-none sm:text-2xl ${adminSurfacePrimaryClassName}`}
          >
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
