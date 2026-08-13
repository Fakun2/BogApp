import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { AppModule } from "./app.module";
import { setupOpenApi } from "./openapi.setup";
import { createCorsOptions } from "./security/cors.config";
import { createGlobalRateLimitMiddleware } from "./security/rate-limit.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors(createCorsOptions());
  app.use(createGlobalRateLimitMiddleware());
  app.useGlobalPipes(new ZodValidationPipe());

  setupOpenApi(app);

  const port = Number(process.env.API_PORT ?? 3001);
  const host = process.env.API_HOST ?? "0.0.0.0";

  await app.listen(port, host);
}

void bootstrap();
