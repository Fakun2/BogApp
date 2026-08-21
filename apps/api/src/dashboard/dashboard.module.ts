import { Module } from "@nestjs/common";
import { PermissionsGuard } from "../auth/permissions.guard";
import { DatabaseModule } from "../database/database.module";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { DashboardMetricsUseCase } from "./use-cases/dashboard-metrics.use-case";
import { DashboardSearchUseCase } from "./use-cases/dashboard-search.use-case";

@Module({
  imports: [DatabaseModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardMetricsUseCase, DashboardSearchUseCase, PermissionsGuard]
})
export class DashboardModule {}
