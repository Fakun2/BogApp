import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  getPracticeAreaDescription,
  getPracticeAreaIcon
} from "../../_utils/practice-area-presentation";

export function CreateStaffAreaCard({
  checked,
  description,
  label,
  templateCode,
  value,
  onToggle
}: {
  checked: boolean;
  description: string | null;
  label: string;
  templateCode: string | null;
  value: string;
  onToggle: (value: string) => void;
}) {
  const Icon = getPracticeAreaIcon(templateCode);
  const displayDescription = getPracticeAreaDescription({ description, name: label });

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle(value);
    }
  }

  return (
    <div
      aria-checked={checked}
      role="checkbox"
      tabIndex={0}
      className={cn(
        "flex min-h-24 items-start gap-3 rounded-2xl border border-border/50 bg-card p-3 text-left transition-colors duration-200 ease-out hover:border-[var(--selectable-card-hover-border)] hover:bg-[var(--selectable-card-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        checked &&
          "border-[var(--selectable-card-selected-border)] bg-[var(--selectable-card-selected-bg)] text-[var(--selectable-card-selected-foreground)]"
      )}
      onClick={() => onToggle(value)}
      onKeyDown={handleKeyDown}
    >
      <Checkbox
        checked={checked}
        className={cn(
          "mt-0.5 transition-colors duration-200",
          checked && "border-sky-500 bg-sky-500 text-white"
        )}
        tabIndex={-1}
        aria-hidden="true"
      />
      <span className="grid min-w-0 gap-2">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-xl bg-secondary/70 text-secondary-foreground transition-colors duration-200",
            checked && "bg-[var(--selectable-card-icon-bg)] text-[var(--selectable-card-icon-foreground)]"
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="grid gap-1">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-xs leading-5 text-muted-foreground">{displayDescription}</span>
        </span>
      </span>
    </div>
  );
}
