import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Permissions } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { ActiveTenant } from "../tenancy/active-tenant.decorator";
import { TenantGuard } from "../tenancy/tenant.guard";
import {
  ClientDeleteResponseDto,
  ClientDetailDto,
  ClientDto,
  ClientsListResponseDto,
  CreateClientDto,
  ListClientsQueryDto,
  UpdateClientDto
} from "./clients.schemas";
import { ClientsService } from "./clients.service";

@ApiTags("clients")
@ApiBearerAuth()
@ApiSecurity("tenant")
@Controller("clients")
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Permissions("clients:read")
  @ApiOkResponse({ type: ClientsListResponseDto })
  list(@ActiveTenant() tenantId: string, @Query() query: ListClientsQueryDto) {
    return this.clientsService.list(tenantId, query);
  }

  @Post()
  @Permissions("clients:create")
  @ApiCreatedResponse({ type: ClientDto })
  create(@ActiveTenant() tenantId: string, @Body() input: CreateClientDto) {
    return this.clientsService.create(tenantId, input);
  }

  @Get(":id")
  @Permissions("clients:read")
  @ApiOkResponse({ type: ClientDetailDto })
  getDetail(@ActiveTenant() tenantId: string, @Param("id") clientId: string) {
    return this.clientsService.getDetail(tenantId, clientId);
  }

  @Patch(":id")
  @Permissions("clients:update")
  @ApiOkResponse({ type: ClientDto })
  update(
    @ActiveTenant() tenantId: string,
    @Param("id") clientId: string,
    @Body() input: UpdateClientDto
  ) {
    return this.clientsService.update(tenantId, clientId, input);
  }

  @Delete(":id")
  @Permissions("clients:delete")
  @ApiOkResponse({ type: ClientDeleteResponseDto })
  archive(@ActiveTenant() tenantId: string, @Param("id") clientId: string) {
    return this.clientsService.archive(tenantId, clientId);
  }
}
