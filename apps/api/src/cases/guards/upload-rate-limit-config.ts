import { ConfigService } from "@nestjs/config";

export function getPositiveIntegerConfig(config: ConfigService, key: string, fallback: number) {
  const rawValue = config.get<unknown>(key);
  if (rawValue === undefined || rawValue === null) {
    return fallback;
  }

  if (typeof rawValue === "string" && rawValue.trim() === "") {
    return fallback;
  }

  const value = typeof rawValue === "number" ? rawValue : Number(rawValue);
  return Number.isSafeInteger(value) && value > 0 ? value : fallback;
}
