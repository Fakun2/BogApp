"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import { deleteCase } from "../_api/cases.api";

export function useDeleteCaseMutation() {
  const queryClient = useQueryClient();

  return useDashboardMutation<{ status: "ok" }, string>({
    permission: "cases:delete",
    mutationFn: deleteCase,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("cases")
      });
    }
  });
}
