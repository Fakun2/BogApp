import { Module } from "@nestjs/common";
import { ObjectStorageService } from "./object-storage.service";
import { StorageStrategyFactory } from "./storage-strategy.factory";

@Module({
  providers: [ObjectStorageService, StorageStrategyFactory],
  exports: [ObjectStorageService]
})
export class StorageModule {}
