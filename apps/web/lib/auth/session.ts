import type { LoginResponseDto } from "@bogaap/api-client";

const sessionStorageKey = "bogaap.session";

export type BogaapSession = LoginResponseDto;

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
