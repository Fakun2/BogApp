import { Module } from "@nestjs/common";
import { PermissionsGuard } from "../auth/permissions.guard";
import { DatabaseModule } from "../database/database.module";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
  imports: [DatabaseModule],
  controllers: [DashboardController],
  providers: [DashboardService, PermissionsGuard]
})
export class DashboardModule {}
