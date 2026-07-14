import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { StaffSortDirection, StaffSortKey } from "../../_types/staff.types";
import { tableActionButtonClassName } from "../../_utils/staff-format";

export function SortMenu({
  sortDirection,
  sortKey,
  onSort
}: {
  sortDirection: StaffSortDirection;
  sortKey: StaffSortKey;
  onSort: (key: StaffSortKey) => void;
}) {
  const sortOptions: Array<{ label: string; value: StaffSortKey }> = [
    { label: "Nombre", value: "firstName" },
    { label: "Apellido", value: "lastName" },
    { label: "Rol", value: "role" },
    { label: "Estado", value: "status" }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" className={tableActionButtonClassName()}>
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Ordenar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuRadioGroup value={sortKey} onValueChange={(value) => onSort(value as StaffSortKey)}>
          {sortOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
              {sortKey === option.value ? (
                <span className="ml-auto text-xs text-muted-foreground">
                  {sortDirection === "asc" ? "Asc" : "Desc"}
                </span>
              ) : null}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
