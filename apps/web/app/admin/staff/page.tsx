"use client";

import { RestrictedStaff } from "./_components/access/restricted-staff";
import { StaffFiltersPopover } from "./_components/filters/staff-filters-popover";
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
      <div className="flex min-h-[calc(100vh-136px)] flex-col gap-4 md:min-h-[calc(100vh-152px)]">
        <StaffMetrics staffData={staffQuery.data} />

        <StaffFiltersPopover
          disabled={staffQuery.isLoading && !staffQuery.data}
          filters={staffState.draftFilters}
          hasActiveFilters={staffState.hasActiveFilters}
          hasDraftFilters={staffState.hasDraftFilters}
          staffData={staffQuery.data}
          onApply={staffState.applyFilters}
          onReset={staffState.resetFilters}
          onUpdateFilter={staffState.updateFilter}
        />

        <StaffTableCard
          canManageStaff={staffQuery.canCreateStaff}
          error={staffQuery.error}
          loading={staffQuery.isLoading}
          pageIndex={staffState.pageIndex}
          pageInfo={staffQuery.data?.pageInfo}
          sortDirection={staffState.sortDirection}
          sortKey={staffState.sortKey}
          staffData={staffQuery.data}
          workers={staffQuery.data?.workers ?? []}
          onNextPage={staffState.nextPage}
          onPreviousPage={staffState.previousPage}
          onStaffCreated={staffState.resetPagination}
          onSort={staffState.sortBy}
        />
      </div>
    </RequirePermission>
  );
}
