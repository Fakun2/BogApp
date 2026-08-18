"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UnauthorizedState } from "@/components/ui/not-found";
import { AdminListSkeleton, AdminMetricsSkeletonGrid } from "../_components/admin-skeletons";
import { RequirePermission } from "../_components/auth";
import { adminSurfaceClassName, adminSurfacePrimaryClassName } from "../_constants/dashboard";
import { CreateRoleSheet } from "./_components/create-role-sheet";
import { RolesList } from "./_components/roles-list";
import { RolesMetrics } from "./_components/roles-metrics";
import { useRolesQuery } from "./_hooks/use-roles-query";

export default function RolesPage() {
  const rolesQuery = useRolesQuery();
  const roles = rolesQuery.data?.roles ?? [];
  const permissions = rolesQuery.data?.permissions ?? [];

  if (!rolesQuery.hasSession) {
    return <RestrictedRoles />;
  }

  return (
    <RequirePermission permissions={["roles:read"]} fallback={<RestrictedRoles />}>
      <div className="flex h-[calc(100svh-4rem)] max-h-[calc(100svh-4rem)] min-h-0 flex-col gap-5 overflow-hidden md:h-[calc(100svh-5rem)] md:max-h-[calc(100svh-5rem)] md:gap-6">
        {rolesQuery.isLoading && !rolesQuery.data ? (
          <AdminMetricsSkeletonGrid count={3} />
        ) : (
          <RolesMetrics roles={roles} />
        )}

        <Card
          data-admin-surface
          className={`${adminSurfaceClassName} flex min-h-0 flex-1 flex-col border-0 shadow-[var(--admin-card-shadow)]`}
        >
          <CardHeader className="flex shrink-0 flex-row items-center justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className={`text-lg font-semibold ${adminSurfacePrimaryClassName}`}>
                Roles
              </CardTitle>
            </div>
            <CreateRoleSheet permissions={permissions} />
          </CardHeader>
          <CardContent className="min-h-0 flex-1 overflow-y-auto pb-5">
            {rolesQuery.isLoading ? (
              <AdminListSkeleton />
            ) : rolesQuery.error ? (
              <div className="rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-5 text-sm font-medium text-destructive">
                {rolesQuery.error.message}
              </div>
            ) : (
              <RolesList permissions={permissions} roles={roles} />
            )}
          </CardContent>
        </Card>
      </div>
    </RequirePermission>
  );
}

function RestrictedRoles() {
  return (
    <UnauthorizedState
      title="Roles restringidos"
      description="Necesitas permisos adicionales para acceder al area de roles."
    />
  );
}
