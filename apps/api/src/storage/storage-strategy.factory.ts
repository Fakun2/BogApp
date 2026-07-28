import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { ObjectStorageStrategy } from "./object-storage.strategy";
import { MinioStorageStrategy } from "./minio-storage.strategy";
import { R2StorageStrategy } from "./r2-storage.strategy";

type StorageDriver = "minio" | "r2";

@Injectable()
export class StorageStrategyFactory {
  constructor(private readonly config: ConfigService) {}

  create(): ObjectStorageStrategy {
    const driver = this.getDriver();
    const config = {
      accessKeyId: this.getRequired("STORAGE_ACCESS_KEY_ID"),
      bucket: this.getRequired("STORAGE_BUCKET"),
      endpoint: this.config.get<string>("STORAGE_ENDPOINT"),
      forcePathStyle: this.getForcePathStyle(driver),
      provider: driver,
      region: this.config.get<string>("STORAGE_REGION") ?? "auto",
      secretAccessKey: this.getRequired("STORAGE_SECRET_ACCESS_KEY")
    };

    return driver === "r2" ? new R2StorageStrategy(config) : new MinioStorageStrategy(config);
  }

  private getDriver(): StorageDriver {
    const configuredDriver = this.config.get<string>("STORAGE_DRIVER")?.toLowerCase();
    const nodeEnv = this.config.get<string>("NODE_ENV") ?? "development";

    if (!configuredDriver) {
      if (nodeEnv === "production") {
        throw new Error("STORAGE_DRIVER es requerido en produccion.");
      }

      return "minio";
    }

    if (configuredDriver === "r2" || configuredDriver === "minio") {
      return configuredDriver;
    }

    throw new Error("STORAGE_DRIVER debe ser r2 o minio.");
  }

  private getForcePathStyle(driver: StorageDriver) {
    const configuredValue = this.config.get<string>("STORAGE_FORCE_PATH_STYLE");
    if (configuredValue !== undefined) {
      return configuredValue.toLowerCase() === "true";
    }

    return driver === "minio";
  }

  private getRequired(key: string) {
    const value = this.config.get<string>(key);
    if (!value) {
      throw new Error(`${key} es requerido para almacenamiento.`);
    }

    return value;
  }
}
