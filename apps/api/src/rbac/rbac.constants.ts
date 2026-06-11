export const RBAC_PERMISSIONS = [
  { code: "tenants:manage", resource: "tenants", action: "manage" },
  { code: "users:manage", resource: "users", action: "manage" },
  { code: "roles:manage", resource: "roles", action: "manage" },
  { code: "clients:read", resource: "clients", action: "read" },
  { code: "clients:write", resource: "clients", action: "write" },
  { code: "cases:read", resource: "cases", action: "read" },
  { code: "cases:write", resource: "cases", action: "write" },
  { code: "documents:read", resource: "documents", action: "read" },
  { code: "documents:write", resource: "documents", action: "write" },
  { code: "tasks:read", resource: "tasks", action: "read" },
  { code: "tasks:write", resource: "tasks", action: "write" },
  { code: "finance:read", resource: "finance", action: "read" },
  { code: "finance:write", resource: "finance", action: "write" },
  { code: "billing:manage", resource: "billing", action: "manage" }
] as const;

export const RBAC_ROLES = [
  {
    code: "owner",
    name: "Owner",
    permissions: RBAC_PERMISSIONS.map((permission) => permission.code)
  },
  {
    code: "admin",
    name: "Admin",
    permissions: RBAC_PERMISSIONS.filter((permission) => permission.code !== "billing:manage").map(
      (permission) => permission.code
    )
  },
  {
    code: "lawyer",
    name: "Abogado",
    permissions: [
      "clients:read",
      "clients:write",
      "cases:read",
      "cases:write",
      "documents:read",
      "documents:write",
      "tasks:read",
      "tasks:write",
      "finance:read"
    ]
  },
  {
    code: "paralegal",
    name: "Paralegal",
    permissions: [
      "clients:read",
      "cases:read",
      "documents:read",
      "documents:write",
      "tasks:read",
      "tasks:write"
    ]
  },
  {
    code: "accounting",
    name: "Contabilidad",
    permissions: ["clients:read", "cases:read", "finance:read", "finance:write"]
  },
  {
    code: "viewer",
    name: "Lectura",
    permissions: ["clients:read", "cases:read", "documents:read", "tasks:read", "finance:read"]
  }
] as const;

export type PermissionCode = (typeof RBAC_PERMISSIONS)[number]["code"];
export type RoleCode = (typeof RBAC_ROLES)[number]["code"];
