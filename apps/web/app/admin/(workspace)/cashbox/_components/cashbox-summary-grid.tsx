"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { CurrencyDto } from "../../currencies/_types/currencies.types";
import type { CashboxSummaryDto } from "../_types/cashbox.types";
import { formatCanonicalMoney } from "../_utils/local-decimal";

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
    <section className="grid shrink-0 gap-2 md:gap-3">
      <CashboxBalanceCard
        currencies={currencies}
        currencyCode={currencyCode}
        loading={loading}
        summary={summary}
        onCurrencyChange={onCurrencyChange}
      />
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
