import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CreateStaffAreaCard } from "./create-staff-area-card";

export function CreateStaffAreaSection({
  assignPracticeArea,
  options,
  practiceAreaIds,
  onAssignPracticeAreaChange,
  onPracticeAreaToggle
}: {
  assignPracticeArea: boolean;
  options: Array<{
    description: string | null;
    label: string;
    templateCode: string | null;
    value: string;
  }>;
  practiceAreaIds: string[];
  onAssignPracticeAreaChange: (checked: boolean) => void;
  onPracticeAreaToggle: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border/50 p-4">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={assignPracticeArea}
          id="create-worker-assign-practice-area"
          onCheckedChange={(checked) => onAssignPracticeAreaChange(checked === true)}
        />
        <div className="grid gap-1">
          <Label htmlFor="create-worker-assign-practice-area">Asignar area de trabajo</Label>
          <p className="text-sm text-muted-foreground">
            Puede quedar sin area asignada y completarse mas adelante.
          </p>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          assignPracticeArea ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="grid gap-2 pt-1 sm:grid-cols-2">
            {options.length > 0 ? (
              options.map((option) => (
                <CreateStaffAreaCard
                  checked={practiceAreaIds.includes(option.value)}
                  description={option.description}
                  key={option.value}
                  label={option.label}
                  templateCode={option.templateCode}
                  value={option.value}
                  onToggle={onPracticeAreaToggle}
                />
              ))
            ) : (
              <p className="rounded-2xl border border-border/50 px-3 py-4 text-sm text-muted-foreground sm:col-span-2">
                No hay areas disponibles para asignar.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
