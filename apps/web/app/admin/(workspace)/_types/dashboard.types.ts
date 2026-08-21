export type DashboardCurrencyDto = {
  code: string;
  name: string;
  symbol: string;
};

export type DashboardCashboxMetricDto = {
  balance: string;
  currency: DashboardCurrencyDto;
  date: string;
  expenseToday: string;
  incomeToday: string;
};

export type DashboardDueTodayMetricDto = {
  paymentsCount: number;
  tasksCount: number;
};

export type DashboardMetricsDto = {
  activeCasesCount: number;
  cashbox: DashboardCashboxMetricDto;
  dueToday: DashboardDueTodayMetricDto;
};

export type DashboardSearchItemType =
  | "case"
  | "document"
  | "cashbox_movement"
  | "task_due"
  | "hearing"
  | "payment_due";

export type DashboardSearchItemDto = {
  type: DashboardSearchItemType;
  id: string;
  title: string;
  date: string;
  href: string;
  caseId?: string;
  caseNumber?: string;
  caseCaption?: string;
  description?: string | null;
  status?: string | null;
  amount?: number;
  currencyCode?: string;
  time?: string;
  fileName?: string;
  fileType?: string;
  fileSizeBytes?: number;
  movementName?: string;
  movementType?: "income" | "expense" | "conversion_in" | "conversion_out";
};

export type DashboardSearchPageInfoDto = {
  limit: number;
  offset: number;
  nextCursor: string | null;
  hasNextPage: boolean;
  total: number;
};

export type DashboardSearchResponse = {
  items: DashboardSearchItemDto[];
  pageInfo: DashboardSearchPageInfoDto;
};

export type DashboardSearchQueryParams = {
  search: string;
  limit?: number;
  cursor?: string;
  offset?: number;
};
