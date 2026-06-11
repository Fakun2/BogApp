import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
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
  @ApiCreatedResponse({ type: StartOnboardingResponseDto })
  start(@Body() input: StartOnboardingDto) {
    return this.onboardingService.start(input);
  }

  @Get("status")
  @ApiBearerAuth()
  @ApiSecurity("tenant")
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles("owner", "admin")
  @ApiOkResponse({ type: OnboardingStatusDto })
  status(@ActiveTenant() tenantId: string) {
    return this.onboardingService.status(tenantId);
  }
}
