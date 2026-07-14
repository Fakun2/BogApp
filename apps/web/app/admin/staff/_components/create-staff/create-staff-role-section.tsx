import { Label } from "@/components/ui/label";
import { CreateStaffRoleCard } from "./create-staff-role-card";

export function CreateStaffRoleSection({
  error,
  locked = false,
  lockedMessage,
  options,
  value,
  onValueChange
}: {
  error?: string;
  locked?: boolean;
  lockedMessage?: string;
  options: Array<{ assignable?: boolean; code: string; description: string | null; label: string }>;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 md:col-span-2">
      <Label>
        Rol<span className="text-destructive"> *</span>
      </Label>
      <div className="grid gap-2">
        {options.length > 0 ? (
          options.map((option) => (
            <CreateStaffRoleCard
              checked={value === option.code}
              code={option.code}
              description={option.description}
              disabled={locked || option.assignable === false}
              key={option.code}
              label={option.label}
              onSelect={onValueChange}
            />
          ))
        ) : (
          <p className="rounded-2xl border border-border/50 px-3 py-4 text-sm text-muted-foreground">
            No hay roles disponibles para asignar.
          </p>
        )}
      </div>
      {locked && lockedMessage ? (
        <p className="text-xs font-medium text-muted-foreground">{lockedMessage}</p>
      ) : null}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
