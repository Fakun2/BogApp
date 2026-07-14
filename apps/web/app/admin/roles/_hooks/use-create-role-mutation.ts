"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import type { CreateRoleFormValues } from "@/lib/validation/roles";
import { staffKeys } from "../../staff/_api/staff.api";
import { createRole, roleKeys } from "../_api/roles.api";

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "roles:create",
    mutationFn: (input: CreateRoleFormValues, { session, tenantId }) =>
      createRole({ input, session, tenantId }),
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
