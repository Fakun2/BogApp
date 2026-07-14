import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TenancyModule } from "../tenancy/tenancy.module";
import { IdentityController } from "./identity.controller";

@Module({
  imports: [AuthModule, TenancyModule],
  controllers: [IdentityController]
})
export class IdentityModule {}
