import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { allStaffFilterValue } from "../../_constants/staff.constants";
import { filterControlClassName } from "../../_utils/staff-format";
import { FilterField } from "./filter-field";

export function StaffSelectFilter({
  disabled,
  label,
  options,
  value,
  onValueChange
}: {
  disabled: boolean;
  label: string;
  options: Array<{ label: string; value: string }>;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <FilterField label={label}>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={filterControlClassName("w-full")}>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={allStaffFilterValue}>Todos</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterField>
  );
}
