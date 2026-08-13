const { loadRootEnv } = require("./load-root-env.cjs");

loadRootEnv();

const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

const moreiraUserEmail = process.env.MOREIRA_USER_EMAIL ?? "ejemplo@gmail.com";
const moreiraUserFullName = process.env.MOREIRA_USER_FULL_NAME ?? "Usuario Moreira";
const moreiraTenantName = process.env.MOREIRA_TENANT_NAME ?? "Estudio Moreira";
const moreiraTenantLegalName = process.env.MOREIRA_TENANT_LEGAL_NAME ?? "Estudio Juridico Moreira";
const moreiraTenantTaxId = process.env.MOREIRA_TENANT_TAX_ID ?? "20999999992";
const moreiraUserPassword = process.env.MOREIRA_USER_PASSWORD ?? "Demo123456!";
const preferredPracticeAreaCodes = ["derecho-civil", "derecho-laboral", "derecho-familia"];

async function seedMoreiraTenant() {
  const result = await prisma.$transaction(async (tx) => {
    await tx.currency.upsert({
      where: { code: "ARS" },
      update: { active: true, name: "Peso argentino", symbol: "$" },
      create: { active: true, code: "ARS", name: "Peso argentino", symbol: "$" }
    });

    const ownerRole = await tx.role.findUnique({
      where: { code: "owner" },
      select: { id: true }
    });

    if (!ownerRole) {
      throw new Error("Falta el rol owner. Ejecuta npm run db:seed:rbac antes de este seed.");
    }

    const { created: userCreated, user } = await ensureUser(tx);
    const { created: tenantCreated, tenant } = await ensureTenant(tx, user.id);

    await ensureTenantProfile(tx, tenant.id);
    await ensureTenantSettings(tx, tenant.id);
    const practiceAreas = await ensurePracticeAreas(tx, tenant.id);

    await tx.tenantMembership.upsert({
      where: {
        tenantId_userId: {
          tenantId: tenant.id,
          userId: user.id
        }
      },
      update: {
        invitedAt: null,
        joinedAt: new Date(),
        roleId: ownerRole.id,
        status: "active"
      },
      create: {
        joinedAt: new Date(),
        roleId: ownerRole.id,
        status: "active",
        tenantId: tenant.id,
        userId: user.id
      }
    });

    return {
      practiceAreaCount: practiceAreas.length,
      tenant,
      tenantCreated,
      user,
      userCreated
    };
  });

  console.log("Seed Estudio Moreira completado.");
  console.log(`Tenant: ${result.tenant.name} (${result.tenant.id})`);
  console.log(`Usuario owner: ${result.user.email} (${result.user.id})`);
  console.log(`Usuario creado: ${result.userCreated ? "si" : "no"}`);
  console.log(`Tenant creado: ${result.tenantCreated ? "si" : "no"}`);
  console.log(`Areas de practica activas: ${result.practiceAreaCount}`);
  if (result.userCreated && !process.env.MOREIRA_USER_PASSWORD) {
    console.log(
      "Password inicial tomada del default local. Usa MOREIRA_USER_PASSWORD para sobreescribirla."
    );
  }
}

async function ensureUser(tx) {
  const existingUser = await tx.user.findUnique({
    where: { email: moreiraUserEmail },
    select: { email: true, id: true }
  });

  if (existingUser) {
    return { created: false, user: existingUser };
  }

  const passwordHash = await hash(moreiraUserPassword, 12);
  const user = await tx.user.create({
    data: {
      dni: process.env.MOREIRA_USER_DNI || null,
      email: moreiraUserEmail,
      emailVerifiedAt: new Date(),
      fullName: moreiraUserFullName,
      passwordHash,
      phone: process.env.MOREIRA_USER_PHONE || null,
      status: "active"
    },
    select: { email: true, id: true }
  });

  return { created: true, user };
}

