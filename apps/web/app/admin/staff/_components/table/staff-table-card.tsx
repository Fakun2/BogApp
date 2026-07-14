import {
  getCoreRowModel,
  type RowSelectionState,
  type VisibilityState,
  useReactTable
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { adminSurfaceClassName } from "../../../_constants/dashboard";
import type {
  StaffListResponse,
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
  loading,
  pageIndex,
  pageInfo,
  sortDirection,
  sortKey,
  staffData,
  workers,
  onNextPage,
  onPreviousPage,
  onStaffCreated,
  onSort
}: {
  canManageStaff: boolean;
  error: Error | null;
  loading: boolean;
  pageIndex: number;
  pageInfo: StaffListResponse["pageInfo"] | undefined;
  sortDirection: StaffSortDirection;
  sortKey: StaffSortKey;
  staffData: StaffListResponse | undefined;
  workers: StaffWorker[];
  onNextPage: (cursor: string) => void;
  onPreviousPage: () => void;
  onStaffCreated: () => void;
  onSort: (key: StaffSortKey) => void;
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
      <CardHeader className="flex flex-row items-center justify-between gap-4 px-6">
        <StaffTableToolbar
          canManageStaff={canManageStaff}
          sortDirection={sortDirection}
          sortKey={sortKey}
          staffData={staffData}
          table={table}
          onStaffCreated={onStaffCreated}
          onSort={onSort}
        />
      </CardHeader>
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
