import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/api/server";

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json({ status: "ok" });
}
