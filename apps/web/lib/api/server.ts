import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { LoginResponseDto, TokenPairDto } from "@bogaap/api-client";
import {
  accessTokenCookieName,
  accessTokenMaxAgeSeconds,
  refreshTokenCookieName,
  refreshTokenMaxAgeSeconds
} from "@/lib/auth/cookies";
import { decodeJwtPayload } from "@/lib/auth/jwt";
import type { BogaapSession } from "@/lib/auth/session";

export function getApiProxyOrigin() {
  return process.env.NEXT_PUBLIC_API_PROXY_ORIGIN ?? "http://localhost:3001";
}

export function toApiUrl(path: string) {
  return `${getApiProxyOrigin()}${path.startsWith("/api") ? path : `/api${path}`}`;
}

export async function setAuthCookies(tokens: TokenPairDto) {
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

export function setAuthCookiesOnResponse(response: NextResponse, tokens: TokenPairDto) {
  response.cookies.set(accessTokenCookieName, tokens.accessToken, {
    maxAge: accessTokenMaxAgeSeconds,
    ...authCookieOptions()
  });
  response.cookies.set(refreshTokenCookieName, tokens.refreshToken, {
    maxAge: refreshTokenMaxAgeSeconds,
    ...authCookieOptions()
  });
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

function authCookieOptions() {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };
}
