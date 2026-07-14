import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PermissionsGuard } from "../auth/permissions.guard";
import { RbacModule } from "../rbac/rbac.module";
import { TenancyModule } from "../tenancy/tenancy.module";
import { OnboardingController } from "./onboarding.controller";
import { OnboardingService } from "./onboarding.service";

@Module({
  imports: [AuthModule, RbacModule, TenancyModule],
  controllers: [OnboardingController],
  providers: [OnboardingService, PermissionsGuard]
})
export class OnboardingModule {}
