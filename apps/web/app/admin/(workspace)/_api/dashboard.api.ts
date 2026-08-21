import { dashboardHttpClient } from "@/lib/http";
import type {
  DashboardMetricsDto,
  DashboardSearchQueryParams,
  DashboardSearchResponse
} from "../_types/dashboard.types";

export const dashboardKeys = {
  all: ["admin-dashboard"] as const,
  metrics: () => [...dashboardKeys.all, "metrics"] as const,
  search: (params: DashboardSearchQueryParams) => [...dashboardKeys.all, "search", params] as const
};

export function getAdminDashboardMetrics() {
  return dashboardHttpClient.request<DashboardMetricsDto>({
    path: "/dashboard/metrics"
  });
}

export function searchDashboard(params: DashboardSearchQueryParams) {
  return dashboardHttpClient.request<DashboardSearchResponse>({
    params,
    path: "/dashboard/search"
  });
}
