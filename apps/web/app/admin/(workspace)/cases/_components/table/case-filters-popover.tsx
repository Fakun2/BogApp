"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { AdminTableHeaderActionButton } from "../../../_components/admin-table-header-action-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
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
  const [open, setOpen] = useState(false);
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

  function handleApply() {
    onApply(draft);
    setOpen(false);
  }

  function handleReset() {
    onReset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AdminTableHeaderActionButton
          icon={SlidersHorizontal}
          label="Filtros"
          aria-label="Abrir filtros de expedientes"
        >
          {hasActiveFilters ? (
            <span className="ml-1 size-2 rounded-full bg-primary" aria-hidden="true" />
          ) : null}
        </AdminTableHeaderActionButton>
      </DialogTrigger>
      <DialogContent className="max-h-[min(720px,calc(100svh-2rem))] w-[calc(100vw-2rem)] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border/40 px-5 pb-4 pt-5">
          <DialogTitle>Filtros de expedientes</DialogTitle>
          <DialogDescription>
            Ajusta los criterios para revisar el volumen de expedientes sin salir de la tabla.
          </DialogDescription>
        </DialogHeader>
        <div className="grid min-h-0 gap-3 overflow-y-auto px-5 py-5 md:grid-cols-2">
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
            onApply={handleApply}
            onReset={handleReset}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
