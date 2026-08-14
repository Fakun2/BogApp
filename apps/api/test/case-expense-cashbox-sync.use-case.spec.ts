import "reflect-metadata";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CaseExpenseCashboxSyncJobAction,
  CaseExpenseCashboxSyncJobStatus,
  Prisma
} from "@prisma/client";
import { CaseExpenseCashboxSyncUseCase } from "../src/cases/use-cases/case-expense-cashbox-sync.use-case";
import { PrismaService } from "../src/database/prisma.service";

const tenantId = "11111111-1111-4111-8111-111111111111";
const caseId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const expenseId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const actorUserId = "99999999-9999-4999-8999-999999999999";

describe("CaseExpenseCashboxSyncUseCase", () => {
  it("creates one cashbox expense movement for a paid case expense", async () => {
    const prisma = makePrisma({
      expenses: [
        {
          amount: new Prisma.Decimal("1500.25"),
          caseId,
          concept: "Tasa judicial",
          currencyCode: "USD",
          paymentDate: new Date("2026-08-10T00:00:00.000Z"),
          status: "paid",
          updatedAt: new Date("2026-08-10T17:57:00.000Z")
        }
      ],
      tenantCurrencies: [{ active: true, currencyCode: "USD", tenantId }]
    });
    const useCase = new CaseExpenseCashboxSyncUseCase(prisma);

    const response = await useCase.processDueJobs();

    assert.equal(response.processed, 1);
    assert.equal(prisma.__movements.length, 1);
    const movement = prisma.__movements[0];
    const job = prisma.__jobs[0];
    assert.ok(movement);
    assert.ok(job);
    assert.equal(movement.caseExpenseId, expenseId);
    assert.equal(movement.currencyCode, "USD");
    assert.equal(movement.type, "expense");
    assert.equal(movement.occurredAt.toISOString(), "2026-08-10T17:57:00.000Z");
    assert.equal(job.status, CaseExpenseCashboxSyncJobStatus.completed);
  });

  it("updates the linked movement when the paid expense changes", async () => {
    const prisma = makePrisma({
      expenses: [
        {
          amount: new Prisma.Decimal("2500"),
          caseId,
          concept: "Honorarios perito",
          currencyCode: "ARS",
          paymentDate: new Date("2026-08-11T00:00:00.000Z"),
          status: "paid",
          updatedAt: new Date("2026-08-11T18:30:00.000Z")
        }
      ],
      movements: [
        {
          amount: new Prisma.Decimal("100"),
          caseExpenseId: expenseId,
          currencyCode: "USD",
          description: "Gasto de expediente: anterior",
          occurredAt: new Date("2026-08-01T12:00:00.000Z"),
          tenantId,
          type: "expense"
        }
      ],
      tenantCurrencies: [{ active: true, currencyCode: "ARS", tenantId }]
    });
    const useCase = new CaseExpenseCashboxSyncUseCase(prisma);

    await useCase.processDueJobs();

    assert.equal(prisma.__movements.length, 1);
    const movement = prisma.__movements[0];
    assert.ok(movement);
    assert.equal(movement.currencyCode, "ARS");
    assert.equal(movement.description, "Gasto de expediente: Honorarios perito");
    assert.equal(String(movement.amount), "2500");
  });

  it("deletes the linked movement when the expense is no longer paid", async () => {
    const prisma = makePrisma({
      expenses: [
        {
          amount: new Prisma.Decimal("900"),
          caseId,
          concept: "Gasto pendiente",
          currencyCode: "ARS",
          paymentDate: new Date("2026-08-12T00:00:00.000Z"),
          status: "pending",
          updatedAt: new Date("2026-08-12T19:00:00.000Z")
        }
      ],
      movements: [
        {
          amount: new Prisma.Decimal("900"),
          caseExpenseId: expenseId,
          currencyCode: "ARS",
          description: "Gasto de expediente: Gasto pendiente",
          occurredAt: new Date("2026-08-12T12:00:00.000Z"),
          tenantId,
          type: "expense"
        }
      ],
      tenantCurrencies: [{ active: true, currencyCode: "ARS", tenantId }]
    });
    const useCase = new CaseExpenseCashboxSyncUseCase(prisma);

    await useCase.processDueJobs();

    assert.equal(prisma.__movements.length, 0);
    const job = prisma.__jobs[0];
    assert.ok(job);
    assert.equal(job.status, CaseExpenseCashboxSyncJobStatus.completed);
  });

  it("keeps the job pending for retry when the expense currency is inactive", async () => {
    const prisma = makePrisma({
      expenses: [
        {
          amount: new Prisma.Decimal("900"),
          caseId,
          concept: "Gasto en moneda inactiva",
          currencyCode: "EUR",
          paymentDate: new Date("2026-08-12T00:00:00.000Z"),
          status: "paid",
          updatedAt: new Date("2026-08-12T20:00:00.000Z")
        }
      ],
      tenantCurrencies: [{ active: false, currencyCode: "EUR", tenantId }]
    });
    const useCase = new CaseExpenseCashboxSyncUseCase(prisma);

    await useCase.processDueJobs();

    assert.equal(prisma.__movements.length, 0);
    const job = prisma.__jobs[0];
    assert.ok(job);
    assert.equal(job.attempts, 1);
    assert.equal(job.status, CaseExpenseCashboxSyncJobStatus.pending);
    assert.match(job.lastError ?? "", /moneda del gasto no esta activa/i);
  });
});

