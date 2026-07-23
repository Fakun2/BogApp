const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const adminAccessPermission = "admin:access";

const permissions = [
  { code: "admin:access", resource: "admin", action: "access" },
  { code: "staff:read", resource: "staff", action: "read" },
  { code: "staff:create", resource: "staff", action: "create" },
  { code: "staff:update", resource: "staff", action: "update" },
  { code: "staff:delete", resource: "staff", action: "delete" },
  { code: "staff:manage", resource: "staff", action: "manage" },
  { code: "tenants:manage", resource: "tenants", action: "manage" },
  { code: "users:manage", resource: "users", action: "manage" },
  { code: "roles:read", resource: "roles", action: "read" },
  { code: "roles:create", resource: "roles", action: "create" },
  { code: "roles:update", resource: "roles", action: "update" },
  { code: "roles:delete", resource: "roles", action: "delete" },
  { code: "roles:manage", resource: "roles", action: "manage" },
  { code: "clients:read", resource: "clients", action: "read" },
  { code: "clients:create", resource: "clients", action: "create" },
  { code: "clients:update", resource: "clients", action: "update" },
  { code: "clients:delete", resource: "clients", action: "delete" },
  { code: "clients:write", resource: "clients", action: "write" },
  { code: "cases:read", resource: "cases", action: "read" },
  { code: "cases:create", resource: "cases", action: "create" },
  { code: "cases:update", resource: "cases", action: "update" },
  { code: "cases:delete", resource: "cases", action: "delete" },
  { code: "cases:write", resource: "cases", action: "write" },
  { code: "forums:read", resource: "forums", action: "read" },
  { code: "provinces:read", resource: "provinces", action: "read" },
  { code: "documents:read", resource: "documents", action: "read" },
  { code: "documents:write", resource: "documents", action: "write" },
  { code: "tasks:read", resource: "tasks", action: "read" },
  { code: "tasks:create", resource: "tasks", action: "create" },
  { code: "tasks:update", resource: "tasks", action: "update" },
  { code: "tasks:delete", resource: "tasks", action: "delete" },
  { code: "tasks:write", resource: "tasks", action: "write" },
  { code: "finance:read", resource: "finance", action: "read" },
  { code: "finance:create", resource: "finance", action: "create" },
  { code: "finance:update", resource: "finance", action: "update" },
  { code: "finance:delete", resource: "finance", action: "delete" },
  { code: "billing:manage", resource: "billing", action: "manage" }
];

const allPermissionCodes = permissions.map((permission) => permission.code);

const systemRoles = [
  {
    active: true,
    code: "owner",
    description: "Tiene control completo del estudio, permisos, facturacion y administracion.",
    hierarchyLevel: 3,
    name: "Owner",
    permissions: allPermissionCodes
  },
  {
    active: true,
    code: "admin",
    description: "Administra el estudio, equipo, roles y configuracion operativa.",
    hierarchyLevel: 2,
    name: "Admin",
    permissions: allPermissionCodes.filter(
      (permissionCode) =>
        permissionCode !== "billing:manage" &&
        !permissionCode.startsWith("roles:") &&
        !permissionCode.startsWith("forums:") &&
        !permissionCode.startsWith("provinces:")
    )
  },
  {
    active: true,
    code: "lawyer",
    description: "Gestiona clientes, expedientes, documentos, tareas y seguimiento legal.",
    hierarchyLevel: 1,
    name: "Abogado",
    permissions: [
      adminAccessPermission,
      "clients:read",
      "clients:create",
      "clients:update",
      "clients:write",
      "cases:read",
      "cases:create",
      "cases:update",
      "cases:write",
      "documents:read",
      "documents:write",
      "tasks:read",
      "tasks:create",
      "tasks:update",
      "tasks:write",
      "finance:read"
    ]
  },
  {
    active: true,
    code: "paralegal",
    description: "Colabora en expedientes, documentos y tareas sin administrar permisos.",
    hierarchyLevel: 1,
    name: "Paralegal",
    permissions: [
      adminAccessPermission,
      "clients:read",
      "cases:read",
      "documents:read",
      "documents:write",
      "tasks:read",
      "tasks:create",
      "tasks:update",
      "tasks:write"
    ]
  },
  {
    active: true,
    code: "accounting",
    description: "Accede a clientes, expedientes y gestion financiera del estudio.",
    hierarchyLevel: 1,
    name: "Contabilidad",
    permissions: [
      adminAccessPermission,
      "clients:read",
      "cases:read",
      "finance:read",
      "finance:create",
      "finance:update",
      "finance:delete"
    ]
  },
  {
    active: true,
    code: "viewer",
    description: "Consulta informacion del estudio sin modificar datos operativos.",
    hierarchyLevel: 1,
    name: "Lectura",
    permissions: [
      adminAccessPermission,
      "clients:read",
      "cases:read",
      "documents:read",
      "tasks:read",
      "finance:read"
    ]
  }
];

async function seedRbac() {
  await prisma.$transaction(async (tx) => {
    for (const permission of permissions) {
      await tx.permission.upsert({
        where: { code: permission.code },
        update: {
          action: permission.action,
          resource: permission.resource
        },
        create: permission
      });
    }

    const permissionsByCode = new Map(
      (
        await tx.permission.findMany({
          where: { code: { in: allPermissionCodes } },
          select: { code: true, id: true }
        })
      ).map((permission) => [permission.code, permission.id])
    );

    for (const role of systemRoles) {
      const savedRole = await tx.role.upsert({
        where: { code: role.code },
        update: {
          active: role.active,
          description: role.description,
          hierarchyLevel: role.hierarchyLevel,
          isSystem: true,
          name: role.name,
          tenantId: null
        },
        create: {
          active: role.active,
          code: role.code,
          description: role.description,
          hierarchyLevel: role.hierarchyLevel,
          isSystem: true,
          name: role.name,
          tenantId: null
        },
        select: { id: true }
      });

      await tx.rolePermission.deleteMany({ where: { roleId: savedRole.id } });
      await tx.rolePermission.createMany({
        data: role.permissions.map((permissionCode) => {
          const permissionId = permissionsByCode.get(permissionCode);

          if (!permissionId) {
            throw new Error(`No se encontro el permiso ${permissionCode}.`);
          }

          return {
            permissionId,
            roleId: savedRole.id
          };
        }),
        skipDuplicates: true
      });
    }
  });
}

seedRbac()
  .then(() => {
    console.log("RBAC seed completed.");
  })
  .catch((error) => {
    console.error("RBAC seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
