import {
  getCoreRowModel,
  type RowSelectionState,
  type VisibilityState,
  useReactTable
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
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
import { StaffTable } from "./staff-table";
import { getStaffTableColumns } from "./staff-table-columns";
import { StaffTableToolbar } from "./staff-table-toolbar";

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
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const columns = useMemo(
    () =>
      getStaffTableColumns({
        onStaffUpdated: onStaffCreated,
        sortDirection,
        sortKey,
        staffData,
        onSort
      }),
    [onStaffCreated, sortDirection, sortKey, staffData, onSort]
  );
  const table = useReactTable({
    columns,
    data: workers,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection
    }
  });

  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} flex min-h-[560px] flex-1 flex-col overflow-hidden border-0 shadow-[var(--admin-card-shadow)]`}
    >
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
      <CardContent className="flex min-h-0 flex-1 flex-col px-6">
        <StaffTable
          error={error}
          loading={loading}
          pageIndex={pageIndex}
          pageInfo={pageInfo}
          table={table}
          workers={workers}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
        />
      </CardContent>
    </Card>
  );
}
