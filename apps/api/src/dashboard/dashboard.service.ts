import { Injectable } from "@nestjs/common";
import type { DashboardSearchQuery } from "./dashboard.schemas";
import { DashboardMetricsUseCase } from "./use-cases/dashboard-metrics.use-case";
import {
  DashboardSearchUseCase,
  type DashboardSearchPermissions
} from "./use-cases/dashboard-search.use-case";

@Injectable()
export class DashboardService {
  constructor(
    private readonly metricsUseCase: DashboardMetricsUseCase,
    private readonly searchUseCase: DashboardSearchUseCase
  ) {}

  getMetrics(tenantId: string) {
    return this.metricsUseCase.execute(tenantId);
  }

  search(tenantId: string, query: DashboardSearchQuery, permissions: DashboardSearchPermissions) {
    return this.searchUseCase.execute(tenantId, query, permissions);
  }
}
