import { Badge } from "@/components/ui/badge";
import type { StaffWorker } from "../../_types/staff.types";

export function PracticeAreaList({ worker }: { worker: StaffWorker }) {
  if (worker.practiceAreas.length === 0) {
    return <span className="text-sm text-muted-foreground">Sin asignar</span>;
  }

  const [firstArea, ...remainingAreas] = worker.practiceAreas;

  return (
    <div className="flex flex-wrap gap-1.5">
      {firstArea ? (
        <Badge variant="outline" className="rounded-full bg-secondary px-2 py-0.5 text-xs">
          {firstArea.name}
        </Badge>
      ) : null}
      {remainingAreas.length > 0 ? (
        <Badge variant="outline" className="rounded-full px-2 py-0.5 text-xs text-muted-foreground">
          +{remainingAreas.length}
        </Badge>
      ) : null}
    </div>
  );
}
