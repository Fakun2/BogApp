"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import type { CaseTaskFormValues } from "@/lib/validation/cases";
import { saveCaseTask } from "../_api/cases.api";
import type { CaseTaskDto } from "../_types/cases.types";

export function useSaveCaseTaskMutation({
  caseId,
  taskId
}: {
  caseId: string;
  taskId?: string;
}) {
  const queryClient = useQueryClient();

  return useDashboardMutation<CaseTaskDto, CaseTaskFormValues>({
    mutationFn: (input) => saveCaseTask({ caseId, input, taskId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("cases")
      });
    },
    permission: taskId ? "tasks:update" : "tasks:create"
  });
}