type ExpenseRecord = {
  amount: Prisma.Decimal;
  caseId: string;
  concept: string;
  currencyCode: string;
  paymentDate: Date;
  status: "paid" | "pending" | "overdue" | "cancelled";
  updatedAt: Date;
};

type MovementRecord = {
  amount: Prisma.Decimal;
  caseExpenseId: string;
  currencyCode: string;
  description: string;
  occurredAt: Date;
  tenantId: string;
  type: string;
};

function makePrisma({
  expenses,
  movements = [],
  tenantCurrencies
}: {
  expenses: ExpenseRecord[];
  movements?: MovementRecord[];
  tenantCurrencies: Array<{ active: boolean; currencyCode: string; tenantId: string }>;
}) {
  const jobs = [
    {
      action: CaseExpenseCashboxSyncJobAction.upsert_cashbox_movement,
      actorUserId,
      attempts: 0,
      caseExpenseId: expenseId,
      caseId,
      createdAt: new Date("2026-08-14T00:00:00.000Z"),
      id: "job-1",
      lastError: null as string | null,
      nextRunAt: new Date("2026-08-14T00:00:00.000Z"),
      status: CaseExpenseCashboxSyncJobStatus.pending,
      tenantId
    }
  ];

  const prisma = {
    __jobs: jobs,
    __movements: movements,
    caseExpense: {
      findFirst: async ({ where }: { where: { id: string; tenantId: string } }) =>
        where.id === expenseId && where.tenantId === tenantId ? expenses[0] ?? null : null
    },
    caseExpenseCashboxSyncJob: {
      findMany: async () => jobs.filter((job) => job.status === CaseExpenseCashboxSyncJobStatus.pending),
      findUnique: async ({ where }: { where: { id: string } }) =>
        jobs.find((job) => job.id === where.id) ?? null,
      update: async ({ data, where }: { data: Partial<(typeof jobs)[number]>; where: { id: string } }) => {
        const job = jobs.find((item) => item.id === where.id);
        if (!job) {
          return null;
        }

        Object.assign(job, data);
        return job;
      }
    },
    cashboxMovement: {
      deleteMany: async ({ where }: { where: { caseExpenseId: string; tenantId: string } }) => {
        const kept = movements.filter(
          (movement) =>
            movement.caseExpenseId !== where.caseExpenseId || movement.tenantId !== where.tenantId
        );
        movements.splice(0, movements.length, ...kept);
      },
      upsert: async ({
        create,
        update,
        where
      }: {
        create: MovementRecord;
        update: Partial<MovementRecord>;
        where: { caseExpenseId: string };
      }) => {
        const existing = movements.find((movement) => movement.caseExpenseId === where.caseExpenseId);

        if (existing) {
          Object.assign(existing, update);
          return existing;
        }

        movements.push(create);
        return create;
      }
    },
    tenantCurrency: {
      findFirst: async ({
        where
      }: {
        where: { active: boolean; currencyCode: string; tenantId: string };
      }) =>
        tenantCurrencies.find(
          (tenantCurrency) =>
            tenantCurrency.active === where.active &&
            tenantCurrency.currencyCode === where.currencyCode &&
            tenantCurrency.tenantId === where.tenantId
        ) ?? null
    }
  };

  return prisma as unknown as PrismaService & {
    __jobs: typeof jobs;
    __movements: MovementRecord[];
  };
}
