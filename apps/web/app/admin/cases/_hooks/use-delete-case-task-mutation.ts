"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import { deleteCaseTask } from "../_api/cases.api";

export function useDeleteCaseTaskMutation(caseId: string) {
  const queryClient = useQueryClient();

  return useDashboardMutation<{ status: "ok" }, string>({
    mutationFn: (taskId) => deleteCaseTask({ caseId, taskId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("cases")
      });
    },
    permission: "tasks:delete"
  });
}
