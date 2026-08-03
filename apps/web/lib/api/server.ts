import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { LoginResponseDto } from "@bogaap/api-client";
import { toApiUrl } from "@/lib/api/origin";
import { authCookieOptions, setAuthTokenCookies } from "@/lib/auth/cookie-options";
import {
  accessTokenCookieName,
  accessTokenMaxAgeSeconds,
  refreshTokenCookieName,
  refreshTokenMaxAgeSeconds
} from "@/lib/auth/cookies";
import { decodeJwtPayload } from "@/lib/auth/jwt";
import type { BogaapSession } from "@/lib/auth/session";
import type { TokenPair } from "@/lib/auth/token-types";

export async function setAuthCookies(tokens: TokenPair) {
  const cookieStore = await cookies();

  cookieStore.set(accessTokenCookieName, tokens.accessToken, {
    maxAge: accessTokenMaxAgeSeconds,
    ...authCookieOptions()
  });
  cookieStore.set(refreshTokenCookieName, tokens.refreshToken, {
    maxAge: refreshTokenMaxAgeSeconds,
    ...authCookieOptions()
  });
}

export function setAuthCookiesOnResponse(response: NextResponse, tokens: TokenPair) {
  setAuthTokenCookies(response, tokens);
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(accessTokenCookieName);
  cookieStore.delete(refreshTokenCookieName);
}

export function toClientSession(response: LoginResponseDto): BogaapSession {
  return {
    tenantAccess: decodeJwtPayload(response.tokens.accessToken).tenantAccess,
    user: response.user
  };
}

export async function getAccessTokenCookie() {
  return (await cookies()).get(accessTokenCookieName)?.value ?? null;
}

export async function getRefreshTokenCookie() {
  return (await cookies()).get(refreshTokenCookieName)?.value ?? null;
}

export { toApiUrl };
