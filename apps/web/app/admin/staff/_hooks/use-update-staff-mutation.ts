"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import type { UpdateStaffFormValues } from "@/lib/validation/staff";
import { staffKeys, updateStaff } from "../_api/staff.api";

export function useUpdateStaffMutation(staffId: string | undefined) {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "staff:update",
    mutationFn: (input: UpdateStaffFormValues, { session, tenantId }) => {
      if (!staffId) {
        throw new Error("No se pudo identificar el empleado a actualizar.");
      }

      return updateStaff({ input, session, staffId, tenantId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(staffKeys.all[0])
      });
    }
  });
}
