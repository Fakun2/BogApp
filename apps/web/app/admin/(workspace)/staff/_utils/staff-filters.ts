import { allStaffFilterValue } from "../_constants/staff.constants";
import type { StaffFilters } from "../_types/staff.types";

export function hasStaffFilters(filters: StaffFilters) {
  return Object.values(filters).some((value) => value !== "" && value !== allStaffFilterValue);
}
