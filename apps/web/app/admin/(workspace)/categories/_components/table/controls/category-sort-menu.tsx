import { SlidersHorizontal } from "lucide-react";
import { AdminTableHeaderActionButton } from "../../../../_components/admin-table-header-action-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type {
  CategorySortDirection,
  CategorySortKey
} from "../../../_types/categories.types";

const categorySortOptions: Array<{ label: string; value: CategorySortKey }> = [
  { label: "Nombre", value: "name" },
  { label: "Tipo", value: "kind" },
  { label: "Origen", value: "origin" },
  { label: "Estado", value: "active" }
];

export function CategorySortMenu({
  sortDirection,
  sortKey,
  onSort
}: {
  sortDirection: CategorySortDirection;
  sortKey: CategorySortKey;
  onSort: (key: CategorySortKey) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AdminTableHeaderActionButton icon={SlidersHorizontal} label="Ordenar" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuRadioGroup value={sortKey} onValueChange={(value) => onSort(value as CategorySortKey)}>
          {categorySortOptions.map((option) => (
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
