"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <Button type="button" variant="outline" className={casesTableActionButtonClassName()}>
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Ordenar</span>
        </Button>
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

export function casesTableActionButtonClassName() {
  return "h-10 w-10 rounded-xl border-border/40 bg-card p-0 text-base font-semibold text-foreground shadow-[0_10px_24px_-22px_rgba(15,23,42,0.35)] hover:bg-secondary/40 sm:h-11 sm:w-auto sm:px-4";
}
