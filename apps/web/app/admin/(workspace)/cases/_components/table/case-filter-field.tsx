import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function CaseFilterField({
  children,
  label
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function caseFilterControlClassName(className = "") {
  return `h-11 w-full rounded-xl border border-border/50 bg-card px-3 shadow-none outline-none focus-visible:border-ring/40 focus-visible:ring-2 focus-visible:ring-ring/10 ${className}`;
}
