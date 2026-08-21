"use client";

import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import { dashboardKeys, searchDashboard } from "../_api/dashboard.api";
import type {
  DashboardSearchQueryParams,
  DashboardSearchResponse
} from "../_types/dashboard.types";

export function useDashboardSearchQuery(
  params: DashboardSearchQueryParams,
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useDashboardQuery<DashboardSearchResponse>({
    enabled,
    permission: "admin:access",
    queryKey: dashboardKeys.search(params),
    queryFn: () => searchDashboard(params)
  });
}
