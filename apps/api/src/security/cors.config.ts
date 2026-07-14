import type { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

const openCorsOptions: CorsOptions = {
  origin: true,
  credentials: true
};

export function createCorsOptions(): CorsOptions {
  const corsMode = process.env.API_CORS_MODE;
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const strictCors = corsMode === "strict" || (nodeEnv === "production" && corsMode !== "open");

  if (!strictCors) {
    return openCorsOptions;
  }

  const allowedOrigins = getAllowedOrigins();

  return {
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"), false);
    }
  };
}

function getAllowedOrigins() {
  const origins = [
    process.env.FRONTEND_PUBLIC_URL,
    process.env.WEB_PUBLIC_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.API_CORS_ALLOWED_ORIGINS
  ]
    .flatMap((value) => value?.split(",") ?? [])
    .map((value) => value.trim())
    .filter(Boolean);

  return new Set(origins);
}
