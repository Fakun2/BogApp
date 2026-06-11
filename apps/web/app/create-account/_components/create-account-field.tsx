import { Label } from "@/components/ui/label";
import type { CreateAccountFieldProps } from "../_types/create-account.types";

export function CreateAccountField({ label, error, children }: CreateAccountFieldProps) {
  return (
    <div className="grid gap-2">
      <Label className="sr-only">{label}</Label>
      {children}
      {error ? <p className="px-1 text-sm text-foreground">{error}</p> : null}
    </div>
  );
}
