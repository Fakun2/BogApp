import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PermissionsGuard } from "../auth/permissions.guard";
import { DatabaseModule } from "../database/database.module";
import { TenancyModule } from "../tenancy/tenancy.module";
import { ForumsController } from "./forums.controller";
import { ForumsService } from "./forums.service";

@Module({
  imports: [AuthModule, DatabaseModule, TenancyModule],
  controllers: [ForumsController],
  providers: [ForumsService, PermissionsGuard]
})
export class ForumsModule {}
