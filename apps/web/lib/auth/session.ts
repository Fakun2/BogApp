import type { LoginResponseDto } from "@bogaap/api-client";

const sessionStorageKey = "bogaap.session";

export type BogaapSession = LoginResponseDto;

export type SessionTenantAccess = {
  tenantId: string;
  role: string;
  permissions: string[];
};

export type SessionJwtPayload = {
  sub?: string;
  email?: string;
  tenantAccess: SessionTenantAccess[];
};

export function saveSession(session: BogaapSession) {
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));
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
}

export function readAccessTokenPayload(accessToken: string): SessionJwtPayload {
  try {
    const payload = accessToken.split(".")[1];
    if (!payload) {
      return emptyPayload();
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "="
    );
    const decodedPayload = window.atob(paddedPayload);
    const parsedPayload = JSON.parse(decodedPayload) as Partial<SessionJwtPayload>;

    return {
      sub: parsedPayload.sub,
      email: parsedPayload.email,
      tenantAccess: Array.isArray(parsedPayload.tenantAccess) ? parsedPayload.tenantAccess : []
    };
  } catch {
    return emptyPayload();
  }
}

export function hasTenantAccess(session: BogaapSession) {
  return readAccessTokenPayload(session.tokens.accessToken).tenantAccess.length > 0;
}

function emptyPayload(): SessionJwtPayload {
  return {
    tenantAccess: []
  };
}
