import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { TenantGuard } from "../tenancy/tenant.guard";
import { PermissionDto, RoleDto } from "./rbac.schemas";
import { RbacService } from "./rbac.service";

@ApiTags("rbac")
@ApiBearerAuth()
@ApiSecurity("tenant")
@Controller("rbac")
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get("permissions")
  @Roles("owner", "admin")
  @ApiOkResponse({ type: [PermissionDto] })
  permissions() {
    return this.rbacService.listPermissions();
  }

  @Get("roles")
  @Roles("owner", "admin")
  @ApiOkResponse({ type: [RoleDto] })
  roles() {
    return this.rbacService.listRoles();
  }
}
