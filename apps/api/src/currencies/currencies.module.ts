import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { CurrenciesController } from "./currencies.controller";
import { CurrenciesService } from "./currencies.service";

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [CurrenciesController],
  providers: [CurrenciesService]
})
export class CurrenciesModule {}
