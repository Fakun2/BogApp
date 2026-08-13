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
  actions: "h-16 w-24 px-3 py-2",
  dni: "h-16 min-w-[120px] px-3 py-2",
  personal: "h-16 min-w-[240px] px-3 py-2",
  phone: "h-16 min-w-[150px] px-3 py-2",
  practiceAreas: "h-16 min-w-[180px] px-3 py-2",
  role: "h-16 px-3 py-2",
  select: "h-16 w-10 px-3 py-2",
  status: "h-16 px-3 py-2"
};

export const staffTableHeaderClassNameByColumn: Record<string, string> = {
  actions: "w-24",
  dni: "min-w-[120px]",
  personal: "min-w-[240px]",
  phone: "min-w-[150px]",
  practiceAreas: "min-w-[180px]",
  role: "",
  select: "w-10",
  status: ""
};
