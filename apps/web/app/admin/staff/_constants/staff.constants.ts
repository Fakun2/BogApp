import type { StaffFilters } from "../_types/staff.types";

export const allStaffFilterValue = "all";

export const initialStaffFilters: StaffFilters = {
  firstName: "",
  lastName: "",
  practiceAreaId: allStaffFilterValue,
  role: allStaffFilterValue,
  status: allStaffFilterValue
};

export const staffTablePageSize = 6;
