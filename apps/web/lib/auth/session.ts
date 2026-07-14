import type { AuthUserDto, TokenPairDto } from "@bogaap/api-client";
import { decodeJwtPayload } from "./jwt";

const sessionStorageKey = "bogaap.session";
const sessionListeners = new Set<() => void>();

export type BogaapSession = {
  tenantAccess?: SessionTenantAccess[];
  tokens?: Partial<TokenPairDto>;
  user: AuthUserDto;
};

export type SessionTenantAccess = {
  tenantId: string;
  role: string;
  permissions: string[];
};

export type SessionJwtPayload = {
  sub?: string;
  email?: string;
  sessionVersion?: number;
  tenantAccess: SessionTenantAccess[];
};

export function saveSession(session: BogaapSession) {
  const tenantAccess =
    session.tenantAccess ??
    (session.tokens?.accessToken ? decodeJwtPayload(session.tokens.accessToken).tenantAccess : []);

  window.localStorage.setItem(
    sessionStorageKey,
    JSON.stringify({
      tenantAccess,
      user: session.user
    })
  );
  notifySessionListeners();
}

export function readSession(): BogaapSession | null {
  const stored = window.localStorage.getItem(sessionStorageKey);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as BogaapSession;
  } catch {
    window.localStorage.removeItem(sessionStorageKey);
    return null;
  }
}

export function clearSession() {
  window.localStorage.removeItem(sessionStorageKey);
  notifySessionListeners();
}

export function subscribeSession(listener: () => void) {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

function notifySessionListeners() {
  for (const listener of sessionListeners) {
    listener();
  }
}

export function readAccessTokenPayload(accessToken: string): SessionJwtPayload {
  return decodeJwtPayload(accessToken);
}

export function hasTenantAccess(session: BogaapSession) {
  return getSessionTenantAccess(session).length > 0;
}

export function getSessionTenantAccess(session: BogaapSession | null) {
  if (!session) {
    return [];
  }

  if (session.tenantAccess) {
    return session.tenantAccess;
  }

  return session.tokens?.accessToken ? readAccessTokenPayload(session.tokens.accessToken).tenantAccess : [];
}

export function sessionHasPermission(session: BogaapSession | null, permission: string) {
  return getSessionTenantAccess(session)[0]?.permissions.includes(permission) ?? false;
}
