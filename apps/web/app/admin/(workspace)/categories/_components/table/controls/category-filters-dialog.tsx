"use client";

import { useEffect, useState } from "react";
import { Filter, RotateCcw } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { AdminTableHeaderActionButton } from "../../../../_components/admin-table-header-action-button";
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
  defaultCategoryFilters,
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
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CategoryFiltersState>(filters);
  const activeFiltersCount = getActiveCategoryFiltersCount(filters);

  useEffect(() => {
    if (open) {
      setDraft(filters);
    }
  }, [filters, open]);

  function handleApply() {
    onApply(draft);
    setOpen(false);
  }

  function handleClear() {
    setDraft(defaultCategoryFilters);
    onClear();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <AdminTableHeaderActionButton
        icon={Filter}
        label={activeFiltersCount > 0 ? `Filtros (${activeFiltersCount})` : "Filtros"}
        onClick={() => setOpen(true)}
      />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Filtrar categorias</DialogTitle>
          <DialogDescription>
            Ajusta la vista por nombre, origen, tipo y estado.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Nombre
            <Input
              value={draft.search}
              onChange={(event) =>
                setDraft((current) => ({ ...current, search: event.target.value }))
              }
              placeholder="Buscar categoria"
              className="h-11"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-2 text-sm font-medium">
              Origen
              <Select
                value={draft.origin}
                onValueChange={(value) =>
                  setDraft((current) => ({ ...current, origin: value as CategoryOriginFilter }))
                }
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOriginFilterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Tipo
              <Select
                value={draft.kind}
                onValueChange={(value) =>
                  setDraft((current) => ({ ...current, kind: value as CategoryKindFilter }))
                }
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryKindFilterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Estado
              <Select
                value={draft.status}
                onValueChange={(value) =>
                  setDraft((current) => ({ ...current, status: value as CategoryStatusFilter }))
                }
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryStatusFilterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="outline" onClick={handleClear}>
              <RotateCcw className="h-4 w-4" />
              Limpiar
            </Button>
            <Button type="button" onClick={handleApply}>
              <Filter className="h-4 w-4" />
              Aplicar filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
