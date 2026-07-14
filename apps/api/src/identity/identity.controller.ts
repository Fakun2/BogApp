import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Permissions } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { ActiveTenant } from "../tenancy/active-tenant.decorator";
import { TenantGuard } from "../tenancy/tenant.guard";

@ApiTags("identity")
@ApiBearerAuth()
@ApiSecurity("tenant")
@Controller("identity")
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class IdentityController {
  @Get("me")
  @Permissions("admin:access")
  me(@ActiveTenant() tenantId: string) {
    return {
      tenantId,
      status: "authenticated"
    };
  }

  @Get("roles")
  @Permissions("admin:access")
  roles() {
    return {
      roles: ["owner", "admin", "lawyer", "paralegal", "accounting", "viewer"]
    };
  }
}
