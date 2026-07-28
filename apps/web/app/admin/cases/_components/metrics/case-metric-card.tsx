import { BriefcaseBusiness } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { adminSurfaceClassName, adminSurfacePrimaryClassName } from "../../../_constants/dashboard";

export function CaseMetricCard({ label, value }: { label: string; value: number }) {
  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} border-0 shadow-[var(--admin-card-shadow)]`}
    >
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex size-10 items-center justify-center rounded-md bg-btn-primary text-btn-primary-foreground">
          <BriefcaseBusiness className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={`text-lg font-semibold ${adminSurfacePrimaryClassName}`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
