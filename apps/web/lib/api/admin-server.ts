import { getServerAuthSession, toApiUrl } from "@/lib/api/server";

export async function requestAdminApiServer<TResponse>(path: string): Promise<TResponse> {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("No hay sesion activa.");
  }

  const tenantId = session.tenantAccess[0]?.tenantId;
  if (!tenantId) {
    throw new Error("No hay un workspace activo para consultar el panel.");
  }

  const response = await fetch(toApiUrl(path), {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${session.tokens.accessToken}`,
      "x-tenant-id": tenantId
    }
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: unknown } | null;
    throw new Error(getServerErrorMessage(body?.message, response.status));
  }

  return response.json() as Promise<TResponse>;
}

function getServerErrorMessage(message: unknown, status: number) {
  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    return message.join(" ");
  }

  return `No se pudo cargar el panel (${status}).`;
}
