"use client";

import { SlidersHorizontal } from "lucide-react";
import { AdminTableHeaderActionButton } from "../../../_components/admin-table-header-action-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { caseSortLabels } from "../../_constants/cases.constants";
import type { CaseSortDirection, CaseSortKey } from "../../_types/cases.types";

const sortOptions = Object.entries(caseSortLabels).map(([value, label]) => ({
  label,
  value: value as CaseSortKey
}));

export function CaseSortMenu({
  sortBy,
  sortDirection,
  onSort
}: {
  sortBy: CaseSortKey;
  sortDirection: CaseSortDirection;
  onSort: (key: CaseSortKey) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AdminTableHeaderActionButton icon={SlidersHorizontal} label="Ordenar" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuRadioGroup
          value={sortBy}
          onValueChange={(value) => onSort(value as CaseSortKey)}
        >
          {sortOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
              {sortBy === option.value ? (
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
