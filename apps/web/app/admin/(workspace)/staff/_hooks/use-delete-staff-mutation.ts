"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import { deleteStaff, staffKeys } from "../_api/staff.api";

export function useDeleteStaffMutation(staffId: string) {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "staff:delete",
    mutationFn: (_: void, { session, tenantId }) => deleteStaff({ session, staffId, tenantId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(staffKeys.all[0])
      });
    }
  });
}
