import {
  getSessionTenantAccess,
  type BogaapSession,
  type SessionTenantAccess
} from "./session";

export type PermissionMode = "all" | "any";

export function getActiveTenantAccess(session: BogaapSession | null): SessionTenantAccess | null {
  return getSessionTenantAccess(session)[0] ?? null;
}

export function hasPermission(session: BogaapSession | null, permission: string) {
  return hasAllPermissions(session, [permission]);
}

export function hasAnyPermission(session: BogaapSession | null, permissions: string[]) {
  if (permissions.length === 0) {
    return true;
  }

  const access = getActiveTenantAccess(session);
  return Boolean(access && permissions.some((permission) => access.permissions.includes(permission)));
}

export function hasAllPermissions(session: BogaapSession | null, permissions: string[]) {
  if (permissions.length === 0) {
    return true;
  }

  const access = getActiveTenantAccess(session);
  return Boolean(access && permissions.every((permission) => access.permissions.includes(permission)));
}

export function hasPermissions(
  session: BogaapSession | null,
  permissions: string[] | undefined,
  mode: PermissionMode = "all"
) {
  if (!permissions || permissions.length === 0) {
    return true;
  }

  return mode === "any"
    ? hasAnyPermission(session, permissions)
    : hasAllPermissions(session, permissions);
}
