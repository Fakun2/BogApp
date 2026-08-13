import { NextResponse } from "next/server";
import { clearAuthCookiesOnResponse } from "@/lib/api/server";

export async function POST() {
  const response = NextResponse.json({ status: "ok" });
  await clearAuthCookiesOnResponse(response);
  return response;
}
