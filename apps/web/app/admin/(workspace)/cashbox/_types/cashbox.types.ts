export type CashboxMovementType = "income" | "expense" | "conversion_in" | "conversion_out";
export type CashboxCategoryOrigin = "global" | "tenant";
export type CashboxColumn = "occurredAt" | "type" | "amount" | "category" | "description" | "user" | "actions";
export type CashboxFlowMetricTone = "income" | "expense";

export type CashboxCurrencyDto = {
  code: string;
  name: string;
  symbol: string;
};

export type CashboxSummaryDto = {
  balance: string;
  currency: CashboxCurrencyDto;
  date: string;
  expenseToday: string;
  hourly: CashboxHourlySummaryDto[];
  incomeToday: string;
};

export type CashboxHourlySummaryDto = {
  expense: string;
  hour: string;
  income: string;
};

export type CashboxMovementDto = {
  amount: string;
  categoryId?: string;
  categoryName?: string;
  categoryOrigin?: CashboxCategoryOrigin;
  conversionGroupId?: string;
  createdByName: string;
  currencyCode: string;
  currencySymbol: string;
  description?: string;
  exchangeRate?: string;
  id: string;
  occurredAt: string;
  type: CashboxMovementType;
};

export type CashboxMovementsResponseDto = {
  items: CashboxMovementDto[];
  pageInfo: {
    hasNextPage: boolean;
    limit: number;
    nextCursor: string | null;
  };
};

export type CashboxTablePageInfo = CashboxMovementsResponseDto["pageInfo"];

export type CashboxQueryParams = {
  currencyCode?: string;
  date: string;
};

export type CashboxMovementsQueryParams = CashboxQueryParams & {
  cursor?: string | null;
  limit: number;
};

export type CashboxMovementInput = {
  amount: string;
  category?: {
    id: string;
    origin: CashboxCategoryOrigin;
  };
  currencyCode: string;
  description?: string;
  occurredAt?: string;
  type: "income" | "expense";
};

export type UpdateCashboxMovementInput = {
  amount?: string;
  category?:
    | {
        id: string;
        origin: CashboxCategoryOrigin;
      }
    | null;
  description?: string;
  occurredAt?: string;
};

export type CashboxConversionInput = {
  description?: string;
  exchangeRate: string;
  fromAmount: string;
  fromCurrencyCode: string;
  occurredAt?: string;
  toCurrencyCode: string;
};
