"use client";

import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { hasPermissions, type PermissionMode } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";

export function RequirePermission({
  children,
  fallback,
  mode = "all",
  permissions
}: {
  children: ReactNode;
  fallback?: ReactNode;
  mode?: PermissionMode;
  permissions: string[];
}) {
  const session = useSession();

  if (hasPermissions(session, permissions, mode)) {
    return <>{children}</>;
  }

  return <>{fallback ?? <RestrictedPermission permissions={permissions} />}</>;
}

function RestrictedPermission({ permissions }: { permissions: string[] }) {
  return (
    <Card
      data-admin-surface
      className="mx-auto max-w-xl rounded-xl border-0 bg-card text-card-foreground shadow-[var(--admin-card-shadow)]"
    >
      <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Area restringida</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Necesitas permisos para acceder a esta vista: {permissions.join(", ")}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
