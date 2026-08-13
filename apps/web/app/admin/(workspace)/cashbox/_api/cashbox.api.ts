import { dashboardHttpClient } from "@/lib/http";
import type {
  CashboxConversionInput,
  CashboxMovementDto,
  CashboxMovementInput,
  CashboxMovementsQueryParams,
  CashboxMovementsResponseDto,
  CashboxQueryParams,
  CashboxSummaryDto,
  UpdateCashboxMovementInput
} from "../_types/cashbox.types";

export const cashboxKeys = {
  all: ["cashbox"] as const,
  movementsRoot: () => [...cashboxKeys.all, "movements"] as const,
  movements: (params: CashboxMovementsQueryParams) => [...cashboxKeys.all, "movements", params] as const,
  summaryRoot: () => [...cashboxKeys.all, "summary"] as const,
  summary: (params: CashboxQueryParams) => [...cashboxKeys.all, "summary", params] as const
};

export function getCashboxSummary(params: CashboxQueryParams) {
  return dashboardHttpClient.request<CashboxSummaryDto>({
    params: {
      currencyCode: params.currencyCode,
      date: params.date
    },
    path: "/cashbox/summary"
  });
}

export function listCashboxMovements(params: CashboxMovementsQueryParams) {
  return dashboardHttpClient.request<CashboxMovementsResponseDto>({
    params: {
      currencyCode: params.currencyCode,
      cursor: params.cursor ?? undefined,
      date: params.date,
      limit: params.limit
    },
    path: "/cashbox/movements"
  });
}

export function createCashboxMovement(input: CashboxMovementInput) {
  return dashboardHttpClient.request<CashboxMovementDto>({
    body: input,
    method: "POST",
    path: "/cashbox/movements"
  });
}

export function createCashboxConversion(input: CashboxConversionInput) {
  return dashboardHttpClient.request<{ items: CashboxMovementDto[] }>({
    body: input,
    method: "POST",
    path: "/cashbox/conversions"
  });
}

export function updateCashboxMovement(id: string, input: UpdateCashboxMovementInput) {
  return dashboardHttpClient.request<CashboxMovementDto>({
    body: input,
    method: "PATCH",
    path: `/cashbox/movements/${id}`
  });
}

export function deleteCashboxMovement(id: string) {
  return dashboardHttpClient.request<{ id: string }>({
    method: "DELETE",
    path: `/cashbox/movements/${id}`
  });
}
