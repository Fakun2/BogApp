import { Badge } from "@/components/ui/badge";
import type { StaffWorker } from "../../../_types/staff.types";

export function PracticeAreaList({ worker }: { worker: StaffWorker }) {
  if (worker.practiceAreas.length === 0) {
    return <span className="text-sm text-muted-foreground">Sin asignar</span>;
  }

  const [firstArea, ...remainingAreas] = worker.practiceAreas;

  return (
    <div className="flex max-w-[180px] flex-nowrap gap-1.5 overflow-hidden">
      {firstArea ? (
        <Badge variant="outline" className="min-w-0 rounded-full bg-secondary px-2 py-0.5 text-xs">
          <span className="truncate">{firstArea.name}</span>
        </Badge>
      ) : null}
      {remainingAreas.length > 0 ? (
        <Badge
          variant="outline"
          className="shrink-0 rounded-full px-2 py-0.5 text-xs text-muted-foreground"
        >
          +{remainingAreas.length}
        </Badge>
      ) : null}
    </div>
  );
}
