"use client";

import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { formatCaseMoney } from "../case-detail-format";
import { paidExpenseChartConfig } from "./constants";
import type { PaidExpenseChartDataItem } from "./types";

export function PaidExpensesDonut({
  chartData,
  hasExpenses,
  totalAmount
}: {
  chartData: PaidExpenseChartDataItem[];
  hasExpenses: boolean;
  totalAmount: number;
}) {
  return (
    <figure className="relative mx-auto h-[176px] w-[176px]" aria-label="Distribucion de gastos pagados">
      <ChartContainer config={paidExpenseChartConfig} className="h-full w-full">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="amount"
            innerRadius={60}
            outerRadius={86}
            paddingAngle={hasExpenses ? 4 : 0}
            stroke="transparent"
          >
            {chartData.map((item) => (
              <Cell fill={item.color} key={item.id} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <figcaption className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[11px] font-medium text-muted-foreground">Total</span>
        <span className="mt-1 text-base font-semibold text-foreground">
          {formatCaseMoney(totalAmount)}
        </span>
      </figcaption>
    </figure>
  );
}
