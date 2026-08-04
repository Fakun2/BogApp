import type { CaseExpenseSummaryItemDto } from "../../../_types/cases.types";

export type PaidExpenseChartItem = CaseExpenseSummaryItemDto & {
  color: string;
};

export type PaidExpenseChartDataItem = PaidExpenseChartItem | {
  amount: number;
  color: string;
  concept: string;
  id: string;
  percentage: number;
};
