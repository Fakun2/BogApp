import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { CashboxMovementType, Prisma } from "@prisma/client";
import { DashboardService } from "../src/dashboard/dashboard.service";

const tenantId = "11111111-1111-4111-8111-111111111111";

describe("DashboardService", () => {
  afterEach(() => {
    mock.timers.reset();
  });

  it("aggregates tenant-scoped dashboard metrics using the tenant timezone", async () => {
    mock.timers.enable({
      apis: ["Date"],
      now: new Date("2026-08-18T02:30:00.000Z")
    });
    const observed = {
      caseWhere: null as unknown,
      taskWhere: null as unknown,
      expenseWhere: null as unknown,
      cashboxWheres: [] as unknown[]
    };
    const service = new DashboardService(createPrismaMock(observed) as never);

    const result = await service.getMetrics(tenantId);

    assert.equal(result.activeCasesCount, 7);
    assert.equal(result.cashbox.date, "2026-08-17");
    assert.equal(result.cashbox.balance, "1550.00");
    assert.equal(result.cashbox.incomeToday, "800.00");
    assert.equal(result.cashbox.expenseToday, "125.00");
    assert.equal(result.cashbox.currency.code, "ARS");
    assert.deepEqual(result.dueToday, { paymentsCount: 3, tasksCount: 2 });
    assert.deepEqual(observed.caseWhere, { status: "open", tenantId });
    assert.deepEqual(observed.taskWhere, {
      endDate: new Date("2026-08-17T00:00:00.000Z"),
      status: { in: ["pending", "in_progress"] },
      tenantId
    });
    assert.deepEqual(observed.expenseWhere, {
      paymentDate: new Date("2026-08-17T00:00:00.000Z"),
      status: { in: ["pending", "overdue"] },
      tenantId
    });
    assert.equal(observed.cashboxWheres.length, 4);
    assert.ok(
      observed.cashboxWheres.every((where) => isTenantCashboxWhere(where, tenantId, "ARS"))
    );
  });
});

function createPrismaMock(observed: {
  caseWhere: unknown;
  cashboxWheres: unknown[];
  expenseWhere: unknown;
  taskWhere: unknown;
}) {
  return {
    case: {
      count: async ({ where }: { where: unknown }) => {
        observed.caseWhere = where;
        return 7;
      }
    },
    caseExpense: {
      count: async ({ where }: { where: unknown }) => {
        observed.expenseWhere = where;
        return 3;
      }
    },
    caseTask: {
      count: async ({ where }: { where: unknown }) => {
        observed.taskWhere = where;
        return 2;
      }
    },
    cashboxMovement: {
      aggregate: async ({ where }: { where: CashboxAggregateWhere }) => {
        observed.cashboxWheres.push(where);
        const types = where.type.in;
        const isDaily = Boolean(where.occurredAt.gte);

        if (isDaily && types.includes(CashboxMovementType.income)) {
          return { _sum: { amount: new Prisma.Decimal("800.00") } };
        }

        if (isDaily && types.includes(CashboxMovementType.expense)) {
          return { _sum: { amount: new Prisma.Decimal("125.00") } };
        }

        if (types.includes(CashboxMovementType.income)) {
          return { _sum: { amount: new Prisma.Decimal("2000.00") } };
        }

        return { _sum: { amount: new Prisma.Decimal("450.00") } };
      }
    },
    tenantCurrency: {
      findFirst: async () => ({
        currency: {
          code: "ARS",
          name: "Peso argentino",
          symbol: "$"
        }
      })
    },
    tenantSettings: {
      findUnique: async () => ({
        defaultCurrencyCode: "ARS",
        timezone: "America/Argentina/Buenos_Aires"
      })
    }
  };
}

type CashboxAggregateWhere = {
  currencyCode: string;
  occurredAt: {
    gte?: Date;
    lt?: Date;
  };
  tenantId: string;
  type: {
    in: CashboxMovementType[];
  };
};

function isTenantCashboxWhere(
  where: unknown,
  expectedTenantId: string,
  expectedCurrencyCode: string
) {
  if (!where || typeof where !== "object") {
    return false;
  }

  const cashboxWhere = where as Partial<CashboxAggregateWhere>;

  return (
    cashboxWhere.tenantId === expectedTenantId && cashboxWhere.currencyCode === expectedCurrencyCode
  );
}
