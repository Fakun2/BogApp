import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function CaseField({
  children,
  className = "",
  error,
  label,
  required = false
}: {
  children: ReactNode;
  className?: string;
  error?: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div className={`grid min-w-0 gap-2 ${className}`}>
      <Label>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
