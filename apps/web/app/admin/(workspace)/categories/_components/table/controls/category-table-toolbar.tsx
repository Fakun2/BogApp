import type { Table } from "@tanstack/react-table";
import { Can } from "../../../../_components/auth";
import type {
  CategoryDto,
  CategoryFiltersState,
  CategorySortDirection,
  CategorySortKey
} from "../../../_types/categories.types";
import { CategoryFormDialog } from "../actions/category-form-dialog";
import { CategoryFiltersDialog } from "./category-filters-dialog";
import { CategorySortMenu } from "./category-sort-menu";
import { CategoryTableViewOptions } from "./category-table-view-options";

export function CategoryTableToolbar({
  filters,
  sortDirection,
  sortKey,
  table,
  onApplyFilters,
  onClearFilters,
  onCreateSuccess,
  onSort
}: {
  filters: CategoryFiltersState;
  sortDirection: CategorySortDirection;
  sortKey: CategorySortKey;
  table: Table<CategoryDto>;
  onApplyFilters: (filters: CategoryFiltersState) => void;
  onClearFilters: () => void;
  onCreateSuccess: () => void;
  onSort: (key: CategorySortKey) => void;
}) {
  return (
    <>
      <Can permissions={["categories:create"]}>
        <CategoryFormDialog mode="create" onSuccess={onCreateSuccess} />
      </Can>
      <CategoryFiltersDialog filters={filters} onApply={onApplyFilters} onClear={onClearFilters} />
      <CategorySortMenu sortDirection={sortDirection} sortKey={sortKey} onSort={onSort} />
      <CategoryTableViewOptions table={table} />
    </>
  );
}
