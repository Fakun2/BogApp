import "reflect-metadata";
import { writeFile } from "node:fs/promises";
import { NestFactory } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { AppModule } from "./app.module";
import { createOpenApiDocument } from "./openapi.setup";

async function generateOpenApi() {
  const app = await NestFactory.create(AppModule, {
    logger: false
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ZodValidationPipe());

  const document = createOpenApiDocument(app);
  await writeFile("openapi.json", JSON.stringify(document, null, 2));
  await app.close();
}

void generateOpenApi();
