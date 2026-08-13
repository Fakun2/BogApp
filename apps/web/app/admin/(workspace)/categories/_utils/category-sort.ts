import type {
  CategorySortDirection,
  CategorySortKey,
  CategoryQueryParams
} from "../_types/categories.types";

export function toCategorySort(
  sortKey: CategorySortKey,
  sortDirection: CategorySortDirection
): CategoryQueryParams["sort"] {
  return `${sortKey}:${sortDirection}`;
}
