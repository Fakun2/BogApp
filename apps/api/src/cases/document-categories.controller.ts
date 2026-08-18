import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Permissions } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { ActiveTenant } from "../tenancy/active-tenant.decorator";
import { TenantGuard } from "../tenancy/tenant.guard";
import { DocumentCategoriesListResponseDto, ListDocumentCategoriesQueryDto } from "./cases.schemas";
import { CasesService } from "./cases.service";

@ApiTags("document-categories")
@ApiBearerAuth()
@ApiSecurity("tenant")
@Controller("document-categories")
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class DocumentCategoriesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  @Permissions("documents:read")
  @ApiOkResponse({ type: DocumentCategoriesListResponseDto })
  list(@ActiveTenant() tenantId: string, @Query() query: ListDocumentCategoriesQueryDto) {
    return this.casesService.listDocumentCategories(tenantId, query);
  }
}
