import { BadRequestException, Injectable } from "@nestjs/common";
import { CashboxMovementType, Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(tenantId: string) {
    const context = await this.getTenantDayContext(tenantId);
    const [
      activeCasesCount,
      incomeToday,
      expenseToday,
      positiveBalance,
      negativeBalance,
      tasksCount,
      paymentsCount
    ] = await Promise.all([
      this.prisma.case.count({
        where: { status: "open", tenantId }
      }),
      this.sumCashboxMovements(tenantId, context.currency.code, [CashboxMovementType.income], {
        gte: context.dayStart,
        lt: context.dayEnd
      }),
      this.sumCashboxMovements(tenantId, context.currency.code, [CashboxMovementType.expense], {
        gte: context.dayStart,
        lt: context.dayEnd
      }),
      this.sumCashboxMovements(
        tenantId,
        context.currency.code,
        [CashboxMovementType.income, CashboxMovementType.conversion_in],
        { lt: context.dayEnd }
      ),
      this.sumCashboxMovements(
        tenantId,
        context.currency.code,
        [CashboxMovementType.expense, CashboxMovementType.conversion_out],
        { lt: context.dayEnd }
      ),
      this.prisma.caseTask.count({
        where: {
          endDate: context.dateAsUtcDate,
          status: { in: ["pending", "in_progress"] },
          tenantId
        }
      }),
      this.prisma.caseExpense.count({
        where: {
          paymentDate: context.dateAsUtcDate,
          status: { in: ["pending", "overdue"] },
          tenantId
        }
      })
    ]);

    return {
      activeCasesCount,
      cashbox: {
        balance: decimalToString(positiveBalance.minus(negativeBalance)),
        currency: context.currency,
        date: context.date,
        expenseToday: decimalToString(expenseToday),
        incomeToday: decimalToString(incomeToday)
      },
      dueToday: {
        paymentsCount,
        tasksCount
      }
    };
  }

  private async getTenantDayContext(tenantId: string) {
    const settings = await this.prisma.tenantSettings.findUnique({
      where: { tenantId },
      select: { defaultCurrencyCode: true, timezone: true }
    });
    const timezone = settings?.timezone ?? "UTC";
    const date = formatDateInTimezone(new Date(), timezone);
    const currency = await this.resolveDashboardCurrency(tenantId, settings?.defaultCurrencyCode);
    const dayStart = zonedDateTimeToUtc(date, timezone);
    const dayEnd = zonedDateTimeToUtc(addDays(date, 1), timezone);

    return {
      currency,
      date,
      dateAsUtcDate: new Date(`${date}T00:00:00.000Z`),
      dayEnd,
      dayStart
    };
  }

  private async resolveDashboardCurrency(tenantId: string, defaultCurrencyCode?: string) {
    const tenantCurrency = defaultCurrencyCode
      ? await this.prisma.tenantCurrency.findFirst({
          where: { active: true, currencyCode: defaultCurrencyCode, tenantId },
          select: dashboardCurrencySelect
        })
      : await this.prisma.tenantCurrency.findFirst({
          where: { active: true, tenantId },
          orderBy: [{ currency: { name: "asc" } }, { id: "asc" }],
          select: dashboardCurrencySelect
        });

    if (!tenantCurrency) {
      throw new BadRequestException("La moneda no esta activa en este estudio.");
    }

    return {
      code: tenantCurrency.currency.code,
      name: tenantCurrency.currency.name,
      symbol: tenantCurrency.currency.symbol
    };
  }

  private async sumCashboxMovements(
    tenantId: string,
    currencyCode: string,
    types: CashboxMovementType[],
    occurredAt: Prisma.DateTimeFilter
  ) {
    const result = await this.prisma.cashboxMovement.aggregate({
      _sum: { amount: true },
      where: {
        currencyCode,
        occurredAt,
        tenantId,
        type: { in: types }
      }
    });

    return result._sum.amount ?? new Prisma.Decimal(0);
  }
}

const dashboardCurrencySelect = {
  currency: {
    select: {
      code: true,
      name: true,
      symbol: true
    }
  }
} satisfies Prisma.TenantCurrencySelect;

function decimalToString(decimal: Prisma.Decimal, decimals = 2) {
  return decimal.toFixed(decimals);
}

function formatDateInTimezone(date: Date, timezone: string) {
  const parts = getTimeZoneParts(date, timezone);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

function addDays(date: string, days: number) {
  const { day, month, year } = parseIsoDate(date);
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  return `${utc.getUTCFullYear()}-${pad(utc.getUTCMonth() + 1)}-${pad(utc.getUTCDate())}`;
}

function zonedDateTimeToUtc(date: string, timezone: string) {
  const { day, month, year } = parseIsoDate(date);
  const targetUtc = Date.UTC(year, month - 1, day, 0, 0, 0, 0);
  let utc = targetUtc;

  for (let iteration = 0; iteration < 2; iteration += 1) {
    const offset = getTimezoneOffsetMs(new Date(utc), timezone);
    utc = targetUtc - offset;
  }

  return new Date(utc);
}

function getTimezoneOffsetMs(date: Date, timezone: string) {
  const parts = getTimeZoneParts(date, timezone);
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );

  return asUtc - date.getTime();
}

function getTimeZoneParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone: timezone,
    year: "numeric"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    day: Number(values.day),
    hour: Number(values.hour === "24" ? "0" : values.hour),
    minute: Number(values.minute),
    month: Number(values.month),
    second: Number(values.second),
    year: Number(values.year)
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function parseIsoDate(date: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (!match) {
    throw new BadRequestException("La fecha del dashboard es invalida.");
  }

  return {
    day: Number(match[3]),
    month: Number(match[2]),
    year: Number(match[1])
  };
}
