import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Permissions } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { TenantGuard } from "../tenancy/tenant.guard";
import {
  JudicialCentersListResponseDto,
  ListJudicialCentersQueryDto
} from "./judicial-centers.schemas";
import { JudicialCentersService } from "./judicial-centers.service";

@ApiTags("judicial-centers")
@ApiBearerAuth()
@ApiSecurity("tenant")
@Controller("judicial-centers")
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class JudicialCentersController {
  constructor(private readonly judicialCentersService: JudicialCentersService) {}

  @Get()
  @Permissions("forums:read")
  @ApiOkResponse({ type: JudicialCentersListResponseDto })
  list(@Query() query: ListJudicialCentersQueryDto) {
    return this.judicialCentersService.listActive(query);
  }
}
