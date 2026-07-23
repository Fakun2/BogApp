import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Permissions } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { ActiveTenant } from "../tenancy/active-tenant.decorator";
import { TenantGuard } from "../tenancy/tenant.guard";
import { ForumsListResponseDto, ListForumsQueryDto } from "./forums.schemas";
import { ForumsService } from "./forums.service";

@ApiTags("forums")
@ApiBearerAuth()
@ApiSecurity("tenant")
@Controller("forums")
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Get()
  @Permissions("forums:read")
  @ApiOkResponse({ type: ForumsListResponseDto })
  list(@ActiveTenant() tenantId: string, @Query() query: ListForumsQueryDto) {
    return this.forumsService.list(tenantId, query);
  }
}
