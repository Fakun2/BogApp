import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { describe, it } from "node:test";
import { BadRequestException } from "@nestjs/common";
import { CashboxMovementType, Prisma } from "@prisma/client";
import {
  createCashboxConversionSchema,
  createCashboxMovementSchema
} from "../src/cashbox/cashbox.schemas";
import { CashboxService } from "../src/cashbox/cashbox.service";

const tenantId = "tenant-a";
const userId = "user-a";
const now = new Date("2026-08-12T15:00:00.000Z");

describe("CashboxService", () => {
  it("summarizes daily income, expenses and accumulated balance by tenant currency", async () => {
    const service = new CashboxService(
      createPrismaMock({
        aggregateSums: {
          expense,
          income,
          positiveBalance: "1500.00",
          negativeBalance: "300.00"
        },
        hourlyMovements: [
          { amount: "300.00", occurredAt: new Date("2026-08-12T12:15:00.000Z"), type: CashboxMovementType.income },
          { amount: "80.00", occurredAt: new Date("2026-08-12T12:45:00.000Z"), type: CashboxMovementType.expense }
        ]
      }) as never
    );

    const result = await service.summary(tenantId, { currencyCode: "ARS", date: "2026-08-12" });

    assert.equal(result.incomeToday, "1000.00");
    assert.equal(result.expenseToday, "200.00");
    assert.equal(result.balance, "1200.00");
    assert.equal(result.currency.code, "ARS");
    assert.equal(result.hourly.length, 24);
    assert.deepEqual(result.hourly[9], { expense: "80.00", hour: "09", income: "300.00" });
  });

  it("rejects movements in currencies that are not active for the tenant", async () => {
    const service = new CashboxService(createPrismaMock({ activeCurrency: false }) as never);

    await assert.rejects(
      () =>
        service.createMovement(tenantId, userId, {
          amount: "100.00",
          currencyCode: "USD",
          type: "income"
        }),
      BadRequestException
    );
  });

  it("normalizes local decimal strings before persisting movements", async () => {
    const createdMovements: Array<{ amount?: unknown; conversionGroupId?: string | null; type: CashboxMovementType }> = [];
    const service = new CashboxService(createPrismaMock({ createdMovements }) as never);

    const result = await service.createMovement(tenantId, userId, {
      amount: "1.234,56",
      currencyCode: "ARS",
      type: "income"
    });

    assert.equal(String(createdMovements[0]?.amount), "1234.56");
    assert.equal(result.amount, "1234.56");
  });

  it("rejects incompatible categories for movement type", async () => {
    const service = new CashboxService(
      createPrismaMock({ globalCategoryKind: "expense" }) as never
    );

    await assert.rejects(
      () =>
        service.createMovement(tenantId, userId, {
          amount: "100.00",
          category: { id: "11111111-1111-1111-1111-111111111111", origin: "global" },
          currencyCode: "ARS",
          type: "income"
        }),
      BadRequestException
    );
  });

  it("creates conversion as two linked movements using the manually supplied directional rate", async () => {
    const createdMovements: CreatedMovementRecord[] = [];
    const service = new CashboxService(
      createPrismaMock({
        aggregateSums: {
          expense: "0.00",
          income: "0.00",
          negativeBalance: "0.00",
          positiveBalance: "100.00"
        },
        createdMovements
      }) as never
    );

    const result = await service.createConversion(tenantId, userId, {
      quoteBaseCurrencyCode: "USD",
      quoteCounterCurrencyCode: "ARS",
      quoteRate: "1.350,00000000",
      fromAmount: "100,00",
      fromCurrencyCode: "USD",
      toCurrencyCode: "ARS"
    });

    assert.equal(result.items.length, 2);
    assert.deepEqual(
      createdMovements.map((movement) => movement.type),
      [CashboxMovementType.conversion_out, CashboxMovementType.conversion_in]
    );
    assert.ok(createdMovements[0]?.conversionGroupId);
    assert.equal(createdMovements[0]?.conversionGroupId, createdMovements[1]?.conversionGroupId);
    assert.equal(String(createdMovements[0]?.amount), "100");
    assert.equal(String(createdMovements[1]?.amount), "135000");
    assert.equal(String(createdMovements[0]?.exchangeRate), "1350");
    assert.equal(String(createdMovements[1]?.exchangeRate), "1350");
  });

  it("converts ARS to USD using a natural USD quoted in ARS rate", async () => {
    const createdMovements: CreatedMovementRecord[] = [];
    const service = new CashboxService(
      createPrismaMock({
        aggregateSums: {
          expense: "0.00",
          income: "0.00",
          negativeBalance: "0.00",
          positiveBalance: "150000.00"
        },
        createdMovements
      }) as never
    );

    const result = await service.createConversion(tenantId, userId, {
      fromAmount: "150.000,00",
      fromCurrencyCode: "ARS",
      quoteBaseCurrencyCode: "USD",
      quoteCounterCurrencyCode: "ARS",
      quoteRate: "1.500,00000000",
      toCurrencyCode: "USD"
    });

    assert.equal(result.items.length, 2);
    assert.equal(String(createdMovements[0]?.amount), "150000");
    assert.equal(String(createdMovements[1]?.amount), "100");
    assert.ok(String(createdMovements[0]?.exchangeRate).startsWith("0.000666666"));
  });

  it("rejects conversions when origin amount is greater than current balance", async () => {
    const service = new CashboxService(
      createPrismaMock({
        aggregateSums: {
          expense: "0.00",
          income: "0.00",
          negativeBalance: "0.00",
          positiveBalance: "999.99"
        }
      }) as never
    );

    await assert.rejects(
      () =>
        service.createConversion(tenantId, userId, {
          fromAmount: "1.000,00",
          fromCurrencyCode: "USD",
          quoteBaseCurrencyCode: "USD",
          quoteCounterCurrencyCode: "ARS",
          quoteRate: "1.350,00000000",
          toCurrencyCode: "ARS"
        }),
      BadRequestException
    );
  });

  it("allows conversions when origin amount is equal to current balance", async () => {
    const createdMovements: CreatedMovementRecord[] = [];
    const service = new CashboxService(
      createPrismaMock({
        aggregateSums: {
          expense: "0.00",
          income: "0.00",
          negativeBalance: "0.00",
          positiveBalance: "1000.00"
        },
        createdMovements
      }) as never
    );

    const result = await service.createConversion(tenantId, userId, {
      fromAmount: "1.000,00",
      fromCurrencyCode: "USD",
      quoteBaseCurrencyCode: "USD",
      quoteCounterCurrencyCode: "ARS",
      quoteRate: "1.350,00000000",
      toCurrencyCode: "ARS"
    });

    assert.equal(result.items.length, 2);
    assert.equal(String(createdMovements[0]?.amount), "1000");
  });

  it("updates editable income and expense movements", async () => {
    const updatedMovements: Array<{ amount?: unknown; categoryId?: string | null; categoryOrigin?: string | null }> = [];
    const service = new CashboxService(createPrismaMock({ updatedMovements }) as never);

    const result = await service.updateMovement(tenantId, "22222222-2222-2222-2222-222222222222", {
      amount: "2.500,50",
      category: null,
      description: "Pago corregido"
    });

    assert.equal(String(updatedMovements[0]?.amount), "2500.5");
    assert.equal(updatedMovements[0]?.categoryId, null);
    assert.equal(updatedMovements[0]?.categoryOrigin, null);
    assert.equal(result.amount, "2500.50");
  });

  it("deletes editable income and expense movements", async () => {
    const deletedMovementIds: string[] = [];
    const service = new CashboxService(createPrismaMock({ deletedMovementIds }) as never);

    const result = await service.deleteMovement(tenantId, "22222222-2222-2222-2222-222222222222");

    assert.equal(result.id, "22222222-2222-2222-2222-222222222222");
    assert.deepEqual(deletedMovementIds, ["22222222-2222-2222-2222-222222222222"]);
  });

  it("rejects editing conversion movements", async () => {
    const service = new CashboxService(
      createPrismaMock({ editableMovementType: CashboxMovementType.conversion_in }) as never
    );

    await assert.rejects(
      () =>
        service.updateMovement(tenantId, "22222222-2222-2222-2222-222222222222", {
          amount: "1.000,00"
        }),
      BadRequestException
    );
  });

  it("validates local decimal request formats", () => {
    assert.equal(createCashboxMovementSchema.safeParse({ amount: "1.234,56", currencyCode: "ARS", type: "income" }).success, true);
    assert.equal(createCashboxMovementSchema.safeParse({ amount: "0,01", currencyCode: "ARS", type: "income" }).success, true);
    assert.equal(createCashboxMovementSchema.safeParse({ amount: "1.234,567", currencyCode: "ARS", type: "income" }).success, false);
    assert.equal(createCashboxMovementSchema.safeParse({ amount: "1.00", currencyCode: "ARS", type: "income" }).success, false);
    assert.equal(createCashboxMovementSchema.safeParse({ amount: "-1", currencyCode: "ARS", type: "income" }).success, false);
    assert.equal(createCashboxMovementSchema.safeParse({ amount: "abc", currencyCode: "ARS", type: "income" }).success, false);
    assert.equal(createCashboxMovementSchema.safeParse({ amount: "0", currencyCode: "ARS", type: "income" }).success, false);
    assert.equal(createCashboxMovementSchema.safeParse({ amount: 100, currencyCode: "ARS", type: "income" }).success, false);
    assert.equal(
      createCashboxConversionSchema.safeParse({
        fromAmount: "1.000,00",
        fromCurrencyCode: "usd",
        quoteBaseCurrencyCode: "usd",
        quoteCounterCurrencyCode: "ars",
        quoteRate: "1.350,12345678",
        toCurrencyCode: "ars"
      }).success,
      true
    );
    assert.equal(
      createCashboxConversionSchema.safeParse({
        fromAmount: "1.000,00",
        fromCurrencyCode: "USD",
        quoteBaseCurrencyCode: "USD",
        quoteCounterCurrencyCode: "ARS",
        quoteRate: "1.350,12345678",
        toCurrencyCode: "USD"
      }).success,
      false
    );
    assert.equal(
      createCashboxConversionSchema.safeParse({
        fromAmount: "1.000,00",
        fromCurrencyCode: "USD",
        quoteBaseCurrencyCode: "USD",
        quoteCounterCurrencyCode: "ARS",
        quoteRate: "1.350,123456789",
        toCurrencyCode: "ARS"
      }).success,
      false
    );
    assert.equal(
      createCashboxConversionSchema.safeParse({
        fromAmount: "1.000,00",
        fromCurrencyCode: "USD",
        quoteBaseCurrencyCode: "EUR",
        quoteCounterCurrencyCode: "ARS",
        quoteRate: "1.350,12345678",
        toCurrencyCode: "ARS"
      }).success,
      false
    );
  });
});

