import type { StaffListResponse } from "../_types/staff.types";
import type { StaffPracticeAreaOption, StaffRoleFormOption } from "../_types/staff-form.types";

export function mapPracticeAreaOptions(
  staffData: StaffListResponse | undefined
): StaffPracticeAreaOption[] {
  return (staffData?.filterOptions.practiceAreas ?? []).map((area) => ({
    description: area.description,
    label: area.name,
    templateCode: area.templateCode,
    value: area.id
  }));
}

export function mapAssignableRoleOptions({
  currentRole,
  roleLocked,
  staffData
}: {
  currentRole: string;
  roleLocked: boolean;
  staffData: StaffListResponse | undefined;
}): StaffRoleFormOption[] {
  return (staffData?.filterOptions.roles ?? [])
    .map((role) => ({
      assignable: role.assignable ?? true,
      code: role.code,
      description: role.description,
      label: role.name
    }))
    .filter((role) => role.assignable || (roleLocked && role.code === currentRole));
}
