import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtSignOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { DatabaseModule } from "../database/database.module";
import { RbacModule } from "../rbac/rbac.module";
import { PermissionsGuard } from "./permissions.guard";
import { RolesGuard } from "./roles.guard";

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    RbacModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_ACCESS_SECRET") ?? "dev-access-secret-change-me",
        signOptions: {
          expiresIn: (config.get<string>("JWT_ACCESS_TTL") ?? "15m") as JwtSignOptions["expiresIn"]
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, PermissionsGuard],
  exports: [AuthService, RolesGuard, PermissionsGuard]
})
export class AuthModule {}
