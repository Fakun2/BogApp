import type { Table } from "@tanstack/react-table";
import { UsersRound } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Can } from "../../../_components/auth";
import { adminSurfacePrimaryClassName } from "../../../_constants/dashboard";
import type {
  StaffListResponse,
  StaffSortDirection,
  StaffSortKey,
  StaffWorker
} from "../../_types/staff.types";
import { CreateStaffSheet } from "../create-staff/create-staff-sheet";
import { DataTableViewOptions } from "./data-table-view-options";
import { SortMenu } from "./sort-menu";

export function StaffTableToolbar({
  canManageStaff,
  sortDirection,
  sortKey,
  staffData,
  table,
  onStaffCreated,
  onSort
}: {
  canManageStaff: boolean;
  sortDirection: StaffSortDirection;
  sortKey: StaffSortKey;
  staffData: StaffListResponse | undefined;
  table: Table<StaffWorker>;
  onStaffCreated: () => void;
  onSort: (key: StaffSortKey) => void;
}) {
  return (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <UsersRound className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <CardTitle className={`truncate text-lg font-semibold ${adminSurfacePrimaryClassName}`}>
          Personal
        </CardTitle>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Can permissions={["staff:create"]}>
          {canManageStaff ? (
            <CreateStaffSheet staffData={staffData} onCreated={onStaffCreated} />
          ) : null}
        </Can>
        <SortMenu sortDirection={sortDirection} sortKey={sortKey} onSort={onSort} />
        <DataTableViewOptions table={table} />
      </div>
    </>
  );
}
