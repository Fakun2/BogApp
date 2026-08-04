const { resolve } = require("node:path");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const repoRoot = resolve(__dirname, "..");
dotenv.config({ path: resolve(repoRoot, ".env") });
dotenv.config({ path: resolve(repoRoot, ".env.local"), override: true });

if (!process.env.DATABASE_URL) {
  fail("DATABASE_URL no esta configurada. No se ejecuto ANALYZE.");
}

const prisma = new PrismaClient();

main()
  .catch((error) => {
    fail(error.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function main() {
  const startedAt = Date.now();
  await prisma.$executeRawUnsafe("ANALYZE");
  const [{ table_count: tableCount }] = await prisma.$queryRawUnsafe(`
    SELECT count(*)::int AS table_count
    FROM pg_stat_user_tables;
  `);

  console.log(
    [
      "ANALYZE ejecutado correctamente.",
      `Tablas analizadas: ${tableCount}.`,
      `Duracion: ${Date.now() - startedAt} ms.`,
      "DATABASE_URL no fue impresa."
    ].join("\n")
  );
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
