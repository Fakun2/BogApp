"use client";

import type { ReactNode } from "react";
import { hasPermissions, type PermissionMode } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";

export function Can({
  children,
  fallback = null,
  mode = "all",
  permissions
}: {
  children: ReactNode;
  fallback?: ReactNode;
  mode?: PermissionMode;
  permissions: string[];
}) {
  const session = useSession();

  return hasPermissions(session, permissions, mode) ? <>{children}</> : <>{fallback}</>;
}
