"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import type { CreateStaffFormValues } from "@/lib/validation/staff";
import { createStaff, staffKeys } from "../_api/staff.api";

export function useCreateStaffMutation() {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "staff:create",
    mutationFn: (input: CreateStaffFormValues, { session, tenantId }) =>
      createStaff({ input, session, tenantId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(staffKeys.all[0])
      });
    }
  });
}
