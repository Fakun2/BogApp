import "reflect-metadata";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NotFoundException } from "@nestjs/common";
import { PrismaService } from "../src/database/prisma.service";
import { ExpenseOverdueUseCase } from "../src/cases/use-cases/expense-overdue.use-case";

const tenantId = "11111111-1111-4111-8111-111111111111";
const caseId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

describe("ExpenseOverdueUseCase", () => {
  it("recalculates overdue expenses for a tenant-scoped case", async () => {
    const executeCalls: unknown[] = [];
    const tenantRuns: string[] = [];
    const useCase = new ExpenseOverdueUseCase(
      makePrisma({
        caseFound: true,
        executeCalls,
        tenantRuns,
        updatedCount: 2
      })
    );

    const response = await useCase.recalculate(tenantId, { caseId });

    assert.equal(response.status, "ok");
    assert.equal(response.updatedCount, 2);
    assert.equal(executeCalls.length, 1);
    assert.deepEqual(tenantRuns, [tenantId]);
  });

  it("rejects recalculation when the case is outside the active tenant", async () => {
    const executeCalls: unknown[] = [];
    const tenantRuns: string[] = [];
    const useCase = new ExpenseOverdueUseCase(
      makePrisma({
        caseFound: false,
        executeCalls,
        tenantRuns,
        updatedCount: 0
      })
    );

    await assert.rejects(() => useCase.recalculate(tenantId, { caseId }), NotFoundException);
    assert.equal(executeCalls.length, 0);
    assert.deepEqual(tenantRuns, [tenantId]);
  });

  it("can recalculate all overdue expenses for a tenant job", async () => {
    const executeCalls: unknown[] = [];
    const tenantRuns: string[] = [];
    const useCase = new ExpenseOverdueUseCase(
      makePrisma({
        caseFound: true,
        executeCalls,
        tenantRuns,
        updatedCount: 5
      })
    );

    const response = await useCase.recalculate(tenantId);

    assert.equal(response.updatedCount, 5);
    assert.equal(executeCalls.length, 1);
    assert.deepEqual(tenantRuns, [tenantId]);
  });

  it("recalculates active tenants with an advisory transaction lock", async () => {
    const executeCalls: unknown[] = [];
    const queryCalls: unknown[] = [];
    const useCase = new ExpenseOverdueUseCase(
      makePrisma({
        caseFound: true,
        executeCalls,
        lockAcquired: true,
        queryCalls,
        updatedCount: 7
      })
    );

    const response = await useCase.recalculateActiveTenants();

    assert.equal(response.status, "ok");
    assert.equal(response.updatedCount, 7);
    assert.equal(executeCalls.length, 0);
    assert.equal(queryCalls.length, 2);
  });

  it("skips active tenant recalculation when another worker owns the lock", async () => {
    const executeCalls: unknown[] = [];
    const queryCalls: unknown[] = [];
    const useCase = new ExpenseOverdueUseCase(
      makePrisma({
        caseFound: true,
        executeCalls,
        lockAcquired: false,
        queryCalls,
        updatedCount: 7
      })
    );

    const response = await useCase.recalculateActiveTenants();

    assert.equal(response.status, "skipped");
    assert.equal(response.updatedCount, 0);
    assert.equal(executeCalls.length, 0);
    assert.equal(queryCalls.length, 1);
  });
});

function makePrisma({
  caseFound,
  executeCalls,
  lockAcquired = true,
  queryCalls = [],
  tenantRuns = [],
  updatedCount
}: {
  caseFound: boolean;
  executeCalls: unknown[];
  lockAcquired?: boolean;
  queryCalls?: unknown[];
  tenantRuns?: string[];
  updatedCount: number;
}) {
  const tx = {
    $executeRaw: async (query: unknown) => {
      executeCalls.push(query);
      return updatedCount;
    },
    $queryRaw: async (query: unknown) => {
      queryCalls.push(query);
      return queryCalls.length === 1
        ? [{ acquired: lockAcquired }]
        : [{ updated_count: updatedCount }];
    },
    case: {
      findFirst: async () => (caseFound ? { id: caseId } : null)
    }
  };

  return {
    ...tx,
    $transaction: async <T>(callback: (client: typeof tx) => Promise<T>) => callback(tx),
    runWithTenant: async <T>(tenantId: string, callback: (client: typeof tx) => Promise<T>) => {
      tenantRuns.push(tenantId);
      return callback(tx);
    },
    case: tx.case
  } as unknown as PrismaService;
}
