const { loadRootEnv } = require("./load-root-env.cjs");

loadRootEnv();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const defaultUserEmail = "ejemplo@gmail.com";
const volumeCasePrefix = "VOLUME-EXP";
const volumeCaseMarker = "[VOLUME_TEST]";

async function clearVolumeCases() {
  const userEmail = process.env.VOLUME_CASES_USER_EMAIL ?? defaultUserEmail;
  const tenant = await resolveTenantByUserEmail(userEmail);
  const where = {
    OR: [
      { caseNumber: { startsWith: volumeCasePrefix } },
      { description: { contains: volumeCaseMarker } },
      { subject: { contains: volumeCaseMarker } }
    ],
    tenantId: tenant.id
  };
  const existingCount = await prisma.case.count({ where });
  const result = await prisma.case.deleteMany({ where });

  console.log("Volume cases clear completed.");
  console.log(`User: ${userEmail}`);
  console.log(`Tenant: ${tenant.name} (${tenant.id})`);
  console.log(`Matched before: ${existingCount}`);
  console.log(`Deleted: ${result.count}`);
}

async function resolveTenantByUserEmail(userEmail) {
  const membership = await prisma.tenantMembership.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      tenant: {
        select: {
          id: true,
          name: true
        }
      }
    },
    where: {
      status: "active",
      tenant: { status: "active" },
      user: {
        email: userEmail,
        status: "active"
      }
    }
  });

  if (!membership?.tenant) {
    throw new Error(
      `No se encontro un tenant activo para ${userEmail}. Ajusta VOLUME_CASES_USER_EMAIL.`
    );
  }

  return membership.tenant;
}

clearVolumeCases()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
