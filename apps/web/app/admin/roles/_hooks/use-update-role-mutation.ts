"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import type { UpdateRoleFormValues } from "@/lib/validation/roles";
import { staffKeys } from "../../staff/_api/staff.api";
import { roleKeys, updateRole } from "../_api/roles.api";

export function useUpdateRoleMutation(roleId: string | undefined) {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "roles:update",
    mutationFn: (input: UpdateRoleFormValues, { session, tenantId }) => {
      if (!roleId) {
        throw new Error("No se encontro el rol a actualizar.");
      }

      return updateRole({ input, roleId, session, tenantId });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes(roleKeys.all[0])
        }),
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes(staffKeys.all[0])
        })
      ]);
    }
  });
}
