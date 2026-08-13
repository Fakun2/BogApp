import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Permissions } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { ActiveTenant } from "../tenancy/active-tenant.decorator";
import { TenantGuard } from "../tenancy/tenant.guard";
import {
  CategoryDeleteResponseDto,
  CategoryDto,
  CategoryListResponseDto,
  CreateCategoryDto,
  ListCategoriesQueryDto,
  UpdateCategoryDto
} from "./categories.schemas";
import { CategoriesService } from "./categories.service";

@ApiTags("categories")
@ApiBearerAuth()
@ApiSecurity("tenant")
@Controller("categories")
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Permissions("categories:read")
  @ApiOkResponse({ type: CategoryListResponseDto })
  list(@ActiveTenant() tenantId: string, @Query() query: ListCategoriesQueryDto) {
    return this.categoriesService.list(tenantId, query);
  }

  @Post()
  @Permissions("categories:create")
  @ApiCreatedResponse({ type: CategoryDto })
  create(@ActiveTenant() tenantId: string, @Body() input: CreateCategoryDto) {
    return this.categoriesService.create(tenantId, input);
  }

  @Patch(":id")
  @Permissions("categories:update")
  @ApiOkResponse({ type: CategoryDto })
  update(
    @ActiveTenant() tenantId: string,
    @Param("id") categoryId: string,
    @Body() input: UpdateCategoryDto
  ) {
    return this.categoriesService.update(tenantId, categoryId, input);
  }

  @Delete(":id")
  @Permissions("categories:delete")
  @ApiOkResponse({ type: CategoryDeleteResponseDto })
  delete(@ActiveTenant() tenantId: string, @Param("id") categoryId: string) {
    return this.categoriesService.delete(tenantId, categoryId);
  }
}
