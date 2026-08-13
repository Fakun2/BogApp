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
  CurrencySortDirection,
  CurrencySortKey
} from "../../../_types/currencies.types";

export function CurrencySortMenu({
  sortDirection,
  sortKey,
  onSort
}: {
  sortDirection: CurrencySortDirection;
  sortKey: CurrencySortKey;
  onSort: (key: CurrencySortKey) => void;
}) {
  const sortOptions: Array<{ label: string; value: CurrencySortKey }> = [
    { label: "Nombre", value: "name" },
    { label: "Codigo", value: "code" },
    { label: "Estado", value: "active" }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AdminTableHeaderActionButton icon={SlidersHorizontal} label="Ordenar" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuRadioGroup value={sortKey} onValueChange={(value) => onSort(value as CurrencySortKey)}>
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
