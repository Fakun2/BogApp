"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { StaffFilters, StaffListResponse } from "../../_types/staff.types";
import { StaffFiltersPanel } from "./staff-filters-panel";

export function StaffFiltersPopover({
  disabled,
  filters,
  hasActiveFilters,
  hasDraftFilters,
  staffData,
  onApply,
  onReset,
  onUpdateFilter
}: {
  disabled: boolean;
  filters: StaffFilters;
  hasActiveFilters: boolean;
  hasDraftFilters: boolean;
  staffData: StaffListResponse | undefined;
  onApply: () => void;
  onReset: () => void;
  onUpdateFilter: <K extends keyof StaffFilters>(key: K, value: StaffFilters[K]) => void;
}) {
  return (
    <div className="flex shrink-0 justify-end">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-2xl border-border/50 px-4"
            aria-label="Abrir filtros de personal"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filtros
            {hasActiveFilters ? (
              <span className="ml-1 size-2 rounded-full bg-primary" aria-hidden="true" />
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-2rem)] max-w-sm p-4" align="end">
          <StaffFiltersPanel
            disabled={disabled}
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            hasDraftFilters={hasDraftFilters}
            staffData={staffData}
            surface="plain"
            onApply={onApply}
            onReset={onReset}
            onUpdateFilter={onUpdateFilter}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
