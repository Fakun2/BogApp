import type { SessionJwtPayload } from "./session";

export function decodeJwtPayload(token: string): SessionJwtPayload {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return { tenantAccess: [] };
    }

    const decoded = JSON.parse(decodeBase64Url(payload)) as Partial<SessionJwtPayload> & {
      exp?: number;
    };

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return { tenantAccess: [] };
    }

    return {
      sub: decoded.sub,
      email: decoded.email,
      sessionVersion: decoded.sessionVersion,
      tenantAccess: Array.isArray(decoded.tenantAccess) ? decoded.tenantAccess : []
    };
  } catch {
    return { tenantAccess: [] };
  }
}

export async function verifyJwt(token: string, secret: string) {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) {
    return null;
  }

  const data = `${header}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["verify"]
  );
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlToBytes(signature),
    new TextEncoder().encode(data)
  );

  return valid ? decodeJwtPayload(token) : null;
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  if (typeof atob === "function") {
    return atob(padded);
  }

  return Buffer.from(padded, "base64").toString("utf8");
}

function base64UrlToBytes(value: string) {
  const binary = decodeBase64Url(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}
