import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
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
import { CreateRoleDto, PermissionDto, RoleDto, UpdateRoleDto } from "./rbac.schemas";
import { RbacService } from "./rbac.service";

@ApiTags("rbac")
@ApiBearerAuth()
@ApiSecurity("tenant")
@Controller("rbac")
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get("permissions")
  @Permissions("roles:read")
  @ApiOkResponse({ type: [PermissionDto] })
  permissions() {
    return this.rbacService.listPermissions();
  }

  @Get("roles")
  @Permissions("roles:read")
  @ApiOkResponse({ type: [RoleDto] })
  roles(@ActiveTenant() tenantId: string) {
    return this.rbacService.listRoles(tenantId);
  }

  @Post("roles")
  @Permissions("roles:create")
  @ApiCreatedResponse({ type: RoleDto })
  createRole(@ActiveTenant() tenantId: string, @Body() input: CreateRoleDto) {
    return this.rbacService.createRole(tenantId, input);
  }

  @Patch("roles/:id")
  @Permissions("roles:modify")
  @ApiOkResponse({ type: RoleDto })
  updateRole(
    @ActiveTenant() tenantId: string,
    @Param("id") roleId: string,
    @Body() input: UpdateRoleDto
  ) {
    return this.rbacService.updateRole(tenantId, roleId, input);
  }

  @Delete("roles/:id")
  @Permissions("roles:eliminate")
  deleteRole(@ActiveTenant() tenantId: string, @Param("id") roleId: string) {
    return this.rbacService.deleteRole(tenantId, roleId);
  }
}
