import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import type {
  CreateCaseExpenseInput,
  ListCaseExpensesQuery,
  UpdateCaseExpenseInput
} from "../cases.schemas";
import { toCaseExpenseAttachmentDto } from "./case-expense-attachments.use-case";

@Injectable()
export class CaseExpensesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async list(tenantId: string, caseId: string, query: ListCaseExpensesQuery) {
    const cursor = decodeExpensesCursor(query.cursor);
    await this.findTenantCaseOrThrow(tenantId, caseId);
    await this.markOverdueExpenses(tenantId, caseId);
    const expenses = await this.prisma.caseExpense.findMany({
      where: {
        caseId,
        tenantId,
        ...(query.taskId ? { taskId: query.taskId } : {}),
        ...(cursor ? { OR: getExpenseCursorWhere(cursor) } : {})
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: query.limit + 1,
      select: caseExpenseSelect
    });
    const pageItems = expenses.slice(0, query.limit);
    const lastItem = pageItems.at(-1);
    const hasNextPage = expenses.length > query.limit;

    return {
      items: pageItems.map(toCaseExpenseDto),
      pageInfo: {
        limit: query.limit,
        offset: 0,
        nextCursor:
          hasNextPage && lastItem
            ? encodeExpensesCursor({ createdAt: lastItem.createdAt, id: lastItem.id })
            : null,
        hasNextPage,
        total: pageItems.length + (hasNextPage ? 1 : 0)
      }
    };
  }

  async create(tenantId: string, caseId: string, input: CreateCaseExpenseInput) {
    await this.assertRelations(tenantId, caseId, input);
    const createdExpense = await this.prisma.caseExpense.create({
      data: toCaseExpenseCreateData(tenantId, caseId, input),
      select: caseExpenseSelect
    });

    return toCaseExpenseDto(createdExpense);
  }

  async update(tenantId: string, caseId: string, expenseId: string, input: UpdateCaseExpenseInput) {
    await this.findTenantExpenseOrThrow(tenantId, caseId, expenseId);
    await this.assertRelations(tenantId, caseId, input);
    const updatedExpense = await this.prisma.caseExpense.update({
      where: { id: expenseId },
      data: toCaseExpenseUpdateData(input),
      select: caseExpenseSelect
    });

    return toCaseExpenseDto(updatedExpense);
  }

  async delete(tenantId: string, caseId: string, expenseId: string) {
    await this.findTenantExpenseOrThrow(tenantId, caseId, expenseId);
    await this.prisma.caseExpense.delete({ where: { id: expenseId } });

    return { status: "ok" as const };
  }

  private async assertRelations(
    tenantId: string,
    caseId: string,
    input: CreateCaseExpenseInput | UpdateCaseExpenseInput
  ) {
    await this.findTenantCaseOrThrow(tenantId, caseId);

    if (input.taskId) {
      await this.findTenantTaskOrThrow(tenantId, caseId, input.taskId);
    }
  }

  private async findTenantCaseOrThrow(tenantId: string, caseId: string) {
    const existingCase = await this.prisma.case.findFirst({
      where: { id: caseId, tenantId },
      select: { id: true }
    });

    if (!existingCase) {
      throw new NotFoundException("El expediente no existe en el estudio activo.");
    }

    return existingCase;
  }

  private async findTenantTaskOrThrow(tenantId: string, caseId: string, taskId: string) {
    const task = await this.prisma.caseTask.findFirst({
      where: { caseId, id: taskId, tenantId },
      select: { id: true }
    });

    if (!task) {
      throw new NotFoundException("La tarea no existe en el expediente activo.");
    }

    return task;
  }

  private async findTenantExpenseOrThrow(tenantId: string, caseId: string, expenseId: string) {
    const expense = await this.prisma.caseExpense.findFirst({
      where: { caseId, id: expenseId, tenantId },
      select: { id: true }
    });

    if (!expense) {
      throw new NotFoundException("El gasto no existe en el expediente activo.");
    }

    return expense;
  }

  private async markOverdueExpenses(tenantId: string, caseId: string) {
    await this.prisma.$executeRaw`
      UPDATE case_expenses
      SET status = 'overdue'
      WHERE tenant_id = ${tenantId}::uuid
        AND case_id = ${caseId}::uuid
        AND status = 'pending'
        AND (
          payment_date < ${getBuenosAiresTodayDate()}::date
          OR expense_date > payment_date
        )
    `;
  }
}

