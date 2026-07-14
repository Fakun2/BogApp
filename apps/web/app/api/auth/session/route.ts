import { NextResponse } from "next/server";
import { clearAuthCookies, getAccessTokenCookie, toApiUrl } from "@/lib/api/server";
import { decodeJwtPayload } from "@/lib/auth/jwt";

export async function GET() {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) {
    return NextResponse.json({ message: "No hay sesion activa." }, { status: 401 });
  }

  const payload = decodeJwtPayload(accessToken);
  if (!payload.sub) {
    await clearAuthCookies();
    return NextResponse.json({ message: "Sesion invalida." }, { status: 401 });
  }

  const tenantId = payload.tenantAccess[0]?.tenantId;
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

  return NextResponse.json({
    tenantAccess: payload.tenantAccess,
    user: {
      email: payload.email ?? "",
      fullName: payload.email ?? "Usuario",
      id: payload.sub,
      phone: null,
      status: "active"
    }
  });
}
