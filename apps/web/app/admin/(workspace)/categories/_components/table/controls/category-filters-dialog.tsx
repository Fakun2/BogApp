"use client";

import { useState, type FormEvent } from "react";
import { ArrowDownUp, Boxes, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AdminTableFilterClearItem,
  AdminTableFilterMenu
} from "../../../../_components/admin-table-filter-menu";
import type {
  CategoryFiltersState,
  CategoryKindFilter,
  CategoryOriginFilter,
  CategoryStatusFilter
} from "../../../_types/categories.types";
import {
  categoryKindFilterOptions,
  categoryOriginFilterOptions,
  categoryStatusFilterOptions,
  getActiveCategoryFiltersCount
} from "../../../_utils/category-filters";

export function CategoryFiltersDialog({
  filters,
  onApply,
  onClear
}: {
  filters: CategoryFiltersState;
  onApply: (filters: CategoryFiltersState) => void;
  onClear: () => void;
}) {
  const activeFiltersCount = getActiveCategoryFiltersCount(filters);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);

  function applyFilter<K extends keyof CategoryFiltersState>(
    key: K,
    value: CategoryFiltersState[K]
  ) {
    onApply({ ...filters, [key]: value });
  }

  function openSearchDialog() {
    setSearchValue(filters.search);
    setSearchDialogOpen(true);
  }

  function submitSearchDialog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFilter("search", searchValue.trim());
    setSearchDialogOpen(false);
  }

  return (
    <>
      <AdminTableFilterMenu
        active={activeFiltersCount > 0}
        label={activeFiltersCount > 0 ? `Filtros (${activeFiltersCount})` : "Filtros"}
        sections={[
          {
            icon: Search,
            label: "Nombre",
            options: [
              { active: !filters.search, label: "Todos", onSelect: () => applyFilter("search", "") },
              {
                active: Boolean(filters.search),
                label: "Buscar...",
                valueLabel: filters.search || undefined,
                onSelect: openSearchDialog
              }
            ]
          },
          {
            icon: Boxes,
            label: "Origen",
            options: categoryOriginFilterOptions.map((option) => ({
              active: filters.origin === option.value,
              label: option.label,
              onSelect: () => applyFilter("origin", option.value as CategoryOriginFilter)
            }))
          },
          {
            icon: ArrowDownUp,
            label: "Tipo",
            options: categoryKindFilterOptions.map((option) => ({
              active: filters.kind === option.value,
              label: option.label,
              onSelect: () => applyFilter("kind", option.value as CategoryKindFilter)
            }))
          },
          {
            icon: ShieldCheck,
            label: "Estado",
            options: categoryStatusFilterOptions.map((option) => ({
              active: filters.status === option.value,
              label: option.label,
              onSelect: () => applyFilter("status", option.value as CategoryStatusFilter)
            }))
          }
        ]}
        footer={<AdminTableFilterClearItem disabled={activeFiltersCount === 0} onClear={onClear} />}
      />

      <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filtrar por nombre</DialogTitle>
            <DialogDescription>Ingresa el texto que queres buscar en categorias.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={submitSearchDialog}>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs text-muted-foreground">Nombre</span>
              <Input
                autoFocus
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Buscar categoria"
              />
            </label>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setSearchDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Aplicar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
