import {
  getStaffControllerCreateUrl,
  getStaffControllerDeleteUrl,
  getStaffControllerListUrl,
  getStaffControllerUpdateUrl,
  type StaffCreateResponseDto,
  type StaffDeleteResponseDto,
  type StaffListResponseDto,
  type StaffUpdateResponseDto
} from "@bogaap/api-client";
import { dashboardHttpClient } from "@/lib/http";
import { allStaffFilterValue } from "../_constants/staff.constants";
import type { StaffQueryParams } from "../_types/staff.types";
import type { CreateStaffFormValues, UpdateStaffFormValues } from "@/lib/validation/staff";
import type { BogaapSession } from "@/lib/auth/session";

export const staffKeys = {
  all: ["staff"] as const,
  list: (params: StaffQueryParams) => [...staffKeys.all, "list", params] as const
};

export async function listStaff({
  cursor,
  filters,
  limit,
  sortDirection,
  sortKey
}: StaffQueryParams & { session: BogaapSession; tenantId: string }): Promise<StaffListResponseDto> {
  const params = new URLSearchParams();
  appendFilter(params, "cursor", cursor ?? "");
  appendFilter(params, "firstName", filters.firstName);
  appendFilter(params, "lastName", filters.lastName);
  appendFilter(params, "practiceAreaId", filters.practiceAreaId);
  appendFilter(params, "role", filters.role);
  appendFilter(params, "status", filters.status);
  params.set("limit", String(limit));
  params.set("sortBy", sortKey);
  params.set("sortDirection", sortDirection);

  return dashboardHttpClient.request<StaffListResponseDto>({
    params,
    path: getStaffControllerListUrl()
  });
}

export async function createStaff({
  input
}: {
  input: CreateStaffFormValues;
  session: BogaapSession;
  tenantId: string;
}): Promise<StaffCreateResponseDto> {
  return dashboardHttpClient.request<StaffCreateResponseDto>({
    body: {
      ...input,
      avatarUrl: input.avatarUrl || undefined,
      phone: input.phone || undefined
    },
    method: "POST",
    path: getStaffControllerCreateUrl()
  });
}

export async function updateStaff({
  input,
  staffId
}: {
  input: UpdateStaffFormValues;
  session: BogaapSession;
  staffId: string;
  tenantId: string;
}): Promise<StaffUpdateResponseDto> {
  return dashboardHttpClient.request<StaffUpdateResponseDto>({
    body: {
      ...input,
      avatarUrl: input.avatarUrl || undefined,
      password: input.password || undefined,
      phone: input.phone || undefined
    },
    method: "PATCH",
    path: getStaffControllerUpdateUrl(staffId)
  });
}

export async function deleteStaff({
  staffId
}: {
  session: BogaapSession;
  staffId: string;
  tenantId: string;
}): Promise<StaffDeleteResponseDto> {
  return dashboardHttpClient.request<StaffDeleteResponseDto>({
    method: "DELETE",
    path: getStaffControllerDeleteUrl(staffId)
  });
}

function appendFilter(params: URLSearchParams, key: string, value: string) {
  if (value && value !== allStaffFilterValue) {
    params.set(key, value);
  }
}
