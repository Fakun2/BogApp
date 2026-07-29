import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { JudicialCentersController } from "./judicial-centers.controller";
import { JudicialCentersService } from "./judicial-centers.service";

@Module({
  imports: [DatabaseModule],
  controllers: [JudicialCentersController],
  providers: [JudicialCentersService]
})
export class JudicialCentersModule {}
