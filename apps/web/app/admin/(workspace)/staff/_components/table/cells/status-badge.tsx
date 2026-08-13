import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StaffStatus } from "../../../_types/staff.types";

export function StatusBadge({ status }: { status: StaffStatus }) {
  const styles: Record<StaffStatus, string> = {
    active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
    invited: "border-sky-500/30 bg-sky-500/10 text-sky-700",
    suspended: "border-muted-foreground/20 bg-secondary text-muted-foreground"
  };

  const labels: Record<StaffStatus, string> = {
    active: "Activo",
    invited: "Invitado",
    suspended: "Suspendido"
  };

  return (
    <Badge variant="outline" className={cn("rounded-full px-2.5 py-1", styles[status])}>
      {labels[status]}
    </Badge>
  );
}
