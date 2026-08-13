import { Badge } from "@/components/ui/badge";

export function StatusPill({ active }: { active: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        active
          ? "rounded-md border-emerald-200 bg-emerald-500/10 text-emerald-700"
          : "rounded-md border-border/40 bg-muted text-muted-foreground"
      }
    >
      {active ? "Activo" : "Inactivo"}
    </Badge>
  );
}
