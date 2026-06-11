import { Module } from "@nestjs/common";
import { RolesGuard } from "../auth/roles.guard";
import { TenancyModule } from "../tenancy/tenancy.module";
import { RbacController } from "./rbac.controller";
import { RbacService } from "./rbac.service";

@Module({
  imports: [TenancyModule],
  controllers: [RbacController],
  providers: [RbacService, RolesGuard],
  exports: [RbacService]
})
export class RbacModule {}
