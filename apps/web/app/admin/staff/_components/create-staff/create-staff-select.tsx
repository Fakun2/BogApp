import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export function CreateStaffSelect({
  disabled = false,
  label,
  onValueChange,
  options,
  placeholder,
  value
}: {
  disabled?: boolean;
  label: string;
  onValueChange?: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder: string;
  value?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select
        defaultValue={value === undefined ? options[0]?.value : undefined}
        disabled={disabled}
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
