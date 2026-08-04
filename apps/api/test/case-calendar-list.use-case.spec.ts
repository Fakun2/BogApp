import "reflect-metadata";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../src/database/prisma.service";
import { CaseExpensesUseCase } from "../src/cases/use-cases/case-expenses.use-case";

const tenantId = "11111111-1111-4111-8111-111111111111";
const caseId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

describe("CaseExpensesUseCase calendar list", () => {
  it("paginates calendar list events in the database query shape", async () => {
    const executeCalls: unknown[] = [];
    const queryCalls: unknown[] = [];
    const useCase = new CaseExpensesUseCase(
      makePrisma({
        executeCalls,
        queryCalls,
        rows: [
          {
            amount: new Prisma.Decimal("1500.5"),
            event_date: new Date("2026-08-10T00:00:00.000Z"),
            event_type: "payment_due",
            hearing_type: null,
            id: "00000000-0000-4000-8000-000000000001",
            status: "pending",
            time: null,
            title: "Pago: Tasa judicial"
          },
          {
            amount: null,
            event_date: new Date("2026-08-11T00:00:00.000Z"),
            event_type: "task_due",
            hearing_type: null,
            id: "00000000-0000-4000-8000-000000000002",
            status: "in_progress",
            time: null,
            title: "Tarea: Presentar escrito"
          },
          {
            amount: null,
            event_date: new Date("2026-08-12T00:00:00.000Z"),
            event_type: "hearing",
            hearing_type: "preliminary",
            id: "00000000-0000-4000-8000-000000000003",
            status: null,
            time: "09:30",
            title: "Audiencia: Preliminar"
          }
        ]
      })
    );

    const response = await useCase.calendar(
      tenantId,
      caseId,
      {
        limit: 2,
        mode: "list",
        month: "2026-08",
        types: "payment_due,task_due,hearing"
      },
      { canReadExpenses: true, canReadHearings: true, canReadTasks: true }
    );

    assert.equal(queryCalls.length, 1);
    assert.equal(executeCalls.length, 0);
    assert.equal(response.events.length, 2);
    const firstEvent = response.events[0];
    const secondEvent = response.events[1];
    assert.ok(firstEvent);
    assert.ok(secondEvent);
    assert.equal(firstEvent.type, "payment_due");
    assert.equal(secondEvent.type, "task_due");

    if (firstEvent.type !== "payment_due") {
      assert.fail("Expected a payment due calendar event.");
    }

    assert.equal(firstEvent.amount, 1500.5);
    assert.equal(response.pageInfo?.hasNextPage, true);
    assert.equal(response.pageInfo?.total, 3);
    assert.ok(response.pageInfo?.nextCursor);
  });

  it("does not run the list query when RBAC or type filters deny every event type", async () => {
    const executeCalls: unknown[] = [];
    const queryCalls: unknown[] = [];
    const useCase = new CaseExpensesUseCase(makePrisma({ executeCalls, queryCalls, rows: [] }));

    const response = await useCase.calendar(
      tenantId,
      caseId,
      {
        limit: 5,
        mode: "list",
        month: "2026-08",
        types: "hearing"
      },
      { canReadExpenses: true, canReadHearings: false, canReadTasks: true }
    );

    assert.equal(queryCalls.length, 0);
    assert.equal(executeCalls.length, 0);
    assert.deepEqual(response.events, []);
    assert.equal(response.pageInfo?.hasNextPage, false);
  });
});

function makePrisma({
  executeCalls,
  queryCalls,
  rows
}: {
  executeCalls: unknown[];
  queryCalls: unknown[];
  rows: unknown[];
}) {
  return {
    $executeRaw: async (query: unknown) => {
      executeCalls.push(query);
      return 0;
    },
    $queryRaw: async (query: unknown) => {
      queryCalls.push(query);
      return rows;
    },
    case: {
      findFirst: async () => ({ id: caseId })
    }
  } as unknown as PrismaService;
}
