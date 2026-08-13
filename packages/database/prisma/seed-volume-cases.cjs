const { loadRootEnv } = require("./load-root-env.cjs");

loadRootEnv();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const defaultUserEmail = "ejemplo@gmail.com";
const defaultCaseCount = 75000;
const volumeCasePrefix = "VOLUME-EXP";
const volumeCaseMarker = "[VOLUME_TEST]";
const batchSize = 250;

async function seedVolumeCases() {
  const userEmail = process.env.VOLUME_CASES_USER_EMAIL ?? defaultUserEmail;
  const caseCount = parsePositiveInteger(process.env.VOLUME_CASES_COUNT, defaultCaseCount);
  const tenant = await resolveTenantByUserEmail(userEmail);
  const catalogContexts = await resolveCatalogContexts();
  const membership = await resolveResponsibleMembership(tenant.id, userEmail);
  const practiceAreas = await resolvePracticeAreas(tenant.id);
  const existingCount = await prisma.case.count({
    where: {
      caseNumber: { startsWith: volumeCasePrefix },
      tenantId: tenant.id
    }
  });

  let insertedCount = 0;

  for (let offset = 0; offset < caseCount; offset += batchSize) {
    const currentBatchSize = Math.min(batchSize, caseCount - offset);
    const result = await prisma.case.createMany({
      data: Array.from({ length: currentBatchSize }, (_, index) =>
        buildVolumeCase({
          catalogContext: pickByIndex(catalogContexts, offset + index),
          index: offset + index + 1,
          practiceAreaId: pickByIndex(practiceAreas, offset + index)?.id ?? null,
          responsibleMembershipId: membership?.id ?? null,
          tenantId: tenant.id
        })
      ),
      skipDuplicates: true
    });

    insertedCount += result.count;
    process.stdout.write(".");
  }

  const finalCount = await prisma.case.count({
    where: {
      caseNumber: { startsWith: volumeCasePrefix },
      tenantId: tenant.id
    }
  });

  console.log("");
  console.log("Volume cases seed completed.");
  console.log(`User: ${userEmail}`);
  console.log(`Tenant: ${tenant.name} (${tenant.id})`);
  console.log(`Existing before: ${existingCount}`);
  console.log(`Inserted: ${insertedCount}`);
  console.log(`Total volume cases: ${finalCount}`);
  console.log(`Catalog combinations used: ${catalogContexts.length}`);
  console.log(`Practice areas used: ${practiceAreas.length}`);
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

async function resolveResponsibleMembership(tenantId, userEmail) {
  return prisma.tenantMembership.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
    where: {
      status: "active",
      tenantId,
      user: { email: userEmail, status: "active" }
    }
  });
}

async function resolvePracticeAreas(tenantId) {
  return prisma.practiceArea.findMany({
    orderBy: { name: "asc" },
    select: { id: true },
    where: { active: true, tenantId }
  });
}

async function resolveCatalogContexts() {
  const provinces = await prisma.province.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    select: {
      forumTemplates: {
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          judicialCenterForums: {
            orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
            select: { id: true },
            where: {
              active: true,
              judicialCenter: { active: true }
            }
          }
        },
        where: { active: true }
      },
      id: true,
      name: true
    },
    where: { active: true }
  });

  if (provinces.length === 0) {
    throw new Error("No hay provincias activas. Ejecuta npm run db:seed:legal-catalogs.");
  }

  const contexts = [];
  for (const province of provinces) {
    for (const forumTemplate of province.forumTemplates) {
      if (forumTemplate.judicialCenterForums.length > 0) {
        for (const judicialCenterForum of forumTemplate.judicialCenterForums) {
          contexts.push({
            forumTemplateId: forumTemplate.id,
            judicialCenterForumId: judicialCenterForum.id,
            provinceId: province.id,
            provinceName: province.name
          });
        }
      } else {
        contexts.push({
          forumTemplateId: forumTemplate.id,
          judicialCenterForumId: null,
          provinceId: province.id,
          provinceName: province.name
        });
      }
    }
  }

  if (contexts.length === 0) {
    throw new Error("No hay fueros activos. Ejecuta npm run db:seed:legal-catalogs.");
  }

  return contexts;
}

function buildVolumeCase({
  catalogContext,
  index,
  practiceAreaId,
  responsibleMembershipId,
  tenantId
}) {
  const paddedIndex = String(index).padStart(5, "0");
  const filingMonth = (index % 12) + 1;
  const filingDay = (index % 27) + 1;
  const instance = ["first", "second", "third"][index % 3];
  const status = ["open", "paused", "closed"][Math.floor(index / 3) % 3];

  return {
    caption: `Caso de volumen ${paddedIndex} ${catalogContext.provinceName} c/ Demandado ${paddedIndex}`,
    caseNumber: `${volumeCasePrefix}-${paddedIndex}/2026`,
    court: `Juzgado de prueba ${((index - 1) % 36) + 1}`,
    description: `${volumeCaseMarker} Expediente generado para probar paginacion y performance.`,
    filingDate: new Date(
      `2026-${String(filingMonth).padStart(2, "0")}-${String(filingDay).padStart(2, "0")}T00:00:00.000Z`
    ),
    forumTemplateId: catalogContext.forumTemplateId,
    instance,
    judicialCenterForumId: catalogContext.judicialCenterForumId,
    judicialCenterText: catalogContext.judicialCenterForumId
      ? null
      : `Centro judicial de prueba ${catalogContext.provinceName}`,
    practiceAreaId,
    provinceId: catalogContext.provinceId,
    responsibleMembershipId,
    status,
    subject: `${volumeCaseMarker} Prueba de volumen ${paddedIndex} ${instance} ${status}`,
    tenantId
  };
}

function pickByIndex(items, index) {
  if (items.length === 0) {
    return null;
  }

  return items[index % items.length];
}

function parsePositiveInteger(value, fallback) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`VOLUME_CASES_COUNT debe ser un entero positivo. Valor recibido: ${value}`);
  }

  return parsed;
}

seedVolumeCases()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
