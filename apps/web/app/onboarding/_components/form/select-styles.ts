import { cn } from "@/lib/utils";

const selectBaseTriggerClassName =
  "h-12 w-full rounded-2xl px-4 text-base md:text-sm data-[placeholder]:text-[#71717a]";

const selectBaseContentClassName =
  "z-[120] max-h-72 w-[var(--radix-select-trigger-width)] rounded-2xl border shadow-xl";

const selectBaseItemClassName = "rounded-xl";

export function getSelectTriggerClassName(darkMode: boolean) {
  void darkMode;

  return cn(
    selectBaseTriggerClassName,
    "border-field-border bg-field text-field-foreground data-[placeholder]:text-muted-foreground"
  );
}

export function getSelectContentClassName(darkMode: boolean) {
  void darkMode;

  return cn(
    selectBaseContentClassName,
    "border-border bg-card text-card-foreground"
  );
}

export function getSelectItemClassName(darkMode: boolean) {
  void darkMode;

  return cn(
    selectBaseItemClassName,
    "bg-card text-card-foreground focus:bg-secondary focus:text-secondary-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-secondary-foreground"
  );
}
