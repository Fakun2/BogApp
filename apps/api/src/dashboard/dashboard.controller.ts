import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Permissions } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { ActiveTenant } from "../tenancy/active-tenant.decorator";
import { TenantGuard } from "../tenancy/tenant.guard";
import { DashboardMetricsDto } from "./dashboard.schemas";
import { DashboardService } from "./dashboard.service";

@ApiTags("dashboard")
@ApiBearerAuth()
@ApiSecurity("tenant")
@Controller("dashboard")
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("metrics")
  @Permissions("admin:access")
  @ApiOkResponse({ type: DashboardMetricsDto })
  getMetrics(@ActiveTenant() tenantId: string) {
    return this.dashboardService.getMetrics(tenantId);
  }
}
