import { NextRequest, NextResponse } from "next/server";
import { accessTokenCookieName, refreshTokenCookieName } from "@/lib/auth/cookies";
import { verifyJwt } from "@/lib/auth/jwt";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(accessTokenCookieName)?.value;

  if (!accessToken) {
    return redirectToLogin(request);
  }

  const payload = await verifyJwt(
    accessToken,
    process.env.JWT_ACCESS_SECRET ?? "dev-access-secret-change-me"
  );

  if (!payload) {
    return redirectToLogin(request);
  }

  if (!payload.tenantAccess[0]) {
    return redirectToLogin(request);
  }

  if (!payload.tenantAccess[0].permissions.includes("admin:access")) {
    return redirectToLogin(request);
  }

  const sessionIsValid = await verifyBackendSession(accessToken, payload.tenantAccess[0].tenantId);
  if (!sessionIsValid) {
    return redirectToLogin(request, { clearCookies: true });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};

async function verifyBackendSession(accessToken: string, tenantId: string) {
  const apiOrigin = process.env.NEXT_PUBLIC_API_PROXY_ORIGIN ?? "http://localhost:3001";
  const response = await fetch(`${apiOrigin}/api/identity/me`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-tenant-id": tenantId
    }
  }).catch(() => null);

  return response?.ok ?? false;
}

function redirectToLogin(request: NextRequest, options?: { clearCookies?: boolean }) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  const response = NextResponse.redirect(loginUrl);

  if (options?.clearCookies) {
    response.cookies.delete(accessTokenCookieName);
    response.cookies.delete(refreshTokenCookieName);
  }

  return response;
}
