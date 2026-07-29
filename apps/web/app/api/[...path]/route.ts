import { NextRequest, NextResponse } from "next/server";
import type { TokenPairDto } from "@bogaap/api-client";
import {
  clearAuthCookies,
  getAccessTokenCookie,
  getRefreshTokenCookie,
  setAuthCookies,
  setAuthCookiesOnResponse,
  toApiUrl
} from "@/lib/api/server";
import { decodeJwtPayload } from "@/lib/auth/jwt";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const initial = await forwardRequest(request, context);
  if (initial.status !== 401) {
    return initial;
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    await clearAuthCookies();
    return initial;
  }

  return forwardRequest(request, context, refreshed.accessToken);
}

async function forwardRequest(
  request: NextRequest,
  context: RouteContext,
  accessTokenOverride?: string
) {
  const { path } = await context.params;
  const accessToken = accessTokenOverride ?? (await getAccessTokenCookie());
  const url = new URL(request.url);
  const targetUrl = toApiUrl(`/api/${path.join("/")}${url.search}`);
  const headers = new Headers();
  const contentType = request.headers.get("Content-Type");
  const payload = accessToken ? decodeJwtPayload(accessToken) : null;
  const tenantId = payload?.tenantAccess[0]?.tenantId;

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (tenantId) {
    headers.set("x-tenant-id", tenantId);
  }

  const response = await fetch(targetUrl, {
    body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
    headers,
    method: request.method
  });

  return toProxyResponse(response);
}

async function refreshAccessToken() {
  const refreshToken = await getRefreshTokenCookie();
  if (!refreshToken) {
    return null;
  }

  const response = await fetch(toApiUrl("/api/auth/refresh"), {
    body: JSON.stringify({ refreshToken }),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  });

  if (!response.ok) {
    await clearAuthCookies();
    return null;
  }

  const tokens = (await response.json()) as TokenPairDto;
  await setAuthCookies(tokens);
  return tokens;
}

async function toProxyResponse(response: Response) {
  const body = await response.arrayBuffer();
  const text = new TextDecoder().decode(body);
  const json = parseJson(text);

  if (json && hasTokenPair(json)) {
    const body = Object.fromEntries(
      Object.entries(json).filter(([key]) => key !== "tokens")
    );
    const proxyResponse = NextResponse.json(body, { status: response.status });
    setAuthCookiesOnResponse(proxyResponse, json.tokens);
    return proxyResponse;
  }

  if (!response.ok) {
    return NextResponse.json(normalizeErrorBody(json, response.status), {
      status: response.status
    });
  }

  return new NextResponse(body, {
    headers: {
      ...getPassthroughHeaders(response)
    },
    status: response.status
  });
}

function getPassthroughHeaders(response: Response) {
  const headers: Record<string, string> = {};
  const contentType = response.headers.get("Content-Type");
  const contentDisposition = response.headers.get("Content-Disposition");
  const contentLength = response.headers.get("Content-Length");

  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  if (contentDisposition) {
    headers["Content-Disposition"] = contentDisposition;
  }
  if (contentLength) {
    headers["Content-Length"] = contentLength;
  }

  return headers;
}

function parseJson(text: string) {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function hasTokenPair(value: Record<string, unknown>): value is { tokens: TokenPairDto } {
  const tokens = value.tokens as Partial<TokenPairDto> | undefined;
  return Boolean(tokens?.accessToken && tokens.refreshToken);
}

function normalizeErrorBody(body: Record<string, unknown> | null, status: number) {
  const message = body?.message;

  return {
    details: body ?? undefined,
    message:
      typeof message === "string" || Array.isArray(message)
        ? message
        : `BOGAP API request failed: ${status}`,
    statusCode: status
  };
}