async function ensureTenant(tx, userId) {
  const tenantFromUser = await tx.tenant.findFirst({
    where: {
      memberships: {
        some: { userId }
      },
      OR: [
        { name: { contains: "Moreira", mode: "insensitive" } },
        { legalName: { contains: "Moreira", mode: "insensitive" } },
        { taxId: moreiraTenantTaxId }
      ]
    },
    select: { id: true, name: true }
  });

  if (tenantFromUser) {
    const tenant = await tx.tenant.update({
      where: { id: tenantFromUser.id },
      data: {
        legalName: moreiraTenantLegalName,
        name: moreiraTenantName,
        status: "active",
        taxId: moreiraTenantTaxId
      },
      select: { id: true, name: true }
    });

    return { created: false, tenant };
  }

  const tenant = await tx.tenant.create({
    data: {
      legalName: moreiraTenantLegalName,
      name: moreiraTenantName,
      status: "active",
      taxId: moreiraTenantTaxId
    },
    select: { id: true, name: true }
  });

  return { created: true, tenant };
}

async function ensureTenantProfile(tx, tenantId) {
  await tx.tenantProfile.upsert({
    where: { tenantId },
    update: {
      address: process.env.MOREIRA_TENANT_ADDRESS ?? "San Martin 450",
      city: process.env.MOREIRA_TENANT_CITY ?? "San Miguel de Tucuman",
      country: process.env.MOREIRA_TENANT_COUNTRY ?? "Argentina",
      mainPracticeAreas: preferredPracticeAreaCodes,
      province: process.env.MOREIRA_TENANT_PROVINCE ?? "Tucuman",
      referralSource: "seed-moreira-tenant",
      size: process.env.MOREIRA_TENANT_SIZE ?? "small",
      website: process.env.MOREIRA_TENANT_WEBSITE || null
    },
    create: {
      address: process.env.MOREIRA_TENANT_ADDRESS ?? "San Martin 450",
      city: process.env.MOREIRA_TENANT_CITY ?? "San Miguel de Tucuman",
      country: process.env.MOREIRA_TENANT_COUNTRY ?? "Argentina",
      mainPracticeAreas: preferredPracticeAreaCodes,
      province: process.env.MOREIRA_TENANT_PROVINCE ?? "Tucuman",
      referralSource: "seed-moreira-tenant",
      size: process.env.MOREIRA_TENANT_SIZE ?? "small",
      tenantId,
      website: process.env.MOREIRA_TENANT_WEBSITE || null
    }
  });
}

async function ensureTenantSettings(tx, tenantId) {
  await tx.tenantSettings.upsert({
    where: { tenantId },
    update: {
      caseNumberingMode: "manual",
      defaultCurrencyCode: "ARS",
      defaultRoleForInvites: "lawyer",
      documentStorageMode: "local",
      timezone: "America/Argentina/Buenos_Aires"
    },
    create: {
      caseNumberingMode: "manual",
      defaultCurrencyCode: "ARS",
      defaultRoleForInvites: "lawyer",
      documentStorageMode: "local",
      tenantId,
      timezone: "America/Argentina/Buenos_Aires"
    }
  });

  await tx.tenantCurrency.upsert({
    where: {
      tenantId_currencyCode: {
        currencyCode: "ARS",
        tenantId
      }
    },
    update: { active: true },
    create: {
      currencyCode: "ARS",
      tenantId
    }
  });
}

async function ensurePracticeAreas(tx, tenantId) {
  const preferredTemplates = await tx.practiceAreaTemplate.findMany({
    where: {
      active: true,
      code: { in: preferredPracticeAreaCodes }
    },
    orderBy: { displayOrder: "asc" },
    select: { description: true, id: true, name: true }
  });

  const templates =
    preferredTemplates.length > 0
      ? preferredTemplates
      : await tx.practiceAreaTemplate.findMany({
          where: { active: true },
          orderBy: { displayOrder: "asc" },
          select: { description: true, id: true, name: true },
          take: 3
        });

  if (templates.length === 0) {
    throw new Error(
      "Faltan areas de practica base. Ejecuta npm run db:seed:practice-area-templates."
    );
  }

  await tx.practiceArea.createMany({
    data: templates.map((template) => ({
      active: true,
      description: template.description,
      name: template.name,
      templateId: template.id,
      tenantId
    })),
    skipDuplicates: true
  });

  return tx.practiceArea.findMany({
    where: { active: true, tenantId },
    select: { id: true }
  });
}

seedMoreiraTenant()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
