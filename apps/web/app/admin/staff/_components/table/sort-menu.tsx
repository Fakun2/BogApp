import { SlidersHorizontal } from "lucide-react";
import { AdminTableHeaderActionButton } from "../../../_components/admin-table-header-action-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { StaffSortDirection, StaffSortKey } from "../../_types/staff.types";

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
        <AdminTableHeaderActionButton icon={SlidersHorizontal} label="Ordenar" />
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
