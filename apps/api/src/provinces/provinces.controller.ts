import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Permissions } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { TenantGuard } from "../tenancy/tenant.guard";
import { ListProvincesQueryDto, ProvincesListResponseDto } from "./provinces.schemas";
import { ProvincesService } from "./provinces.service";

@ApiTags("provinces")
@ApiBearerAuth()
@ApiSecurity("tenant")
@Controller("provinces")
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  @Get()
  @Permissions("provinces:read")
  @ApiOkResponse({ type: ProvincesListResponseDto })
  list(@Query() query: ListProvincesQueryDto) {
    return this.provincesService.listActive(query);
  }
}
