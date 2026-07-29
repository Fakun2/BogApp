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

export const staffTableCellClassNameByColumn: Record<string, string> = {
  actions: "w-24 px-4 py-4",
  dni: "min-w-[120px] px-4 py-4",
  personal: "min-w-[240px] px-4 py-4",
  phone: "min-w-[150px] px-4 py-4",
  practiceAreas: "min-w-[180px] px-4 py-4",
  role: "px-4 py-4",
  select: "w-10 px-4 py-4",
  status: "px-4 py-4"
};
