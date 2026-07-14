import { NextResponse } from "next/server";
import type { LoginResponseDto } from "@bogaap/api-client";
import { setAuthCookiesOnResponse, toApiUrl, toClientSession } from "@/lib/api/server";

export async function POST(request: Request) {
  const response = await fetch(toApiUrl("/api/auth/login"), {
    body: await request.text(),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  });
  const body = (await response.json().catch(() => null)) as LoginResponseDto | unknown;

  if (!response.ok) {
    return NextResponse.json(body, { status: response.status });
  }

  const loginResponse = body as LoginResponseDto;
  const loginNextResponse = NextResponse.json(toClientSession(loginResponse), { status: 200 });
  setAuthCookiesOnResponse(loginNextResponse, loginResponse.tokens);

  return loginNextResponse;
}
