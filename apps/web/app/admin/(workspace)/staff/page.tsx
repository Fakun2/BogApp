"use client";

import { RestrictedStaff } from "./_components/access/restricted-staff";
import { StaffMetrics } from "./_components/metrics/staff-metrics";
import { StaffTableCard } from "./_components/table/staff-table-card";
import { useStaffPageState } from "./_hooks/use-staff-page-state";
import { useStaffQuery } from "./_hooks/use-staff-query";
import { staffTablePageSize } from "./_constants/staff.constants";
import { RequirePermission } from "../_components/auth";

export default function StaffPage() {
  const staffState = useStaffPageState();

  const staffQuery = useStaffQuery({
    cursor: staffState.cursor,
    filters: staffState.appliedFilters,
    limit: staffTablePageSize,
    sortDirection: staffState.sortDirection,
    sortKey: staffState.sortKey
  });

  if (!staffQuery.hasSession) {
    return <RestrictedStaff />;
  }

  return (
    <RequirePermission permissions={["staff:read"]} fallback={<RestrictedStaff />}>
      <div className="flex h-[calc(100svh-104px)] min-h-0 flex-col gap-3 overflow-hidden md:h-[calc(100svh-112px)] md:gap-4">
        <StaffMetrics staffData={staffQuery.data} />

        <StaffTableCard
          canManageStaff={staffQuery.canCreateStaff}
          error={staffQuery.error}
          filters={staffState.draftFilters}
          filtersDisabled={staffQuery.isLoading && !staffQuery.data}
          hasActiveFilters={staffState.hasActiveFilters}
          hasDraftFilters={staffState.hasDraftFilters}
          loading={staffQuery.isLoading}
          pageIndex={staffState.pageIndex}
          pageInfo={staffQuery.data?.pageInfo}
          sortDirection={staffState.sortDirection}
          sortKey={staffState.sortKey}
          staffData={staffQuery.data}
          workers={staffQuery.data?.workers ?? []}
          onApplyFilters={staffState.applyFilters}
          onNextPage={staffState.nextPage}
          onPreviousPage={staffState.previousPage}
          onResetFilters={staffState.resetFilters}
          onStaffCreated={staffState.resetPagination}
          onSort={staffState.sortBy}
          onUpdateFilter={staffState.updateFilter}
        />
      </div>
    </RequirePermission>
  );
}
