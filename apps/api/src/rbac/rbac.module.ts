import { Module } from "@nestjs/common";
import { PermissionsGuard } from "../auth/permissions.guard";
import { DatabaseModule } from "../database/database.module";
import { TenancyModule } from "../tenancy/tenancy.module";
import { RbacController } from "./rbac.controller";
import { RoleEventsService } from "./role-events";
import { RbacService } from "./rbac.service";

@Module({
  imports: [DatabaseModule, TenancyModule],
  controllers: [RbacController],
  providers: [RbacService, PermissionsGuard, RoleEventsService],
  exports: [RbacService]
})
export class RbacModule {}
