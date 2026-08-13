import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { formatLocalDecimalInput } from "../_utils/local-decimal";

export function LocalDecimalInput({
  decimalScale,
  onChange,
  value,
  ...props
}: Omit<ComponentProps<typeof Input>, "onChange" | "value"> & {
  decimalScale: number;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <Input
      {...props}
      inputMode="decimal"
      value={value}
      onChange={(event) => onChange(formatLocalDecimalInput(event.target.value, decimalScale))}
    />
  );
}
