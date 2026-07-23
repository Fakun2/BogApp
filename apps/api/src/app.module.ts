import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { IdentityModule } from "./identity/identity.module";
import { ForumsModule } from "./forums/forums.module";
import { OnboardingModule } from "./onboarding/onboarding.module";
import { PracticeAreaTemplatesModule } from "./practice-area-templates/practice-area-templates.module";
import { ProvincesModule } from "./provinces/provinces.module";
import { RedisModule } from "./redis/redis.module";
import { RbacModule } from "./rbac/rbac.module";
import { StaffModule } from "./staff/staff.module";
import { TenancyModule } from "./tenancy/tenancy.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env", "../../.env"],
      isGlobal: true
    }),
    DatabaseModule,
    RedisModule,
    AuthModule,
    TenancyModule,
    RbacModule,
    PracticeAreaTemplatesModule,
    ProvincesModule,
    OnboardingModule,
    IdentityModule,
    ForumsModule,
    StaffModule,
    HealthModule
  ]
})
export class AppModule {}
