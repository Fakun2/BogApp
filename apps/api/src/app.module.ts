import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { IdentityModule } from "./identity/identity.module";
import { OnboardingModule } from "./onboarding/onboarding.module";
import { PracticeAreaTemplatesModule } from "./practice-area-templates/practice-area-templates.module";
import { RedisModule } from "./redis/redis.module";
import { RbacModule } from "./rbac/rbac.module";
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
    OnboardingModule,
    IdentityModule,
    HealthModule
  ]
})
export class AppModule {}
