import { NextRequest, NextResponse } from "next/server";
import { getRequestSessionMeta, redirectToLogin } from "@/lib/auth/proxy-auth";

export function proxy(request: NextRequest) {
  const sessionMeta = getRequestSessionMeta(request);
  if (!sessionMeta) {
    return redirectToLogin(request, { clearCookies: true });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
