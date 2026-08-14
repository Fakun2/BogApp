import "reflect-metadata";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BadRequestException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CaseExpensesUseCase } from "../src/cases/use-cases/case-expenses.use-case";
import { PrismaService } from "../src/database/prisma.service";

const tenantId = "11111111-1111-4111-8111-111111111111";
const caseId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const userId = "99999999-9999-4999-8999-999999999999";

describe("CaseExpensesUseCase paid payment date", () => {
  it("allows paid expenses when payment date is today in Buenos Aires", async () => {
    const createdInputs: unknown[] = [];
    const useCase = new CaseExpensesUseCase(makePrisma({ createdInputs }));
    const today = getBuenosAiresTodayDateString();

    const response = await useCase.create(tenantId, caseId, userId, {
      alertEnabled: false,
      amount: 1500,
      concept: "Tasa judicial",
      currencyCode: "ARS",
      expenseDate: today,
      paymentDate: today,
      status: "paid"
    });

    assert.equal(response.status, "paid");
    assert.equal(response.paymentDate, today);
    assert.equal(createdInputs.length, 1);
  });

  it("rejects paid expenses when payment date is not today", async () => {
    const createdInputs: unknown[] = [];
    const useCase = new CaseExpensesUseCase(makePrisma({ createdInputs }));

    await assert.rejects(
      () =>
        useCase.create(tenantId, caseId, userId, {
          alertEnabled: false,
          amount: 1500,
          concept: "Tasa judicial",
          currencyCode: "ARS",
          expenseDate: "2026-08-01",
          paymentDate: "2026-08-01",
          status: "paid"
        }),
      BadRequestException
    );
    assert.equal(createdInputs.length, 0);
  });

  it("keeps existing payment date behavior for pending expenses", async () => {
    const createdInputs: unknown[] = [];
    const useCase = new CaseExpensesUseCase(makePrisma({ createdInputs }));

    const response = await useCase.create(tenantId, caseId, userId, {
      alertEnabled: false,
      amount: 1500,
      concept: "Tasa judicial",
      currencyCode: "ARS",
      expenseDate: "2026-08-01",
      paymentDate: "2026-08-15",
      status: "pending"
    });

    assert.equal(response.status, "pending");
    assert.equal(response.paymentDate, "2026-08-15");
    assert.equal(createdInputs.length, 1);
  });
});

function makePrisma({ createdInputs }: { createdInputs: unknown[] }) {
  return {
    case: {
      findFirst: async () => ({ id: caseId })
    },
    caseExpense: {
      create: async ({ data }: { data: { paymentDate: Date; status: "paid" | "pending" | "cancelled" | "overdue" } }) => {
        createdInputs.push(data);
        return {
          alertAt: null,
          alertEnabled: false,
          amount: new Prisma.Decimal("1500"),
          attachments: [],
          caseId,
          concept: "Tasa judicial",
          createdAt: new Date("2026-08-14T12:00:00.000Z"),
          currencyCode: "ARS",
          expenseDate: new Date("2026-08-01T00:00:00.000Z"),
          id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
          notes: null,
          paymentDate: data.paymentDate,
          status: data.status,
          task: null,
          taskId: null,
          updatedAt: new Date("2026-08-14T12:00:00.000Z")
        };
      }
    },
    tenantCurrency: {
      findFirst: async () => ({ id: "tenant-currency-id" })
    }
  } as unknown as PrismaService;
}

function getBuenosAiresTodayDateString() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Buenos_Aires",
    year: "numeric"
  }).formatToParts(new Date());
  const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${partMap.year}-${partMap.month}-${partMap.day}`;
}
