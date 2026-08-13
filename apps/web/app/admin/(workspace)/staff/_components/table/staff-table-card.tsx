import { UsersRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AdminTableHeader } from "../../../_components/admin-table-header";
import { adminSurfaceClassName } from "../../../_constants/dashboard";
import type {
  StaffListResponse,
  StaffFilters,
  StaffSortDirection,
  StaffSortKey,
  StaffWorker
} from "../../_types/staff.types";
import { StaffTableProvider, useStaffTableContext } from "./context/staff-table-context";
import { StaffTable } from "./staff-table";
import { StaffTableToolbar } from "./controls/staff-table-toolbar";

export function StaffTableCard({
  canManageStaff,
  error,
  filters,
  filtersDisabled,
  hasActiveFilters,
  hasDraftFilters,
  loading,
  pageIndex,
  pageInfo,
  sortDirection,
  sortKey,
  staffData,
  workers,
  onApplyFilters,
  onNextPage,
  onPreviousPage,
  onResetFilters,
  onStaffCreated,
  onSort,
  onUpdateFilter
}: {
  canManageStaff: boolean;
  error: Error | null;
  filters: StaffFilters;
  filtersDisabled: boolean;
  hasActiveFilters: boolean;
  hasDraftFilters: boolean;
  loading: boolean;
  pageIndex: number;
  pageInfo: StaffListResponse["pageInfo"] | undefined;
  sortDirection: StaffSortDirection;
  sortKey: StaffSortKey;
  staffData: StaffListResponse | undefined;
  workers: StaffWorker[];
  onApplyFilters: () => void;
  onNextPage: (cursor: string) => void;
  onPreviousPage: () => void;
  onResetFilters: () => void;
  onStaffCreated: () => void;
  onSort: (key: StaffSortKey) => void;
  onUpdateFilter: <K extends keyof StaffFilters>(key: K, value: StaffFilters[K]) => void;
}) {
  return (
    <StaffTableProvider
      error={error}
      loading={loading}
      pageIndex={pageIndex}
      pageInfo={pageInfo}
      sortDirection={sortDirection}
      sortKey={sortKey}
      staffData={staffData}
      workers={workers}
      onNextPage={onNextPage}
      onPreviousPage={onPreviousPage}
      onSort={onSort}
      onStaffCreated={onStaffCreated}
    >
      <Card
        data-admin-surface
        className={`${adminSurfaceClassName} flex min-h-0 flex-1 flex-col overflow-hidden border-0 py-0 shadow-[var(--admin-card-shadow)]`}
      >
        <StaffTableCardHeader
          canManageStaff={canManageStaff}
          filters={filters}
          filtersDisabled={filtersDisabled}
          hasActiveFilters={hasActiveFilters}
          hasDraftFilters={hasDraftFilters}
          sortDirection={sortDirection}
          sortKey={sortKey}
          staffData={staffData}
          onApplyFilters={onApplyFilters}
          onResetFilters={onResetFilters}
          onStaffCreated={onStaffCreated}
          onSort={onSort}
          onUpdateFilter={onUpdateFilter}
        />
        <CardContent className="flex min-h-0 flex-1 flex-col overflow-visible px-3 md:px-4 lg:overflow-hidden">
          <StaffTable />
        </CardContent>
      </Card>
    </StaffTableProvider>
  );
}

function StaffTableCardHeader({
  canManageStaff,
  filters,
  filtersDisabled,
  hasActiveFilters,
  hasDraftFilters,
  sortDirection,
  sortKey,
  staffData,
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
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onStaffCreated: () => void;
  onSort: (key: StaffSortKey) => void;
  onUpdateFilter: <K extends keyof StaffFilters>(key: K, value: StaffFilters[K]) => void;
}) {
  const { table } = useStaffTableContext();

  return (
    <AdminTableHeader
      actions={
        <StaffTableToolbar
          canManageStaff={canManageStaff}
          filters={filters}
          filtersDisabled={filtersDisabled}
          hasActiveFilters={hasActiveFilters}
          hasDraftFilters={hasDraftFilters}
          sortDirection={sortDirection}
          sortKey={sortKey}
          staffData={staffData}
          table={table}
          onApplyFilters={onApplyFilters}
          onResetFilters={onResetFilters}
          onStaffCreated={onStaffCreated}
          onSort={onSort}
          onUpdateFilter={onUpdateFilter}
        />
      }
      icon={UsersRound}
      title="Personal"
    />
  );
}
