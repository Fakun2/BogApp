import type { CreateStaffFormValues } from "@/lib/validation/staff";

export type StaffFormMode = "create" | "update";

export type StaffFormErrors = Partial<Record<keyof CreateStaffFormValues, string>>;

export type StaffDraft = {
  assignPracticeArea: boolean;
  avatarUrl: string;
  dni: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
  practiceAreaIds: string[];
  role: string;
  status: "active" | "suspended";
};

export type StaffPracticeAreaOption = {
  description: string | null;
  label: string;
  templateCode: string | null;
  value: string;
};

export type StaffRoleFormOption = {
  assignable: boolean;
  code: string;
  description: string | null;
  label: string;
};
