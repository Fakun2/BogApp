import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { RolesGuard } from "../auth/roles.guard";
import { RbacModule } from "../rbac/rbac.module";
import { TenancyModule } from "../tenancy/tenancy.module";
import { OnboardingController } from "./onboarding.controller";
import { OnboardingService } from "./onboarding.service";

@Module({
  imports: [AuthModule, RbacModule, TenancyModule],
  controllers: [OnboardingController],
  providers: [OnboardingService, RolesGuard]
})
export class OnboardingModule {}
