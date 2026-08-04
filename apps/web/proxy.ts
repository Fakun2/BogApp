import { NextRequest, NextResponse } from "next/server";
import {
  applyAuthCookies,
  getRequestAccessToken,
  readRequestAccessTokenPayload,
  redirectToLogin,
  refreshRequestAccessToken,
  verifyBackendSession
} from "@/lib/auth/proxy-auth";
import type { TokenPair } from "@/lib/auth/token-types";

export async function proxy(request: NextRequest) {
  let accessToken = getRequestAccessToken(request);
  let refreshedTokens: TokenPair | null = null;

  if (!accessToken) {
    refreshedTokens = await refreshRequestAccessToken(request);
    accessToken = refreshedTokens?.accessToken;
  }

  let payload = accessToken ? readRequestAccessTokenPayload(accessToken) : null;

  if (!payload?.sub) {
    refreshedTokens = await refreshRequestAccessToken(request);
    accessToken = refreshedTokens?.accessToken;
    payload = accessToken ? readRequestAccessTokenPayload(accessToken) : null;
  }

  const activeTenant = payload?.tenantAccess[0];
  if (!accessToken || !payload || !activeTenant) {
    return redirectToLogin(request);
  }

  if (!activeTenant.permissions.includes("admin:access")) {
    return redirectToLogin(request);
  }

  const sessionIsValid = await verifyBackendSession(accessToken, activeTenant.tenantId);
  if (!sessionIsValid) {
    return redirectToLogin(request, { clearCookies: true });
  }

  const response = NextResponse.next();
  if (refreshedTokens) {
    applyAuthCookies(response, refreshedTokens);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"]
};
