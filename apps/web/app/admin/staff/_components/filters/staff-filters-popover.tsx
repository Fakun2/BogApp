"use client";

import { SlidersHorizontal } from "lucide-react";
import { AdminTableHeaderActionButton } from "../../../_components/admin-table-header-action-button";
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
          <AdminTableHeaderActionButton
            icon={SlidersHorizontal}
            label="Filtros"
            aria-label="Abrir filtros de personal"
          >
            {hasActiveFilters ? (
              <span className="ml-1 size-2 rounded-full bg-primary" aria-hidden="true" />
            ) : null}
          </AdminTableHeaderActionButton>
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
