"use client";

import { SlidersHorizontal } from "lucide-react";
import { AdminTableHeaderActionButton } from "../../../_components/admin-table-header-action-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCaseFiltersController } from "../../_hooks/use-case-filters-controller";
import type { CaseFiltersDraft } from "../../_types/case-filter.types";
import { CaseFilterActions } from "./case-filter-actions";
import { CaseFilterControls } from "./case-filter-controls";

export function CaseFiltersPopover({
  disabled,
  filters,
  onApply,
  onReset
}: {
  disabled: boolean;
  filters: CaseFiltersDraft;
  onApply: (filters: CaseFiltersDraft) => void;
  onReset: () => void;
}) {
  const {
    draft,
    forums,
    forumsLoading,
    hasActiveFilters,
    hasDraftFilters,
    provinces,
    provincesLoading,
    updateDraft
  } = useCaseFiltersController(filters);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <AdminTableHeaderActionButton
          icon={SlidersHorizontal}
          label="Filtros"
          aria-label="Abrir filtros de expedientes"
        >
          {hasActiveFilters ? (
            <span className="ml-1 size-2 rounded-full bg-primary" aria-hidden="true" />
          ) : null}
        </AdminTableHeaderActionButton>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] max-w-2xl p-4" align="end">
        <div className="grid gap-3 md:grid-cols-2">
          <CaseFilterControls
            disabled={disabled}
            draft={draft}
            forums={forums}
            forumsLoading={forumsLoading}
            provinces={provinces}
            provincesLoading={provincesLoading}
            onUpdateDraft={updateDraft}
          />
          <CaseFilterActions
            disabled={disabled}
            hasActiveFilters={hasActiveFilters}
            hasDraftFilters={hasDraftFilters}
            onApply={() => onApply(draft)}
            onReset={onReset}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