const caseExpenseSelect = {
  alertAt: true,
  alertEnabled: true,
  amount: true,
  caseId: true,
  concept: true,
  createdAt: true,
  expenseDate: true,
  id: true,
  notes: true,
  paymentDate: true,
  status: true,
  attachments: {
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      id: true,
      mimeType: true,
      originalName: true,
      sizeBytes: true
    }
  },
  task: {
    select: {
      id: true,
      name: true
    }
  },
  taskId: true,
  updatedAt: true
} satisfies Prisma.CaseExpenseSelect;

type CaseExpenseWithSelect = Prisma.CaseExpenseGetPayload<{ select: typeof caseExpenseSelect }>;

type CaseExpenseWriteStatus = NonNullable<Prisma.CaseExpenseUncheckedCreateInput["status"]>;

function toCaseExpenseCreateData(
  tenantId: string,
  caseId: string,
  input: CreateCaseExpenseInput
): Prisma.CaseExpenseUncheckedCreateInput {
  return {
    ...toCaseExpenseWriteData(input),
    caseId,
    tenantId
  };
}

function toCaseExpenseUpdateData(
  input: UpdateCaseExpenseInput
): Prisma.CaseExpenseUncheckedUpdateInput {
  return toCaseExpenseWriteData(input);
}

function toCaseExpenseWriteData(input: CreateCaseExpenseInput | UpdateCaseExpenseInput) {
  return {
    alertAt: input.alertEnabled ? toBuenosAiresDateTime(input.alertDate, input.alertTime) : null,
    alertEnabled: input.alertEnabled,
    amount: input.amount,
    concept: input.concept,
    expenseDate: new Date(`${input.expenseDate}T00:00:00.000Z`),
    notes: input.notes ?? null,
    paymentDate: new Date(`${input.paymentDate}T00:00:00.000Z`),
    status: normalizeExpenseStatus(input.status, input.expenseDate, input.paymentDate),
    taskId: input.taskId ?? null
  };
}

function toCaseExpenseDto(item: CaseExpenseWithSelect) {
  return {
    id: item.id,
    caseId: item.caseId,
    taskId: item.taskId,
    task: item.task,
    alertAt: item.alertAt ? item.alertAt.toISOString() : null,
    alertEnabled: item.alertEnabled,
    attachments: item.attachments.map(toCaseExpenseAttachmentDto),
    concept: item.concept,
    amount: Number(item.amount),
    expenseDate: item.expenseDate.toISOString().slice(0, 10),
    paymentDate: item.paymentDate.toISOString().slice(0, 10),
    status: item.status,
    notes: item.notes,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString()
  };
}

function normalizeExpenseStatus(
  status: CreateCaseExpenseInput["status"],
  expenseDate: string,
  paymentDate: string
): CaseExpenseWriteStatus {
  if (status !== "pending") {
    return status;
  }

  const expenseDay = new Date(`${expenseDate}T00:00:00.000Z`);
  const paymentDay = new Date(`${paymentDate}T00:00:00.000Z`);

  return paymentDay < getBuenosAiresTodayDate() || expenseDay > paymentDay
    ? ("overdue" as CaseExpenseWriteStatus)
    : "pending";
}

function getBuenosAiresTodayDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Buenos_Aires",
    year: "numeric"
  }).formatToParts(new Date());
  const dateParts = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return new Date(`${dateParts.year}-${dateParts.month}-${dateParts.day}T00:00:00.000Z`);
}

function toBuenosAiresDateTime(date?: string, time?: string) {
  if (!date || !time) {
    return null;
  }

  return new Date(`${date}T${time}:00.000-03:00`);
}

type ExpensesCursor = {
  createdAt: Date;
  id: string;
};

function encodeExpensesCursor(cursor: ExpensesCursor) {
  return Buffer.from(
    JSON.stringify({
      createdAt: cursor.createdAt.toISOString(),
      id: cursor.id
    })
  ).toString("base64url");
}

function decodeExpensesCursor(cursor?: string): ExpensesCursor | null {
  if (!cursor) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as {
      createdAt?: string;
      id?: string;
    };

    if (!parsed.createdAt || !parsed.id) {
      return null;
    }

    return {
      createdAt: new Date(parsed.createdAt),
      id: parsed.id
    };
  } catch {
    return null;
  }
}

function getExpenseCursorWhere(cursor: ExpensesCursor): Prisma.CaseExpenseWhereInput[] {
  return [
    { createdAt: { lt: cursor.createdAt } },
    { createdAt: cursor.createdAt, id: { gt: cursor.id } }
  ];
}
