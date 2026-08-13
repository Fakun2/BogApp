import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateStaffField({
  error,
  id,
  inputMode,
  label,
  maxLength,
  name,
  onChange,
  pattern,
  placeholder,
  required = false,
  type = "text",
  value
}: {
  error?: string;
  id: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  label: string;
  maxLength?: number;
  name: string;
  onChange: (value: string) => void;
  pattern?: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <Input
        autoComplete="off"
        id={id}
        inputMode={inputMode}
        maxLength={maxLength}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        pattern={pattern}
        placeholder={placeholder}
        className="h-12 rounded-2xl border-border/40 bg-card px-4 shadow-none focus-visible:border-ring/40 focus-visible:ring-2 focus-visible:ring-ring/10"
        type={type}
        value={value}
        aria-invalid={Boolean(error)}
      />
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
