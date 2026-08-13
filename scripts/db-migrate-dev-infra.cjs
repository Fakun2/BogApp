const { spawnSync } = require("node:child_process");
const { existsSync } = require("node:fs");
const { resolve } = require("node:path");
const dotenv = require("dotenv");

const repoRoot = resolve(__dirname, "..");
const localEnvPath = resolve(repoRoot, ".env.local");

if (!existsSync(localEnvPath)) {
  fail("No se encontro .env.local. Crea uno para usar la DB de docker:dev:infra.");
}

dotenv.config({ path: localEnvPath, override: true });

process.env.DATABASE_URL = buildDevInfraDatabaseUrl();

waitForPostgres();

run("npx", [
  "prisma",
  "migrate",
  "deploy",
  "--schema",
  "packages/database/prisma/schema.prisma"
]);

run("npx", [
  "prisma",
  "generate",
  "--schema",
  "packages/database/prisma/schema.prisma"
]);

function buildDevInfraDatabaseUrl() {
  const user = process.env.POSTGRES_USER || "postgres";
  const password = process.env.POSTGRES_PASSWORD || "postgres";
  const database = process.env.POSTGRES_DB || "bogaap";
  const port = process.env.POSTGRES_PORT || "5432";

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@localhost:${port}/${encodeURIComponent(database)}?schema=public`;
}

function waitForPostgres() {
  const maxAttempts = 30;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = runQuietNode(`
      const { PrismaClient } = require("@prisma/client");
      const prisma = new PrismaClient();
      prisma.$queryRawUnsafe("SELECT 1")
        .then(() => process.exit(0))
        .catch(() => process.exit(1))
        .finally(async () => prisma.$disconnect());
    `);

    if (result) {
      return;
    }

    sleep(2000);
  }

  fail("Postgres de docker:dev:infra no respondio a tiempo.");
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    env: process.env,
    shell: process.platform === "win32",
    stdio: "inherit"
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function sleep(milliseconds) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

function runQuietNode(script) {
  const result = spawnSync(process.execPath, ["-e", script], {
    cwd: repoRoot,
    env: process.env,
    stdio: ["ignore", "ignore", "ignore"]
  });

  return result.status === 0;
}
