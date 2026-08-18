"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { Bar, BarChart, Tooltip, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { CurrencyDto } from "../../currencies/_types/currencies.types";
import type { CashboxFlowMetricTone, CashboxSummaryDto } from "../_types/cashbox.types";
import { buildCashboxMetricChartData } from "../_utils/cashbox-chart";
import { formatCanonicalMoney } from "../_utils/local-decimal";

const cashboxMetricChartConfig = {
  amount: {
    label: "Monto"
  }
} satisfies ChartConfig;

export function CashboxSummaryGrid({
  currencies,
  currencyCode,
  loading,
  summary,
  onCurrencyChange
}: {
  currencies: CurrencyDto[];
  currencyCode?: string;
  loading: boolean;
  summary: CashboxSummaryDto | undefined;
  onCurrencyChange: (currencyCode: string) => void;
}) {
  return (
    <section className="grid shrink-0 gap-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.75fr)] md:gap-3">
      <CashboxBalanceCard
        currencies={currencies}
        currencyCode={currencyCode}
        loading={loading}
        summary={summary}
        onCurrencyChange={onCurrencyChange}
      />
      <div className="grid min-h-[208px] gap-2 md:gap-3">
        <CashboxFlowMetricCard
          amount={summary?.incomeToday}
          hourly={summary?.hourly}
          loading={loading}
          symbol={summary?.currency.symbol}
          title="Ingresos Hoy"
          tone="income"
        />
        <CashboxFlowMetricCard
          amount={summary?.expenseToday}
          hourly={summary?.hourly}
          loading={loading}
          symbol={summary?.currency.symbol}
          title="Egresos Hoy"
          tone="expense"
        />
      </div>
    </section>
  );
}

function CashboxBalanceCard({
  currencies,
  currencyCode,
  loading,
  summary,
  onCurrencyChange
}: {
  currencies: CurrencyDto[];
  currencyCode?: string;
  loading: boolean;
  summary: CashboxSummaryDto | undefined;
  onCurrencyChange: (currencyCode: string) => void;
}) {
  const [visible, setVisible] = useState(true);
  const selectedCode = currencyCode ?? summary?.currency.code ?? "";
  const balance = formatCanonicalMoney(summary?.balance, summary?.currency.symbol);
  const showSkeleton = loading && !summary;

  return (
    <Card
      data-admin-surface
      className="relative min-h-[180px] overflow-hidden rounded-[8px] border-border/35 bg-[color-mix(in_oklab,var(--card)_86%,var(--background))] shadow-[var(--admin-card-shadow)]"
    >
      <div className="absolute bottom-0 right-0 h-[42%] w-[38%] rounded-tl-[8px] bg-[color-mix(in_oklab,var(--primary)_10%,var(--muted)_70%)] opacity-80" />
      <CardContent className="relative flex h-full min-h-[180px] flex-col justify-between p-4 md:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground md:text-sm">
              Balance total disponible
            </p>
            <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2.5">
              {showSkeleton ? (
                <Skeleton className="h-9 w-44 md:h-10 md:w-56" />
              ) : (
                <p className="text-3xl font-semibold leading-none text-foreground md:text-4xl">
                  {visible ? balance : "$ ****"}
                </p>
              )}
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-[8px] border border-border/40 bg-secondary/70 text-foreground hover:bg-secondary"
                onClick={() => setVisible((current) => !current)}
                aria-label={visible ? "Ocultar balance" : "Mostrar balance"}
              >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Select value={selectedCode} onValueChange={onCurrencyChange}>
            <SelectTrigger className="h-10 w-[112px] rounded-[8px] border-border/45 bg-secondary/70 px-3 text-sm font-semibold text-foreground">
              <SelectValue placeholder="Moneda" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {showSkeleton ? (
            <Skeleton className="h-4 w-28" />
          ) : summary?.currency.code ? (
            `Caja en ${summary.currency.code}`
          ) : (
            "Selecciona una moneda"
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CashboxFlowMetricCard({
  amount,
  hourly,
  loading,
  symbol,
  title,
  tone
}: {
  amount?: string;
  hourly?: CashboxSummaryDto["hourly"];
  loading: boolean;
  symbol?: string;
  title: string;
  tone: CashboxFlowMetricTone;
}) {
  const Icon = tone === "income" ? ArrowUpRight : ArrowDownLeft;
  const accentClassName =
    tone === "income" ? "bg-primary text-primary-foreground" : "bg-destructive text-white";
  const strokeColor = tone === "income" ? "var(--primary)" : "var(--destructive)";
  const chartData = useMemo(() => buildCashboxMetricChartData(hourly, tone), [hourly, tone]);
  const showSkeleton = loading && !amount;

  return (
    <Card
      data-admin-surface
      className="min-h-[98px] overflow-hidden rounded-[8px] border-border/35 bg-card shadow-[var(--admin-card-shadow)]"
    >
      <CardContent className="grid h-full grid-cols-[1fr_auto] gap-x-3 gap-y-1.5 p-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground md:text-base">{title}</p>
          {showSkeleton ? (
            <Skeleton className="mt-2 h-6 w-28" />
          ) : (
            <p className="mt-1 text-xl font-semibold text-foreground">
              {formatCanonicalMoney(amount, symbol)}
            </p>
          )}
        </div>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-[8px] ${accentClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="col-span-2 h-14">
          {showSkeleton ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ChartContainer config={cashboxMetricChartConfig} className="h-full w-full">
              <BarChart data={chartData} margin={{ bottom: 0, left: 0, right: 0, top: 3 }}>
                <XAxis
                  axisLine={false}
                  dataKey="hour"
                  interval={3}
                  tickLine={false}
                  tickMargin={3}
                  tick={{ fill: "currentColor", fontSize: 10 }}
                  className="text-muted-foreground"
                />
                <Tooltip
                  content={<CashboxMetricTooltip symbol={symbol} title={title} />}
                  cursor={{ fill: "color-mix(in oklab, var(--muted) 45%, transparent)" }}
                />
                <Bar
                  dataKey="value"
                  fill={strokeColor}
                  isAnimationActive={false}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CashboxMetricTooltip({
  active,
  payload,
  symbol,
  title
}: {
  active?: boolean;
  payload?: Array<{ payload?: { amount: string; hour: string } }>;
  symbol?: string;
  title: string;
}) {
  const item = payload?.[0]?.payload;

  if (!active || !item) {
    return null;
  }

  return (
    <div className="rounded-[8px] border border-border/40 bg-popover px-3 py-2 text-xs shadow-[var(--admin-card-shadow)]">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-muted-foreground">{item.hour}:00 hs</p>
      <p className="mt-1 font-semibold text-foreground">
        {formatCanonicalMoney(item.amount, symbol)}
      </p>
    </div>
  );
}
