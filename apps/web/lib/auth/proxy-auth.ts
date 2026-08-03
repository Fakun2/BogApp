import { NextRequest, NextResponse } from "next/server";
import { toApiUrl } from "@/lib/api/origin";
import { accessTokenCookieName, refreshTokenCookieName } from "./cookies";
import { setAuthTokenCookies } from "./cookie-options";
import { decodeJwtPayload } from "./jwt";
import { refreshAuthTokens } from "./token-refresh";
import type { TokenPair } from "./token-types";

export function getRequestAccessToken(request: NextRequest) {
  return request.cookies.get(accessTokenCookieName)?.value;
}

export function readRequestAccessTokenPayload(accessToken: string) {
  return decodeJwtPayload(accessToken);
}

export async function refreshRequestAccessToken(request: NextRequest) {
  const refreshToken = request.cookies.get(refreshTokenCookieName)?.value;
  if (!refreshToken) {
    return null;
  }

  return refreshAuthTokens(refreshToken);
}

export async function verifyBackendSession(accessToken: string, tenantId: string) {
  const response = await fetch(toApiUrl("/api/identity/me"), {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-tenant-id": tenantId
    }
  }).catch(() => null);

  return response?.ok ?? false;
}

export function applyAuthCookies(response: NextResponse, tokens: TokenPair) {
  setAuthTokenCookies(response, tokens);
}

export function redirectToLogin(request: NextRequest, options?: { clearCookies?: boolean }) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  const response = NextResponse.redirect(loginUrl);

  if (options?.clearCookies) {
    response.cookies.delete(accessTokenCookieName);
    response.cookies.delete(refreshTokenCookieName);
  }

  return response;
}
