"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import { staffKeys } from "../../staff/_api/staff.api";
import { deleteRole, roleKeys } from "../_api/roles.api";

export function useDeleteRoleMutation(roleId: string) {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "roles:delete",
    mutationFn: (_: void, { session, tenantId }) => deleteRole({ roleId, session, tenantId }),
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
