import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CreateStaffStatusSection({
  active,
  onActiveChange
}: {
  active: boolean;
  onActiveChange: (active: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/40 bg-card px-4 py-3">
      <Checkbox
        id="create-worker-active"
        checked={active}
        onCheckedChange={(value) => onActiveChange(Boolean(value))}
        className="mt-0.5"
      />
      <div className="grid gap-1">
        <Label htmlFor="create-worker-active" className="font-semibold">
          Personal activo
        </Label>
        <p className="text-sm leading-5 text-muted-foreground">
          Si esta desactivado, no tendra acceso activo al estudio.
        </p>
      </div>
    </div>
  );
}
