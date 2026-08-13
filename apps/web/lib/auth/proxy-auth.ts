import { NextRequest, NextResponse } from "next/server";
import { clearAuthSessionCookies } from "./cookie-options";
import { sessionCookieName } from "./cookies";
import { decodeSessionCookie } from "./session-cookie";

export function getRequestSessionMeta(request: NextRequest) {
  return decodeSessionCookie(request.cookies.get(sessionCookieName)?.value);
}

export function redirectToLogin(request: NextRequest, options?: { clearCookies?: boolean }) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  const response = NextResponse.redirect(loginUrl);

  if (options?.clearCookies) {
    clearAuthSessionCookies(response);
  }

  return response;
}
