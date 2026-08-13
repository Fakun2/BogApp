import type { Table } from "@tanstack/react-table";
import { Can } from "../../../../_components/auth";
import type {
  StaffFilters,
  StaffListResponse,
  StaffSortDirection,
  StaffSortKey,
  StaffWorker
} from "../../../_types/staff.types";
import { StaffFiltersPopover } from "../../filters/staff-filters-popover";
import { CreateStaffSheet } from "../../create-staff/create-staff-sheet";
import { DataTableViewOptions } from "./data-table-view-options";
import { SortMenu } from "./sort-menu";

export function StaffTableToolbar({
  canManageStaff,
  filters,
  filtersDisabled,
  hasActiveFilters,
  hasDraftFilters,
  sortDirection,
  sortKey,
  staffData,
  table,
  onApplyFilters,
  onResetFilters,
  onStaffCreated,
  onSort,
  onUpdateFilter
}: {
  canManageStaff: boolean;
  filters: StaffFilters;
  filtersDisabled: boolean;
  hasActiveFilters: boolean;
  hasDraftFilters: boolean;
  sortDirection: StaffSortDirection;
  sortKey: StaffSortKey;
  staffData: StaffListResponse | undefined;
  table: Table<StaffWorker>;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onStaffCreated: () => void;
  onSort: (key: StaffSortKey) => void;
  onUpdateFilter: <K extends keyof StaffFilters>(key: K, value: StaffFilters[K]) => void;
}) {
  return (
    <>
      <Can permissions={["staff:create"]}>
        {canManageStaff ? (
          <CreateStaffSheet staffData={staffData} onCreated={onStaffCreated} />
        ) : null}
      </Can>
      <StaffFiltersPopover
        disabled={filtersDisabled}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        hasDraftFilters={hasDraftFilters}
        staffData={staffData}
        onApply={onApplyFilters}
        onReset={onResetFilters}
        onUpdateFilter={onUpdateFilter}
      />
      <SortMenu sortDirection={sortDirection} sortKey={sortKey} onSort={onSort} />
      <DataTableViewOptions table={table} />
    </>
  );
}
