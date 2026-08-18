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
