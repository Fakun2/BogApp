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

export function getRetryAfterSeconds(resetAt: number, now: number) {
  return Math.max(1, Math.ceil((resetAt - now) / 1000));
}

export function formatRateLimitWindow(windowMs: number) {
  if (windowMs % 60_000 === 0) {
    const minutes = windowMs / 60_000;
    return minutes === 1 ? "minuto" : `${minutes} minutos`;
  }

  if (windowMs % 1000 === 0) {
    const seconds = windowMs / 1000;
    return seconds === 1 ? "segundo" : `${seconds} segundos`;
  }

  return `${windowMs} ms`;
}
