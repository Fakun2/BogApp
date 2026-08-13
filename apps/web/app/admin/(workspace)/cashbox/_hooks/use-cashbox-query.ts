"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import {
  cashboxKeys,
  createCashboxConversion,
  createCashboxMovement,
  deleteCashboxMovement,
  getCashboxSummary,
  listCashboxMovements,
  updateCashboxMovement
} from "../_api/cashbox.api";
import type {
  CashboxConversionInput,
  CashboxMovementInput,
  CashboxMovementsQueryParams,
  CashboxQueryParams,
  UpdateCashboxMovementInput
} from "../_types/cashbox.types";

export function useCashboxSummaryQuery(params: CashboxQueryParams) {
  return useDashboardQuery({
    permission: "finance:read",
    queryKey: cashboxKeys.summary(params),
    queryFn: () => getCashboxSummary(params)
  });
}

export function useCashboxMovementsQuery(params: CashboxMovementsQueryParams) {
  return useDashboardQuery({
    permission: "finance:read",
    queryKey: cashboxKeys.movements(params),
    queryFn: () => listCashboxMovements(params)
  });
}

export function useCreateCashboxMovementMutation() {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "finance:create",
    mutationFn: (input: CashboxMovementInput) => createCashboxMovement(input),
    onSuccess: () => invalidateCashboxQueries(queryClient)
  });
}

export function useCreateCashboxConversionMutation() {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "finance:create",
    mutationFn: (input: CashboxConversionInput) => createCashboxConversion(input),
    onSuccess: () => invalidateCashboxQueries(queryClient)
  });
}

export function useUpdateCashboxMovementMutation() {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "finance:update",
    mutationFn: ({ id, input }: { id: string; input: UpdateCashboxMovementInput }) =>
      updateCashboxMovement(id, input),
    onSuccess: () => invalidateCashboxQueries(queryClient)
  });
}

export function useDeleteCashboxMovementMutation() {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "finance:delete",
    mutationFn: (id: string) => deleteCashboxMovement(id),
    onSuccess: () => invalidateCashboxQueries(queryClient)
  });
}

function invalidateCashboxQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({
    predicate: (query) => isActiveCashboxDataQuery(query.queryKey),
    refetchType: "active"
  });
}

function isActiveCashboxDataQuery(queryKey: readonly unknown[]) {
  const cashboxIndex = queryKey.findIndex((item) => item === cashboxKeys.all[0]);
  const segment = cashboxIndex >= 0 ? queryKey[cashboxIndex + 1] : null;

  return segment === cashboxKeys.summaryRoot()[1] || segment === cashboxKeys.movementsRoot()[1];
}
