import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import type { AuthenticatedRequest } from "../auth/auth.types";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Permissions } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { ActiveTenant } from "../tenancy/active-tenant.decorator";
import { TenantGuard } from "../tenancy/tenant.guard";
import {
  DashboardMetricsDto,
  DashboardSearchQueryDto,
  DashboardSearchResponseDto
} from "./dashboard.schemas";
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

  @Get("search")
  @Permissions("admin:access")
  @ApiOkResponse({ type: DashboardSearchResponseDto })
  search(
    @ActiveTenant() tenantId: string,
    @Query() query: DashboardSearchQueryDto,
    @Req() request: AuthenticatedRequest
  ) {
    const tenantPermissions = getTenantPermissions(request, tenantId);

    return this.dashboardService.search(tenantId, query, {
      canReadCases: tenantPermissions.has("cases:read"),
      canReadDocuments: tenantPermissions.has("documents:read"),
      canReadExpenses: tenantPermissions.has("expenses:read"),
      canReadFinance: tenantPermissions.has("finance:read"),
      canReadHearings: tenantPermissions.has("hearings:read"),
      canReadTasks: tenantPermissions.has("tasks:read")
    });
  }
}

function getTenantPermissions(request: AuthenticatedRequest, tenantId: string) {
  return new Set(
    request.user?.tenantAccess.find((tenantAccess) => tenantAccess.tenantId === tenantId)
      ?.permissions ?? []
  );
}
