import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRoleDescription, getRoleIcon } from "../../_utils/role-presentation";

export function CreateStaffRoleCard({
  checked,
  code,
  description,
  disabled = false,
  label,
  onSelect
}: {
  checked: boolean;
  code: string;
  description: string | null;
  disabled?: boolean;
  label: string;
  onSelect: (value: string) => void;
}) {
  const Icon = getRoleIcon(code);
  const displayDescription = getRoleDescription({ code, description });

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(code);
    }
  }

  return (
    <div
      aria-checked={checked}
      aria-disabled={disabled}
      role="radio"
      tabIndex={disabled ? -1 : 0}
      className={cn(
        "flex min-h-24 items-start gap-3 rounded-2xl border border-border/50 bg-card p-3 text-left transition-colors duration-200 ease-out hover:border-[var(--selectable-card-hover-border)] hover:bg-[var(--selectable-card-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        disabled &&
          "cursor-not-allowed border-border/30 bg-muted/30 opacity-55 hover:border-border/30 hover:bg-muted/30",
        checked &&
          !disabled &&
          "border-[var(--selectable-card-selected-border)] bg-[var(--selectable-card-selected-bg)] text-[var(--selectable-card-selected-foreground)]"
      )}
      onClick={() => {
        if (!disabled) {
          onSelect(code);
        }
      }}
      onKeyDown={handleKeyDown}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary/70 text-secondary-foreground transition-colors duration-200",
          checked &&
            !disabled &&
            "bg-[var(--selectable-card-icon-bg)] text-[var(--selectable-card-icon-foreground)]"
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="grid min-w-0 gap-1">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          {label}
          {checked && !disabled ? (
            <CheckCircle2
              className="h-3.5 w-3.5 text-[var(--selectable-card-icon-foreground)]"
              aria-hidden="true"
            />
          ) : null}
        </span>
        <span className="text-xs leading-5 text-muted-foreground">{displayDescription}</span>
        {disabled ? (
          <span className="text-xs font-medium text-muted-foreground">
            No disponible para tu jerarquia.
          </span>
        ) : null}
      </span>
    </div>
  );
}
