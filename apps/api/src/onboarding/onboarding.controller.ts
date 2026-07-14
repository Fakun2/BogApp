import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../auth/auth.types";
import { Permissions } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { ActiveTenant } from "../tenancy/active-tenant.decorator";
import { TenantGuard } from "../tenancy/tenant.guard";
import {
  OnboardingStatusDto,
  StartOnboardingDto,
  StartOnboardingResponseDto
} from "./onboarding.schemas";
import { OnboardingService } from "./onboarding.service";

@ApiTags("onboarding")
@Controller("onboarding")
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post("start")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: StartOnboardingResponseDto })
  start(@Req() request: AuthenticatedRequest, @Body() input: StartOnboardingDto) {
    return this.onboardingService.start(request.user!.sub, input);
  }

  @Get("status")
  @ApiBearerAuth()
  @ApiSecurity("tenant")
  @UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
  @Permissions("admin:access")
  @ApiOkResponse({ type: OnboardingStatusDto })
  status(@ActiveTenant() tenantId: string) {
    return this.onboardingService.status(tenantId);
  }
}
