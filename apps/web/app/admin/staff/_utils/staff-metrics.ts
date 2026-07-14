import type { StaffListResponse } from "../_types/staff.types";

export function getStaffMetricCounts(staffData: StaffListResponse | undefined) {
  const totalWorkers = staffData?.metrics.totalWorkers ?? 0;
  const activeWorkers = staffData?.metrics.activeWorkers ?? 0;

  return {
    activeWorkers,
    inactiveWorkers: Math.max(totalWorkers - activeWorkers, 0),
    practiceAreasCount: staffData?.metrics.practiceAreasCount ?? 0,
    totalWorkers
  };
}
