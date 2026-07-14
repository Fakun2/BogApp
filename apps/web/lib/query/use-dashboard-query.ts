"use client";

import { useMemo } from "react";
import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";
import { getActiveTenantAccess, hasPermission } from "@/lib/auth/permissions";
import type { BogaapSession } from "@/lib/auth/session";
import { useSession } from "@/lib/auth/use-session";

type DashboardQueryContext = {
  session: BogaapSession;
  tenantId: string;
};

type DashboardQueryOptions<TData> = Omit<
  UseQueryOptions<TData, Error, TData, QueryKey>,
  "enabled" | "queryFn" | "queryKey"
> & {
  permission?: string;
  queryFn: (context: DashboardQueryContext) => Promise<TData>;
  queryKey: QueryKey;
};

export function useDashboardQuery<TData>({
  permission,
  queryFn,
  queryKey,
  ...options
}: DashboardQueryOptions<TData>) {
  const session = useSession();
  const tenantAccess = useMemo(() => getActiveTenantAccess(session), [session]);
  const tenantId = tenantAccess?.tenantId ?? null;
  const allowed = permission ? hasPermission(session, permission) : true;
  const enabled = Boolean(session && tenantId && allowed);

  const query = useQuery<TData, Error>({
    ...options,
    enabled,
    queryKey: [tenantId, ...queryKey],
    queryFn: () => {
      if (!session || !tenantId) {
        throw new Error("No hay un workspace activo para consultar el dashboard.");
      }

      return queryFn({ session, tenantId });
    }
  });

  return {
    ...query,
    hasPermission: allowed,
    hasSession: Boolean(session),
    session,
    tenantId
  };
}
