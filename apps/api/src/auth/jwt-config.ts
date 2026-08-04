import { ConfigService } from "@nestjs/config";

type JwtConfigKey =
  | "JWT_ACCESS_SECRET"
  | "JWT_REFRESH_SECRET"
  | "JWT_ACCESS_TTL"
  | "JWT_REFRESH_TTL";

export function getRequiredJwtConfig(config: ConfigService, key: JwtConfigKey) {
  const value = config.get<string>(key);

  if (!value) {
    throw new Error(`${key} must be configured.`);
  }

  return value;
}
