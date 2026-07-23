import { Module } from "@nestjs/common";
import { PermissionsGuard } from "../auth/permissions.guard";
import { DatabaseModule } from "../database/database.module";
import { ProvincesController } from "./provinces.controller";
import { ProvincesService } from "./provinces.service";

@Module({
  imports: [DatabaseModule],
  controllers: [ProvincesController],
  providers: [ProvincesService, PermissionsGuard]
})
export class ProvincesModule {}
