import type { CashboxFlowMetricTone, CashboxHourlySummaryDto } from "../_types/cashbox.types";

export function buildCashboxMetricChartData(
  hourly: CashboxHourlySummaryDto[] | undefined,
  tone: CashboxFlowMetricTone
) {
  return (hourly ?? emptyHourlySummary).map((item) => {
    const amount = tone === "income" ? item.income : item.expense;

    return {
      amount,
      hour: item.hour,
      value: canonicalDecimalToCents(amount)
    };
  });
}

function canonicalDecimalToCents(value: string) {
  const [integerPart = "0", decimalPart = ""] = value.split(".");
  const cents = BigInt(
    `${integerPart.replace(/\D/g, "") || "0"}${decimalPart.replace(/\D/g, "").slice(0, 2).padEnd(2, "0")}`
  );
  const maxChartValue = 1000000000n;

  return Number(cents > maxChartValue ? maxChartValue : cents);
}

const emptyHourlySummary = Array.from({ length: 24 }, (_, hour) => ({
  expense: "0.00",
  hour: String(hour).padStart(2, "0"),
  income: "0.00"
}));
