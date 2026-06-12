import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type LoginFieldProps = {
  children: ReactNode;
  error?: string;
  label: string;
};

export function LoginField({ children, error, label }: LoginFieldProps) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
