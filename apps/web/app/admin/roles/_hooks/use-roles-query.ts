"use client";

import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import { listRolesAccess, roleKeys } from "../_api/roles.api";

export function useRolesQuery() {
  return useDashboardQuery({
    permission: "roles:read",
    queryKey: roleKeys.access(),
    queryFn: listRolesAccess
  });
}
