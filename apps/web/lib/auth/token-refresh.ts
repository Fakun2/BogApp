import { toApiUrl } from "@/lib/api/origin";
import type { TokenPair } from "./token-types";

export async function refreshAuthTokens(refreshToken: string) {
  const response = await fetch(toApiUrl("/api/auth/refresh"), {
    body: JSON.stringify({ refreshToken }),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  return (await response.json().catch(() => null)) as TokenPair | null;
}
