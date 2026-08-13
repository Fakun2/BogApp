const { loadRootEnv } = require("./load-root-env.cjs");

loadRootEnv();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const practiceAreaTemplates = [
  { code: "derecho-civil", name: "Derecho Civil", displayOrder: 10 },
  { code: "derecho-familia", name: "Derecho de Familia", displayOrder: 20 },
  { code: "derecho-sucesorio", name: "Derecho Sucesorio", displayOrder: 30 },
  {
    code: "derecho-comercial-societario",
    name: "Derecho Comercial y Societario",
    displayOrder: 40
  },
  { code: "derecho-laboral", name: "Derecho Laboral", displayOrder: 50 },
  { code: "derecho-penal", name: "Derecho Penal", displayOrder: 60 },
  { code: "derecho-administrativo", name: "Derecho Administrativo", displayOrder: 70 },
  { code: "derecho-tributario", name: "Derecho Tributario", displayOrder: 80 },
  { code: "derecho-concursal", name: "Derecho Concursal", displayOrder: 90 },
  {
    code: "mediacion-metodos-alternativos-resolucion-conflictos",
    name: "Mediacion y Metodos Alternativos de Resolucion de Conflictos",
    displayOrder: 100
  },
  {
    code: "derecho-notarial-escribania",
    name: "Derecho Notarial - Escribania",
    displayOrder: 110
  }
];

async function seedPracticeAreaTemplates() {
  await prisma.$transaction(async (tx) => {
    for (const template of practiceAreaTemplates) {
      await tx.practiceAreaTemplate.upsert({
        where: { code: template.code },
        update: {
          active: true,
          displayOrder: template.displayOrder,
          name: template.name
        },
        create: {
          active: true,
          ...template
        }
      });
    }

    await tx.practiceAreaTemplate.updateMany({
      where: {
        code: { notIn: practiceAreaTemplates.map((template) => template.code) }
      },
      data: { active: false }
    });
  });
}

seedPracticeAreaTemplates()
  .then(() => {
    console.log("Practice area template seed completed.");
  })
  .catch((error) => {
    console.error("Practice area template seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
