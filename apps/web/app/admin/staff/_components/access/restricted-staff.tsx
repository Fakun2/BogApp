import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { adminSurfaceClassName } from "../../../_constants/dashboard";

export function RestrictedStaff() {
  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} mx-auto max-w-xl border-0 shadow-[var(--admin-card-shadow)]`}
    >
      <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Area restringida</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Necesitas el permiso staff:read para acceder a la gestion de staff.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