const income = "1000.00";
const expense = "200.00";

type CreatedMovementRecord = {
  amount?: unknown;
  conversionGroupId?: string | null;
  exchangeRate?: unknown;
  type: CashboxMovementType;
};

function createPrismaMock({
  activeCurrency = true,
  aggregateSums = {
    expense,
    income,
    negativeBalance: expense,
    positiveBalance: income
  },
  createdMovements = [],
  deletedMovementIds = [],
  editableMovementType = CashboxMovementType.income,
  globalCategoryKind = "both",
  hourlyMovements = [],
  updatedMovements = []
}: {
  activeCurrency?: boolean;
  aggregateSums?: {
    expense: string;
    income: string;
    negativeBalance: string;
    positiveBalance: string;
  };
  createdMovements?: CreatedMovementRecord[];
  deletedMovementIds?: string[];
  editableMovementType?: CashboxMovementType;
  globalCategoryKind?: "income" | "expense" | "both";
  hourlyMovements?: Array<{ amount: string; occurredAt: Date; type: CashboxMovementType }>;
  updatedMovements?: Array<{ amount?: unknown; categoryId?: string | null; categoryOrigin?: string | null }>;
}) {
  return {
    $transaction: async (operations: Array<Promise<unknown>>) => Promise.all(operations),
    $queryRaw: async () => buildHourlyRows(hourlyMovements),
    cashboxMovement: {
      aggregate: async ({ where }: { where: { occurredAt?: { gte?: Date; lt?: Date; lte?: Date }; type?: { in?: CashboxMovementType[] } } }) => {
        const types = where.type?.in ?? [];
        const isBalanceSum = Boolean(where.occurredAt?.lte || (where.occurredAt?.lt && !where.occurredAt.gte));
        const value = isBalanceSum
          ? types.includes(CashboxMovementType.income)
            ? aggregateSums.positiveBalance
            : aggregateSums.negativeBalance
          : types.includes(CashboxMovementType.income)
            ? aggregateSums.income
            : aggregateSums.expense;
        return { _sum: { amount: new Prisma.Decimal(value) } };
      },
      create: async ({ data }: { data: CreatedMovementRecord }) => {
        createdMovements.push({
          amount: data.amount,
          conversionGroupId: data.conversionGroupId,
          exchangeRate: data.exchangeRate,
          type: data.type
        });
        return createMovement({
          amount: String((data as { amount?: unknown }).amount ?? "100.00"),
          conversionGroupId: data.conversionGroupId,
          exchangeRate: data.exchangeRate,
          type: data.type
        });
      },
      delete: async ({ where }: { where: { id: string } }) => {
        deletedMovementIds.push(where.id);
        return { id: where.id };
      },
      findFirst: async ({ where }: { where: { id?: string; tenantId?: string } }) =>
        where.id && where.tenantId
          ? {
              id: where.id,
              type: editableMovementType
            }
          : null,
      findMany: async () => [],
      update: async ({ data }: { data: { amount?: unknown; categoryId?: string | null; categoryOrigin?: string | null } }) => {
        updatedMovements.push(data);
        return createMovement({
          amount: String(data.amount ?? "100.00"),
          type: editableMovementType
        });
      }
    },
    globalFinanceCategory: {
      findFirst: async () => ({ kind: globalCategoryKind }),
      findMany: async () => []
    },
    tenantCurrency: {
      findFirst: async () =>
        activeCurrency
          ? {
              currency: {
                code: "ARS",
                name: "Peso argentino",
                symbol: "$"
              }
            }
          : null
    },
    tenantFinanceCategory: {
      findMany: async () => []
    },
    tenantSettings: {
      findUnique: async () => ({
        defaultCurrencyCode: "ARS",
        timezone: "America/Argentina/Buenos_Aires"
      })
    }
  };
}

