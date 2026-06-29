import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { PracticeAreaTemplatesController } from "./practice-area-templates.controller";
import { PracticeAreaTemplatesService } from "./practice-area-templates.service";

@Module({
  imports: [DatabaseModule],
  controllers: [PracticeAreaTemplatesController],
  providers: [PracticeAreaTemplatesService],
  exports: [PracticeAreaTemplatesService]
})
export class PracticeAreaTemplatesModule {}
