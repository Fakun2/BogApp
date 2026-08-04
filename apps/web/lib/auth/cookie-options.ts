import type { NextResponse } from "next/server";
import {
  accessTokenCookieName,
  accessTokenMaxAgeSeconds,
  refreshTokenCookieName,
  refreshTokenMaxAgeSeconds
} from "./cookies";
import type { TokenPair } from "./token-types";

export function setAuthTokenCookies(response: NextResponse, tokens: TokenPair) {
  response.cookies.set(accessTokenCookieName, tokens.accessToken, {
    maxAge: accessTokenMaxAgeSeconds,
    ...authCookieOptions()
  });
  response.cookies.set(refreshTokenCookieName, tokens.refreshToken, {
    maxAge: refreshTokenMaxAgeSeconds,
    ...authCookieOptions()
  });
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: shouldUseSecureCookies()
  };
}

function shouldUseSecureCookies() {
  const configuredValue = process.env.AUTH_COOKIE_SECURE;
  if (configuredValue !== undefined) {
    return configuredValue.toLowerCase() === "true";
  }

  return [
    process.env.FRONTEND_PUBLIC_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  ].some((url) => url?.startsWith("https://"));
}
