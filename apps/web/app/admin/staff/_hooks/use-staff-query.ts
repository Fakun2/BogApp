"use client";

import { hasPermission } from "@/lib/auth/permissions";
import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import { listStaff, staffKeys } from "../_api/staff.api";
import type { StaffQueryParams } from "../_types/staff.types";

export function useStaffQuery(params: StaffQueryParams) {
  const query = useDashboardQuery({
    permission: "staff:read",
    queryKey: staffKeys.list(params),
    queryFn: ({ session, tenantId }) => listStaff({ ...params, session, tenantId })
  });

  return {
    ...query,
    canCreateStaff: hasPermission(query.session, "staff:create"),
    canManageStaff: hasPermission(query.session, "staff:manage"),
    canReadStaff: query.hasPermission
  };
}