function buildHourlyRows(
  hourlyMovements: Array<{ amount: string; occurredAt: Date; type: CashboxMovementType }>
) {
  const rows = new Map<number, { expense: Prisma.Decimal; hour: number; income: Prisma.Decimal }>();

  for (const movement of hourlyMovements) {
    const hour = Number(
      new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        hour12: false,
        timeZone: "America/Argentina/Buenos_Aires"
      }).format(movement.occurredAt)
    );
    const row = rows.get(hour) ?? {
      expense: new Prisma.Decimal(0),
      hour,
      income: new Prisma.Decimal(0)
    };

    if (movement.type === CashboxMovementType.income) {
      row.income = row.income.plus(movement.amount);
    } else if (movement.type === CashboxMovementType.expense) {
      row.expense = row.expense.plus(movement.amount);
    }

    rows.set(hour, row);
  }

  return [...rows.values()];
}

function createMovement({
  amount,
  conversionGroupId = null,
  exchangeRate = null,
  type
}: {
  amount: string;
  conversionGroupId?: string | null;
  exchangeRate?: unknown;
  type: CashboxMovementType;
}) {
  return {
    amount: new Prisma.Decimal(amount),
    categoryId: null,
    categoryOrigin: null,
    conversionGroupId,
    createdByUser: { fullName: "Usuario Test" },
    currency: { symbol: "$" },
    currencyCode: "ARS",
    description: null,
    exchangeRate: exchangeRate ? new Prisma.Decimal(String(exchangeRate)) : null,
    id: randomUUID(),
    occurredAt: now,
    type
  };
}
