import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import type {
  CaseCalendarQuery,
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
        ...(query.status ? { status: query.status } : {}),
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

  async get(tenantId: string, caseId: string, expenseId: string) {
    await this.findTenantCaseOrThrow(tenantId, caseId);
    await this.markOverdueExpenses(tenantId, caseId);
    const expense = await this.prisma.caseExpense.findFirst({
      where: { caseId, id: expenseId, tenantId },
      select: caseExpenseSelect
    });

    if (!expense) {
      throw new NotFoundException("El gasto no existe en el expediente activo.");
    }

    return toCaseExpenseDto(expense);
  }

  async summary(tenantId: string, caseId: string) {
    await this.findTenantCaseOrThrow(tenantId, caseId);
    await this.markOverdueExpenses(tenantId, caseId);
    const paidExpensesWhere = { caseId, status: "paid" as const, tenantId };

    const [aggregate, topExpenses, totalCount] = await Promise.all([
      this.prisma.caseExpense.aggregate({
        _sum: { amount: true },
        where: paidExpensesWhere
      }),
      this.prisma.caseExpense.findMany({
        orderBy: [{ amount: "desc" }, { createdAt: "desc" }, { id: "asc" }],
        select: {
          amount: true,
          concept: true,
          id: true
        },
        take: 4,
        where: paidExpensesWhere
      }),
      this.prisma.caseExpense.count({ where: paidExpensesWhere })
    ]);

    const totalAmount = Number(aggregate._sum.amount ?? 0);

    return {
      totalAmount,
      totalCount,
      items: topExpenses.map((expense) => {
        const amount = Number(expense.amount);

        return {
          id: expense.id,
          concept: expense.concept,
          amount,
          percentage: totalAmount > 0 ? Number(((amount / totalAmount) * 100).toFixed(1)) : 0
        };
      })
    };
  }

  async calendar(tenantId: string, caseId: string, query: CaseCalendarQuery) {
    await this.findTenantCaseOrThrow(tenantId, caseId);
    await this.markOverdueExpenses(tenantId, caseId);
    const month = query.month ?? getBuenosAiresMonth();
    const { endDate, startDate } = getMonthDateRange(month);
    const eventTypes = toCalendarEventTypes(query.types);

    if (!eventTypes.includes("payment_due")) {
      return toCalendarResponse({ events: [], limit: query.limit, mode: query.mode, month });
    }

    if (query.mode === "list") {
      return this.listCalendarEvents(tenantId, caseId, month, startDate, endDate, query);
    }

    const paymentExpenses = await this.prisma.caseExpense.findMany({
      orderBy: [{ paymentDate: "asc" }, { id: "asc" }],
      select: {
        amount: true,
        concept: true,
        id: true,
        paymentDate: true,
        status: true
      },
      where: {
        caseId,
        tenantId,
        paymentDate: {
          gte: startDate,
          lt: endDate
        },
        status: { in: ["pending", "overdue"] },
        ...(query.search ? { concept: { contains: query.search, mode: "insensitive" as const } } : {})
      }
    });

    return {
      month,
      events: paymentExpenses.map(toPaymentDueCalendarEvent)
    };
  }

  private async listCalendarEvents(
    tenantId: string,
    caseId: string,
    month: string,
    startDate: Date,
    endDate: Date,
    query: CaseCalendarQuery
  ) {
    const cursor = decodeCalendarCursor(query.cursor);
    const paymentExpenses = await this.prisma.caseExpense.findMany({
      orderBy: [{ paymentDate: "asc" }, { id: "asc" }],
      select: {
        amount: true,
        concept: true,
        id: true,
        paymentDate: true,
        status: true
      },
      take: query.limit + 1,
      where: {
        caseId,
        tenantId,
        paymentDate: {
          gte: startDate,
          lt: endDate
        },
        status: { in: ["pending", "overdue"] },
        ...(query.search ? { concept: { contains: query.search, mode: "insensitive" as const } } : {}),
        ...(cursor ? { OR: getCalendarCursorWhere(cursor) } : {})
      }
    });
    const pageItems = paymentExpenses.slice(0, query.limit);
    const lastItem = pageItems.at(-1);
    const hasNextPage = paymentExpenses.length > query.limit;

    return {
      month,
      events: pageItems.map(toPaymentDueCalendarEvent),
      pageInfo: {
        limit: query.limit,
        offset: 0,
        nextCursor:
          hasNextPage && lastItem
            ? encodeCalendarCursor({ date: lastItem.paymentDate, id: lastItem.id })
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

type CalendarEventType = "payment_due" | "hearing";

type CalendarCursor = {
  date: Date;
  id: string;
};

function toCalendarEventTypes(types?: string) {
  if (!types) {
    return ["payment_due", "hearing"] satisfies CalendarEventType[];
  }

  return types
    .split(",")
    .map((type) => type.trim())
    .filter((type): type is CalendarEventType => type === "payment_due" || type === "hearing");
}

function toCalendarResponse({
  events,
  limit,
  mode,
  month
}: {
  events: ReturnType<typeof toPaymentDueCalendarEvent>[];
  limit: number;
  mode: CaseCalendarQuery["mode"];
  month: string;
}) {
  return {
    month,
    events,
    ...(mode === "list"
      ? {
          pageInfo: {
            limit,
            offset: 0,
            nextCursor: null,
            hasNextPage: false,
            total: events.length
          }
        }
      : {})
  };
}

function toPaymentDueCalendarEvent(expense: {
  amount: Prisma.Decimal;
  concept: string;
  id: string;
  paymentDate: Date;
  status: "pending" | "overdue" | "paid" | "cancelled";
}) {
  return {
    type: "payment_due" as const,
    id: expense.id,
    title: `Pago: ${expense.concept}`,
    date: expense.paymentDate.toISOString().slice(0, 10),
    amount: Number(expense.amount),
    status: expense.status
  };
}

function encodeCalendarCursor(cursor: CalendarCursor) {
  return Buffer.from(
    JSON.stringify({
      date: cursor.date.toISOString(),
      id: cursor.id
    })
  ).toString("base64url");
}

function decodeCalendarCursor(cursor?: string): CalendarCursor | null {
  if (!cursor) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as {
      date?: string;
      id?: string;
    };

    if (!parsed.date || !parsed.id) {
      return null;
    }

    return {
      date: new Date(parsed.date),
      id: parsed.id
    };
  } catch {
    return null;
  }
}

function getCalendarCursorWhere(cursor: CalendarCursor): Prisma.CaseExpenseWhereInput[] {
  return [
    { paymentDate: { gt: cursor.date } },
    { paymentDate: cursor.date, id: { gt: cursor.id } }
  ];
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

function getBuenosAiresMonth() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    month: "2-digit",
    timeZone: "America/Buenos_Aires",
    year: "numeric"
  }).formatToParts(new Date());
  const dateParts = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${dateParts.year}-${dateParts.month}`;
}

function getMonthDateRange(month: string) {
  const [yearValue = "", monthValue = ""] = month.split("-");
  const year = Number(yearValue);
  const monthNumber = Number(monthValue);
  const startDate = new Date(Date.UTC(year, monthNumber - 1, 1));
  const endDate = new Date(Date.UTC(year, monthNumber, 1));

  return { endDate, startDate };
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
