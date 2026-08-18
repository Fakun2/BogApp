import { dashboardHttpClient } from "@/lib/http";
import type { DashboardMetricsDto } from "../_types/dashboard.types";

export const dashboardKeys = {
  all: ["admin-dashboard"] as const,
  metrics: () => [...dashboardKeys.all, "metrics"] as const
};

export function getAdminDashboardMetrics() {
  return dashboardHttpClient.request<DashboardMetricsDto>({
    path: "/dashboard/metrics"
  });
}
