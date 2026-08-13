import type { CategoryFiltersState } from "../_types/categories.types";

export const defaultCategoryFilters: CategoryFiltersState = {
  kind: "all",
  origin: "all",
  search: "",
  status: "all"
};

export const categoryOriginFilterOptions = [
  { label: "Todos", value: "all" },
  { label: "Global", value: "global" },
  { label: "Del estudio", value: "tenant" }
] as const;

export const categoryKindFilterOptions = [
  { label: "Todos", value: "all" },
  { label: "Ingreso", value: "income" },
  { label: "Egreso", value: "expense" },
  { label: "Ambos", value: "both" }
] as const;

export const categoryStatusFilterOptions = [
  { label: "Todos", value: "all" },
  { label: "Activa", value: "active" },
  { label: "Inactiva", value: "inactive" }
] as const;

export function normalizeCategoryFilters(filters: CategoryFiltersState): CategoryFiltersState {
  return {
    kind: filters.kind,
    origin: filters.origin,
    search: filters.search.trim(),
    status: filters.status
  };
}

export function getActiveCategoryFiltersCount(filters: CategoryFiltersState) {
  const normalizedFilters = normalizeCategoryFilters(filters);
  const filterFlags = [
    normalizedFilters.search.length > 0,
    normalizedFilters.origin !== "all",
    normalizedFilters.kind !== "all",
    normalizedFilters.status !== "all"
  ];

  return filterFlags.filter(Boolean).length;
}
