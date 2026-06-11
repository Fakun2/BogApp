import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { ActiveTenant } from "../tenancy/active-tenant.decorator";
import { TenantGuard } from "../tenancy/tenant.guard";

@ApiTags("identity")
@ApiBearerAuth()
@ApiSecurity("tenant")
@Controller("identity")
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class IdentityController {
  @Get("me")
  @Roles("owner", "admin", "lawyer", "paralegal", "accounting", "viewer")
  me(@ActiveTenant() tenantId: string) {
    return {
      tenantId,
      status: "authenticated"
    };
  }

  @Get("roles")
  @Roles("owner", "admin")
  roles() {
    return {
      roles: ["owner", "admin", "lawyer", "paralegal", "accounting", "viewer"]
    };
  }
}
