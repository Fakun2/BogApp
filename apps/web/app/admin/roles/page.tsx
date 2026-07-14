"use client";

import { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequirePermission } from "../_components/auth";
import {
  adminSurfaceClassName,
  adminSurfacePrimaryClassName
} from "../_constants/dashboard";
import { CreateRoleSheet } from "./_components/create-role-sheet";
import { RolesFilters, type RoleStatusFilter } from "./_components/roles-filters";
import { RolesList } from "./_components/roles-list";
import { RolesMetrics } from "./_components/roles-metrics";
import { useRolesQuery } from "./_hooks/use-roles-query";
import { filterRoles } from "./_utils/role-filters";

export default function RolesPage() {
  const rolesQuery = useRolesQuery();
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<RoleStatusFilter>("all");
  const roles = rolesQuery.data?.roles ?? [];
  const permissions = rolesQuery.data?.permissions ?? [];
  const filteredRoles = useMemo(
    () => filterRoles({ name: nameFilter, roles, status: statusFilter }),
    [nameFilter, roles, statusFilter]
  );

  if (!rolesQuery.hasSession) {
    return <RestrictedRoles />;
  }

  return (
    <RequirePermission permissions={["roles:read"]} fallback={<RestrictedRoles />}>
      <div className="flex h-[calc(100svh-4rem)] max-h-[calc(100svh-4rem)] min-h-0 flex-col gap-4 overflow-hidden md:h-[calc(100svh-5rem)] md:max-h-[calc(100svh-5rem)]">
        <RolesMetrics roles={roles} />

        <RolesFilters
          disabled={rolesQuery.isLoading}
          name={nameFilter}
          status={statusFilter}
          onNameChange={setNameFilter}
          onStatusChange={setStatusFilter}
        />

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
              <div className="flex min-h-full items-center justify-center rounded-3xl border border-border/30 px-6 py-12 text-center text-sm text-muted-foreground">
                Cargando roles...
              </div>
            ) : rolesQuery.error ? (
              <div className="rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-5 text-sm font-medium text-destructive">
                {rolesQuery.error.message}
              </div>
            ) : (
              <RolesList permissions={permissions} roles={filteredRoles} />
            )}
          </CardContent>
        </Card>
      </div>
    </RequirePermission>
  );
}

function RestrictedRoles() {
  return (
    <Card
      data-admin-surface
      className="mx-auto max-w-xl rounded-xl border-0 bg-card text-card-foreground shadow-[var(--admin-card-shadow)]"
    >
      <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Roles restringidos</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            No tienes acceso para gestionar roles dentro de este estudio.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
