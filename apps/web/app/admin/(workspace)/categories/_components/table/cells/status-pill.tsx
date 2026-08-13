import { Badge } from "@/components/ui/badge";

export function StatusPill({ active }: { active: boolean }) {
  return active ? (
    <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10">Activa</Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      Inactiva
    </Badge>
  );
}
