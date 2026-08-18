"use client";

import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import { dashboardKeys, getAdminDashboardMetrics } from "../_api/dashboard.api";
import type { DashboardMetricsDto } from "../_types/dashboard.types";

export function useAdminDashboardMetricsQuery(initialData?: DashboardMetricsDto | null) {
  return useDashboardQuery({
    initialData: initialData ?? undefined,
    permission: "admin:access",
    queryKey: dashboardKeys.metrics(),
    queryFn: () => getAdminDashboardMetrics()
  });
}
