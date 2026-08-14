import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CashboxMovementType, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { PrismaService } from "../database/prisma.service";
import type {
  CashboxSummaryQuery,
  CreateCashboxConversionInput,
  CreateCashboxMovementInput,
  ListCashboxMovementsQuery,
  UpdateCashboxMovementInput
} from "./cashbox.schemas";

@Injectable()
export class CashboxService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(tenantId: string, query: CashboxSummaryQuery) {
    const context = await this.getCashboxContext(tenantId, query.currencyCode, query.date);
    const [incomeToday, expenseToday, positiveBalance, negativeBalance, hourly] = await Promise.all([
      this.sumMovements(tenantId, context.currency.code, [CashboxMovementType.income], {
        gte: context.dayStart,
        lt: context.dayEnd
      }),
      this.sumMovements(tenantId, context.currency.code, [CashboxMovementType.expense], {
        gte: context.dayStart,
        lt: context.dayEnd
      }),
      this.sumMovements(
        tenantId,
        context.currency.code,
        [CashboxMovementType.income, CashboxMovementType.conversion_in],
        { lt: context.dayEnd }
      ),
      this.sumMovements(
        tenantId,
        context.currency.code,
        [CashboxMovementType.expense, CashboxMovementType.conversion_out],
        { lt: context.dayEnd }
      ),
      this.getHourlySummary(
        tenantId,
        context.currency.code,
        context.dayStart,
        context.dayEnd,
        context.timezone
      )
    ]);

