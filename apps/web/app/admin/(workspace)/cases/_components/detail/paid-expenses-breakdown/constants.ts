import type { ChartConfig } from "@/components/ui/chart";

export const paidExpenseChartColors = ["#4f6df5", "#6c4ee8", "#f5c147", "#e85ac7"] as const;

export const emptyPaidExpenseChartColor = "#e5e7eb";

export const paidExpenseChartConfig = {
  amount: {
    label: "Monto"
  }
} satisfies ChartConfig;
