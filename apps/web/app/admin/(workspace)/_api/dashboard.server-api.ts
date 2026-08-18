import { requestAdminApiServer } from "@/lib/api/admin-server";
import type { DashboardMetricsDto } from "../_types/dashboard.types";

export function getAdminDashboardMetricsServer() {
  return requestAdminApiServer<DashboardMetricsDto>("/api/dashboard/metrics");
}