    return {
      balance: decimalToString(positiveBalance.minus(negativeBalance)),
      currency: context.currency,
      date: context.date,
      expenseToday: decimalToString(expenseToday),
      hourly,
      incomeToday: decimalToString(incomeToday)
    };
  }

  async listMovements(tenantId: string, query: ListCashboxMovementsQuery) {
    const context = await this.getCashboxContext(tenantId, query.currencyCode, query.date);
    const cursor = decodeCashboxCursor(query.cursor);
    const items = await this.prisma.cashboxMovement.findMany({
      where: {
        tenantId,
        currencyCode: context.currency.code,
        occurredAt: {
          gte: context.dayStart,
          lt: context.dayEnd
        },
        ...(cursor ? { OR: getCursorWhere(cursor) } : {})
      },
      orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
      take: query.limit + 1,
      select: cashboxMovementSelect
    });
    const hasNextPage = items.length > query.limit;
    const pageItems = hasNextPage ? items.slice(0, query.limit) : items;
    const categoryNames = await this.getCategoryNames(tenantId, pageItems);

    return {
      items: pageItems.map((movement) => toCashboxMovementDto(movement, categoryNames)),
      pageInfo: {
        hasNextPage,
        limit: query.limit,
        nextCursor: hasNextPage ? encodeCashboxCursor(pageItems.at(-1)) : null
      }
    };
  }

  async createMovement(tenantId: string, userId: string, input: CreateCashboxMovementInput) {
    await this.assertTenantCurrencyActive(tenantId, input.currencyCode);

    if (input.category) {
      await this.assertCategoryAllowed(tenantId, input.category, input.type);
    }

    const movement = await this.prisma.cashboxMovement.create({
      data: {
        amount: parseLocalDecimal(input.amount),
        categoryId: input.category?.id,
        categoryOrigin: input.category?.origin,
        createdByUserId: userId,
        currencyCode: input.currencyCode,
        description: input.description,
        occurredAt: input.occurredAt ?? new Date(),
        tenantId,
        type: input.type
      },
      select: cashboxMovementSelect
    });
    const categoryNames = await this.getCategoryNames(tenantId, [movement]);

    return toCashboxMovementDto(movement, categoryNames);
  }

  async createConversion(
    tenantId: string,
    userId: string,
    input: CreateCashboxConversionInput
  ) {
    if (input.fromCurrencyCode === input.toCurrencyCode) {
      throw new BadRequestException("Las monedas de origen y destino deben ser distintas.");
    }

    await Promise.all([
      this.assertTenantCurrencyActive(tenantId, input.fromCurrencyCode),
      this.assertTenantCurrencyActive(tenantId, input.toCurrencyCode)
    ]);

    const conversionGroupId = randomUUID();
    const occurredAt = input.occurredAt ?? new Date();
    const fromAmount = parseLocalDecimal(input.fromAmount);
    const exchangeRate = getEffectiveExchangeRate(input);
    const currentBalance = await this.getCurrentBalance(tenantId, input.fromCurrencyCode, new Date());

    if (fromAmount.gt(currentBalance)) {
      throw new BadRequestException("El monto a convertir supera el saldo disponible de la moneda origen.");
    }

    const toAmount = fromAmount.mul(exchangeRate).toDecimalPlaces(2);

    const items = await this.prisma.$transaction([
      this.prisma.cashboxMovement.create({
        data: {
          amount: fromAmount,
          conversionGroupId,
          createdByUserId: userId,
          currencyCode: input.fromCurrencyCode,
          description: input.description,
          exchangeRate,
          occurredAt,
          tenantId,
          type: CashboxMovementType.conversion_out
        },
        select: cashboxMovementSelect
      }),
      this.prisma.cashboxMovement.create({
        data: {
          amount: toAmount,
          conversionGroupId,
          createdByUserId: userId,
          currencyCode: input.toCurrencyCode,
          description: input.description,
          exchangeRate,
          occurredAt,
          tenantId,
          type: CashboxMovementType.conversion_in
        },
        select: cashboxMovementSelect
      })
    ]);

    return {
      items: items.map((movement) => toCashboxMovementDto(movement, new Map()))
    };
  }

  async updateMovement(
    tenantId: string,
    movementId: string,
    input: UpdateCashboxMovementInput
  ) {
    const existingMovement = await this.findEditableMovement(tenantId, movementId);

    if (input.category) {
      await this.assertCategoryAllowed(tenantId, input.category, existingMovement.type);
    }

    const movement = await this.prisma.cashboxMovement.update({
      where: { id: existingMovement.id },
      data: {
        ...(input.amount ? { amount: parseLocalDecimal(input.amount) } : {}),
        ...(input.category === null
          ? { categoryId: null, categoryOrigin: null }
          : input.category
            ? { categoryId: input.category.id, categoryOrigin: input.category.origin }
            : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.occurredAt ? { occurredAt: input.occurredAt } : {})
      },
      select: cashboxMovementSelect
    });
    const categoryNames = await this.getCategoryNames(tenantId, [movement]);

    return toCashboxMovementDto(movement, categoryNames);
  }

  async deleteMovement(tenantId: string, movementId: string) {
    const existingMovement = await this.findEditableMovement(tenantId, movementId);

    await this.prisma.cashboxMovement.delete({
      where: { id: existingMovement.id }
    });

    return { id: existingMovement.id };
  }

  private async getCashboxContext(tenantId: string, currencyCode?: string, date?: string) {
    const settings = await this.prisma.tenantSettings.findUnique({
      where: { tenantId },
      select: { defaultCurrencyCode: true, timezone: true }
    });
    const timezone = settings?.timezone ?? "UTC";
    const selectedDate = date ?? formatDateInTimezone(new Date(), timezone);
    const currency = await this.resolveActiveCurrency(
      tenantId,
      currencyCode ?? settings?.defaultCurrencyCode
    );
    const dayStart = zonedDateTimeToUtc(selectedDate, timezone);
    const dayEnd = zonedDateTimeToUtc(addDays(selectedDate, 1), timezone);

    return {
      currency,
      date: selectedDate,
      dayEnd,
      dayStart,
      timezone
    };
  }

  private async resolveActiveCurrency(tenantId: string, currencyCode?: string) {
    const tenantCurrency = currencyCode
      ? await this.prisma.tenantCurrency.findFirst({
          where: { active: true, currencyCode, tenantId },
          select: activeTenantCurrencySelect
        })
      : await this.prisma.tenantCurrency.findFirst({
          where: { active: true, tenantId },
          orderBy: [{ currency: { name: "asc" } }, { id: "asc" }],
          select: activeTenantCurrencySelect
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

  private async assertTenantCurrencyActive(tenantId: string, currencyCode: string) {
    await this.resolveActiveCurrency(tenantId, currencyCode);
  }

  private async assertCategoryAllowed(
    tenantId: string,
    category: { id: string; origin: "global" | "tenant" },
    movementType: "income" | "expense"
  ) {
    const categoryKind =
      category.origin === "global"
        ? await this.prisma.globalFinanceCategory.findFirst({
            where: { active: true, id: category.id },
            select: { kind: true }
          })
        : await this.prisma.tenantFinanceCategory.findFirst({
            where: { active: true, id: category.id, tenantId },
            select: { kind: true }
          });

    if (!categoryKind) {
      throw new NotFoundException("La categoria no existe o no esta activa.");
    }

    if (categoryKind.kind !== "both" && categoryKind.kind !== movementType) {
      throw new BadRequestException("La categoria no es compatible con el movimiento.");
    }
  }

  private async findEditableMovement(tenantId: string, movementId: string) {
    const movement = await this.prisma.cashboxMovement.findFirst({
      where: { id: movementId, tenantId },
      select: {
        id: true,
        type: true
      }
    });

    if (!movement) {
      throw new NotFoundException("El movimiento de caja no existe en este estudio.");
    }

    if (
      movement.type === CashboxMovementType.conversion_in ||
      movement.type === CashboxMovementType.conversion_out
    ) {
      throw new BadRequestException("Las conversiones no se editan desde acciones de movimiento.");
    }

    return movement as { id: string; type: "income" | "expense" };
  }

  private async getCategoryNames(
    tenantId: string,
    movements: Array<CashboxMovementWithSelect>
  ) {
    const globalIds = movements
      .filter((movement) => movement.categoryOrigin === "global" && movement.categoryId)
      .map((movement) => movement.categoryId as string);
    const tenantIds = movements
      .filter((movement) => movement.categoryOrigin === "tenant" && movement.categoryId)
      .map((movement) => movement.categoryId as string);
    const [globalCategories, tenantCategories] = await Promise.all([
      globalIds.length
        ? this.prisma.globalFinanceCategory.findMany({
            where: { id: { in: globalIds } },
            select: { id: true, name: true }
          })
        : Promise.resolve([]),
      tenantIds.length
        ? this.prisma.tenantFinanceCategory.findMany({
            where: { id: { in: tenantIds }, tenantId },
            select: { id: true, name: true }
          })
        : Promise.resolve([])
    ]);

    return new Map([
      ...globalCategories.map((category) => [`global:${category.id}`, category.name] as const),
      ...tenantCategories.map((category) => [`tenant:${category.id}`, category.name] as const)
    ]);
  }

  private async sumMovements(
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

  private async getCurrentBalance(tenantId: string, currencyCode: string, now: Date) {
    const [positiveBalance, negativeBalance] = await Promise.all([
      this.sumMovements(
        tenantId,
        currencyCode,
        [CashboxMovementType.income, CashboxMovementType.conversion_in],
        { lte: now }
      ),
      this.sumMovements(
        tenantId,
        currencyCode,
        [CashboxMovementType.expense, CashboxMovementType.conversion_out],
        { lte: now }
      )
    ]);

    return positiveBalance.minus(negativeBalance);
  }

  private async getHourlySummary(
    tenantId: string,
    currencyCode: string,
    dayStart: Date,
    dayEnd: Date,
    timezone: string
  ) {
    const buckets = Array.from({ length: 24 }, (_, hour) => ({
      expense: new Prisma.Decimal(0),
      hour: pad(hour),
      income: new Prisma.Decimal(0)
    }));
    const rows = await this.prisma.$queryRaw<
      Array<{ expense: Prisma.Decimal | null; hour: number; income: Prisma.Decimal | null }>
    >`
      SELECT
        EXTRACT(HOUR FROM occurred_at AT TIME ZONE ${timezone})::int AS hour,
        COALESCE(SUM(CASE WHEN type::text = 'income' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type::text = 'expense' THEN amount ELSE 0 END), 0) AS expense
      FROM cashbox_movements
      WHERE tenant_id = ${tenantId}::uuid
        AND currency_code = ${currencyCode}
        AND occurred_at >= ${dayStart}
        AND occurred_at < ${dayEnd}
        AND type::text IN ('income', 'expense')
      GROUP BY hour
    `;

    for (const row of rows) {
      const bucket = buckets[row.hour];

      if (!bucket) {
        continue;
      }

      bucket.income = row.income ?? new Prisma.Decimal(0);
      bucket.expense = row.expense ?? new Prisma.Decimal(0);
    }

    return buckets.map((bucket) => ({
      expense: decimalToString(bucket.expense),
      hour: bucket.hour,
      income: decimalToString(bucket.income)
    }));
  }
}

const activeTenantCurrencySelect = {
  currency: {
    select: {
      code: true,
      name: true,
      symbol: true
    }
  }
} satisfies Prisma.TenantCurrencySelect;

const cashboxMovementSelect = {
  amount: true,
  categoryId: true,
  categoryOrigin: true,
  conversionGroupId: true,
  createdByUser: {
    select: { fullName: true }
  },
  currency: {
    select: { symbol: true }
  },
  currencyCode: true,
  description: true,
  exchangeRate: true,
  id: true,
  occurredAt: true,
  type: true
} satisfies Prisma.CashboxMovementSelect;

type CashboxMovementWithSelect = Prisma.CashboxMovementGetPayload<{
  select: typeof cashboxMovementSelect;
}>;

type CashboxCursor = {
  id: string;
  occurredAt: string;
};

function toCashboxMovementDto(
  movement: CashboxMovementWithSelect,
  categoryNames: Map<string, string>
) {
  const categoryKey =
    movement.categoryOrigin && movement.categoryId
      ? `${movement.categoryOrigin}:${movement.categoryId}`
      : null;

  return {
    amount: decimalToString(movement.amount),
    categoryId: movement.categoryId ?? undefined,
    categoryName: categoryKey ? categoryNames.get(categoryKey) : undefined,
    categoryOrigin: movement.categoryOrigin as "global" | "tenant" | undefined,
    conversionGroupId: movement.conversionGroupId ?? undefined,
    createdByName: movement.createdByUser.fullName,
    currencyCode: movement.currencyCode,
    currencySymbol: movement.currency.symbol,
    description: movement.description ?? undefined,
    exchangeRate: movement.exchangeRate ? decimalToString(movement.exchangeRate, 8) : undefined,
    id: movement.id,
    occurredAt: movement.occurredAt,
    type: movement.type
  };
}

function encodeCashboxCursor(movement: CashboxMovementWithSelect | undefined) {
  if (!movement) {
    return null;
  }

  const cursor: CashboxCursor = {
    id: movement.id,
    occurredAt: movement.occurredAt.toISOString()
  };

  return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}

function decodeCashboxCursor(cursor?: string): CashboxCursor | null {
  if (!cursor) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as Partial<
      CashboxCursor
    >;

    if (typeof parsed.id !== "string" || typeof parsed.occurredAt !== "string") {
      throw new Error("Invalid cursor");
    }

    return { id: parsed.id, occurredAt: parsed.occurredAt };
  } catch {
    throw new BadRequestException("El cursor de caja es invalido.");
  }
}

function getCursorWhere(cursor: CashboxCursor): Prisma.CashboxMovementWhereInput[] {
  const occurredAt = new Date(cursor.occurredAt);

  if (Number.isNaN(occurredAt.getTime())) {
    throw new BadRequestException("El cursor de caja es invalido.");
  }

  return [
    { occurredAt: { lt: occurredAt } },
    { occurredAt, id: { lt: cursor.id } }
  ];
}

function decimalToString(decimal: Prisma.Decimal, decimals = 2) {
  return decimal.toFixed(decimals);
}

function parseLocalDecimal(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  return new Prisma.Decimal(normalized);
}

function getEffectiveExchangeRate(input: CreateCashboxConversionInput) {
  const quoteRate = parseLocalDecimal(input.quoteRate);

  if (
    input.quoteBaseCurrencyCode === input.fromCurrencyCode &&
    input.quoteCounterCurrencyCode === input.toCurrencyCode
  ) {
    return quoteRate;
  }

  if (
    input.quoteBaseCurrencyCode === input.toCurrencyCode &&
    input.quoteCounterCurrencyCode === input.fromCurrencyCode
  ) {
    return new Prisma.Decimal(1).div(quoteRate);
  }

  throw new BadRequestException("La cotizacion debe corresponder al par de monedas convertido.");
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
    throw new BadRequestException("La fecha de caja es invalida.");
  }

  return {
    day: Number(match[3]),
    month: Number(match[2]),
    year: Number(match[1])
  };
}
