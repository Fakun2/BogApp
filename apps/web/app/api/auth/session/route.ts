import { NextResponse } from "next/server";
import {
  clearAuthCookies,
  getAccessTokenCookie,
  getRefreshTokenCookie,
  setAuthCookiesOnResponse,
  toApiUrl
} from "@/lib/api/server";
import { decodeJwtPayload } from "@/lib/auth/jwt";
import { refreshAuthTokens } from "@/lib/auth/token-refresh";
import type { TokenPair } from "@/lib/auth/token-types";

export async function GET() {
  let accessToken = await getAccessTokenCookie();
  let refreshedTokens: TokenPair | null = null;

  if (!accessToken) {
    refreshedTokens = await refreshTokensFromCookie();
    accessToken = refreshedTokens?.accessToken ?? null;
  }

  if (!accessToken) {
    await clearAuthCookies();
    return NextResponse.json({ message: "No hay sesion activa." }, { status: 401 });
  }

  const payload = decodeJwtPayload(accessToken);
  if (!payload.sub) {
    refreshedTokens = await refreshTokensFromCookie();
    accessToken = refreshedTokens?.accessToken ?? null;
  }

  const activePayload = accessToken ? decodeJwtPayload(accessToken) : { tenantAccess: [] };
  if (!activePayload.sub) {
    await clearAuthCookies();
    return NextResponse.json({ message: "Sesion invalida." }, { status: 401 });
  }

  const tenantId = activePayload.tenantAccess[0]?.tenantId;
  if (tenantId) {
    const response = await fetch(toApiUrl("/api/identity/me"), {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-tenant-id": tenantId
      }
    });

    if (!response.ok) {
      await clearAuthCookies();
      return NextResponse.json({ message: "Sesion invalida." }, { status: 401 });
    }
  }

  const sessionResponse = NextResponse.json({
    tenantAccess: activePayload.tenantAccess,
    user: {
      email: activePayload.email ?? "",
      fullName: activePayload.email ?? "Usuario",
      id: activePayload.sub,
      phone: null,
      status: "active"
    }
  });

  if (refreshedTokens) {
    setAuthCookiesOnResponse(sessionResponse, refreshedTokens);
  }

  return sessionResponse;
}

async function refreshTokensFromCookie() {
  const refreshToken = await getRefreshTokenCookie();
  if (!refreshToken) {
    return null;
  }

  return refreshAuthTokens(refreshToken);
}
