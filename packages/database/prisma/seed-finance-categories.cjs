const { loadRootEnv } = require("./load-root-env.cjs");

loadRootEnv();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const globalFinanceCategories = [
  { code: "sin-categoria", kind: "both", name: "Sin categoría" },
  { code: "pago-de-cliente", kind: "income", name: "Pago de cliente" },
  { code: "anticipo-sena", kind: "income", name: "Anticipo / seña" },
  { code: "honorarios-profesionales", kind: "income", name: "Honorarios profesionales" },
  { code: "recupero-de-gastos", kind: "income", name: "Recupero de gastos" },
  { code: "tasa-de-justicia", kind: "expense", name: "Tasa de justicia" },
  { code: "gastos-judiciales", kind: "expense", name: "Gastos judiciales" },
  { code: "diligenciamientos", kind: "expense", name: "Diligenciamientos" },
  { code: "notificaciones-cedulas", kind: "expense", name: "Notificaciones y cédulas" },
  { code: "peritos-informes-tecnicos", kind: "expense", name: "Peritos / informes técnicos" },
  { code: "movilidad-viaticos", kind: "expense", name: "Movilidad y viáticos" },
  { code: "papeleria-impresiones", kind: "expense", name: "Papelería e impresiones" },
  { code: "correo-mensajeria", kind: "expense", name: "Correo / mensajería" },
  { code: "servicios-del-estudio", kind: "expense", name: "Servicios del estudio" },
  { code: "transferencia-interna", kind: "both", name: "Transferencia interna" }
];

async function seedFinanceCategories() {
  for (const category of globalFinanceCategories) {
    await prisma.globalFinanceCategory.upsert({
      where: { code: category.code },
      update: {
        active: true,
        kind: category.kind,
        name: category.name
      },
      create: {
        active: true,
        code: category.code,
        kind: category.kind,
        name: category.name
      }
    });
  }
}

seedFinanceCategories()
  .then(() => {
    console.log("Finance categories seed completed.");
  })
  .catch((error) => {
    console.error("Finance categories seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
