export const ADMIN_ACCESS_PERMISSION = "admin:access";

export const RBAC_PERMISSIONS = [
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
  { code: "roles:modify", resource: "roles", action: "modify" },
  { code: "roles:eliminate", resource: "roles", action: "eliminate" },
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
  { code: "finance:write", resource: "finance", action: "write" },
  { code: "billing:manage", resource: "billing", action: "manage" }
] as const;

export const RBAC_ROLES = [
  {
    code: "owner",
    name: "Owner",
    description: "Tiene control completo del estudio, permisos, facturacion y administracion.",
    permissions: RBAC_PERMISSIONS.map((permission) => permission.code)
  },
  {
    code: "admin",
    name: "Admin",
    description: "Administra el estudio, equipo, roles y configuracion operativa.",
    permissions: RBAC_PERMISSIONS.filter(
      (permission) => permission.code !== "billing:manage" && permission.resource !== "roles"
    ).map((permission) => permission.code)
  },
  {
    code: "lawyer",
    name: "Abogado",
    description: "Gestiona clientes, expedientes, documentos, tareas y seguimiento legal.",
    permissions: [
      ADMIN_ACCESS_PERMISSION,
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
    code: "paralegal",
    name: "Paralegal",
    description: "Colabora en expedientes, documentos y tareas sin administrar permisos.",
    permissions: [
      ADMIN_ACCESS_PERMISSION,
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
    code: "accounting",
    name: "Contabilidad",
    description: "Accede a clientes, expedientes y gestion financiera del estudio.",
    permissions: [
      ADMIN_ACCESS_PERMISSION,
      "clients:read",
      "cases:read",
      "finance:read",
      "finance:create",
      "finance:update",
      "finance:delete",
      "finance:write"
    ]
  },
  {
    code: "viewer",
    name: "Lectura",
    description: "Consulta informacion del estudio sin modificar datos operativos.",
    permissions: [
      ADMIN_ACCESS_PERMISSION,
      "clients:read",
      "cases:read",
      "documents:read",
      "tasks:read",
      "finance:read"
    ]
  }
] as const;

export type PermissionCode = (typeof RBAC_PERMISSIONS)[number]["code"];
export type RoleCode = (typeof RBAC_ROLES)[number]["code"];
