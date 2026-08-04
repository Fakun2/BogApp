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

  async calendar(
    tenantId: string,
    caseId: string,
    query: CaseCalendarQuery,
    permissions: { canReadExpenses: boolean; canReadHearings: boolean; canReadTasks: boolean }
  ) {
    await this.findTenantCaseOrThrow(tenantId, caseId);
    const month = query.month ?? getBuenosAiresMonth();
    const { endDate, startDate } = getMonthDateRange(month);
    const eventTypes = toCalendarEventTypes(query.types);

    const canReadPaymentEvents = permissions.canReadExpenses && eventTypes.includes("payment_due");
    const canReadTaskEvents = permissions.canReadTasks && eventTypes.includes("task_due");
    const canReadHearingEvents = permissions.canReadHearings && eventTypes.includes("hearing");

    if (!canReadPaymentEvents && !canReadTaskEvents && !canReadHearingEvents) {
      return toCalendarResponse({ events: [], limit: query.limit, mode: query.mode, month });
    }

    if (query.mode !== "list") {
      const events = await this.getCalendarEvents({
        canReadHearingEvents,
        canReadPaymentEvents,
        canReadTaskEvents,
        caseId,
        endDate,
        search: query.search,
        startDate,
        tenantId
      });

      return { month, events };
    }

    const cursor = decodeCalendarCursor(query.cursor);
    const events = await this.getCalendarListEvents({
      canReadHearingEvents,
      canReadPaymentEvents,
      canReadTaskEvents,
      caseId,
      cursor,
      endDate,
      limit: query.limit + 1,
      search: query.search,
      startDate,
      tenantId
    });
    const pageItems = events.slice(0, query.limit);
    const lastItem = pageItems.at(-1);
    const hasNextPage = events.length > query.limit;

    return {
      month,
      events: pageItems,
      pageInfo: {
        limit: query.limit,
        offset: 0,
        nextCursor:
          hasNextPage && lastItem
            ? encodeCalendarCursor({ date: lastItem.date, id: lastItem.id })
            : null,
        hasNextPage,
        total: pageItems.length + (hasNextPage ? 1 : 0)
      }
    };
  }

  private async getCalendarEvents({
    canReadHearingEvents,
    canReadPaymentEvents,
    canReadTaskEvents,
    caseId,
    endDate,
    search,
    startDate,
    tenantId
  }: {
    canReadHearingEvents: boolean;
    canReadPaymentEvents: boolean;
    canReadTaskEvents: boolean;
    caseId: string;
    endDate: Date;
    search?: string;
    startDate: Date;
    tenantId: string;
  }) {
    const [paymentExpenses, pendingTasks, hearings] = await Promise.all([
      canReadPaymentEvents
        ? this.prisma.caseExpense.findMany({
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
              ...(search ? { concept: { contains: search, mode: "insensitive" as const } } : {})
            }
          })
        : Promise.resolve([]),
      canReadTaskEvents
        ? this.prisma.caseTask.findMany({
            orderBy: [{ endDate: "asc" }, { startDate: "asc" }, { id: "asc" }],
            select: {
              endDate: true,
              id: true,
              name: true,
              startDate: true,
              status: true
            },
            where: {
              caseId,
              tenantId,
              status: { in: ["pending", "in_progress"] },
              OR: [
                {
                  endDate: {
                    gte: startDate,
                    lt: endDate
                  }
                },
                {
                  endDate: null,
                  startDate: {
                    gte: startDate,
                    lt: endDate
                  }
                }
              ],
              ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {})
            }
          })
        : Promise.resolve([]),
      canReadHearingEvents
        ? this.prisma.caseHearing.findMany({
            orderBy: [{ date: "asc" }, { time: "asc" }, { id: "asc" }],
            select: {
              date: true,
              description: true,
              id: true,
              time: true,
              type: true
            },
            where: {
              caseId,
              tenantId,
              date: {
                gte: startDate,
                lt: endDate
              },
              ...(search
                ? { description: { contains: search, mode: Prisma.QueryMode.insensitive } }
                : {})
            }
          })
        : Promise.resolve([])
    ]);

    return [
      ...paymentExpenses.map(toPaymentDueCalendarEvent),
      ...pendingTasks.map(toTaskDueCalendarEvent),
      ...hearings.map(toHearingCalendarEvent)
    ].sort(compareCalendarEvents);
  }

  private async getCalendarListEvents({
    canReadHearingEvents,
    canReadPaymentEvents,
    canReadTaskEvents,
    caseId,
    cursor,
    endDate,
    limit,
    search,
    startDate,
    tenantId
  }: {
    canReadHearingEvents: boolean;
    canReadPaymentEvents: boolean;
    canReadTaskEvents: boolean;
    caseId: string;
    cursor: CalendarCursor | null;
    endDate: Date;
    limit: number;
    search?: string;
    startDate: Date;
    tenantId: string;
  }) {
    const eventQueries: Prisma.Sql[] = [];
    const searchPattern = search ? toIlikeContainsPattern(search) : null;

    if (canReadPaymentEvents) {
      eventQueries.push(Prisma.sql`
        SELECT
          'payment_due'::text AS event_type,
          case_expenses.id::text AS id,
          ('Pago: ' || case_expenses.concept)::text AS title,
          case_expenses.payment_date::date AS event_date,
          case_expenses.status::text AS status,
          case_expenses.amount AS amount,
          NULL::text AS hearing_type,
          NULL::text AS time
        FROM case_expenses
        WHERE case_expenses.tenant_id = ${tenantId}::uuid
          AND case_expenses.case_id = ${caseId}::uuid
          AND case_expenses.payment_date >= ${startDate}::date
          AND case_expenses.payment_date < ${endDate}::date
          AND case_expenses.status IN ('pending', 'overdue')
          ${searchPattern ? Prisma.sql`AND case_expenses.concept ILIKE ${searchPattern} ESCAPE '\'` : Prisma.empty}
      `);
    }

    if (canReadTaskEvents) {
      eventQueries.push(Prisma.sql`
        SELECT
          'task_due'::text AS event_type,
          case_tasks.id::text AS id,
          ('Tarea: ' || case_tasks.name)::text AS title,
          COALESCE(case_tasks.end_date, case_tasks.start_date)::date AS event_date,
          case_tasks.status::text AS status,
          NULL::numeric AS amount,
          NULL::text AS hearing_type,
          NULL::text AS time
        FROM case_tasks
        WHERE case_tasks.tenant_id = ${tenantId}::uuid
          AND case_tasks.case_id = ${caseId}::uuid
          AND case_tasks.status IN ('pending', 'in_progress')
          AND COALESCE(case_tasks.end_date, case_tasks.start_date) >= ${startDate}::date
          AND COALESCE(case_tasks.end_date, case_tasks.start_date) < ${endDate}::date
          ${searchPattern ? Prisma.sql`AND case_tasks.name ILIKE ${searchPattern} ESCAPE '\'` : Prisma.empty}
      `);
    }

    if (canReadHearingEvents) {
      eventQueries.push(Prisma.sql`
        SELECT
          'hearing'::text AS event_type,
          case_hearings.id::text AS id,
          ('Audiencia: ' || case_hearings.description)::text AS title,
          case_hearings.date::date AS event_date,
          NULL::text AS status,
          NULL::numeric AS amount,
          case_hearings.type::text AS hearing_type,
          case_hearings.time::text AS time
        FROM case_hearings
        WHERE case_hearings.tenant_id = ${tenantId}::uuid
          AND case_hearings.case_id = ${caseId}::uuid
          AND case_hearings.date >= ${startDate}::date
          AND case_hearings.date < ${endDate}::date
          ${searchPattern ? Prisma.sql`AND case_hearings.description ILIKE ${searchPattern} ESCAPE '\'` : Prisma.empty}
      `);
    }

    const rows = await this.prisma.$queryRaw<CalendarListEventRow[]>(Prisma.sql`
      SELECT event_type, id, title, event_date, status, amount, hearing_type, time
      FROM (${joinSql(eventQueries, Prisma.sql`UNION ALL`)}) AS calendar_events
      ${
        cursor
          ? Prisma.sql`WHERE (event_date, id) > (${cursor.date}::date, ${cursor.id}::text)`
          : Prisma.empty
      }
      ORDER BY event_date ASC, id ASC
      LIMIT ${limit}
    `);

    return rows.map(toCalendarEventFromRow);
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
}

type CalendarEventType = "payment_due" | "hearing" | "task_due";

type CalendarCursor = {
  date: string;
  id: string;
};

type CalendarEvent =
  | ReturnType<typeof toPaymentDueCalendarEvent>
  | ReturnType<typeof toTaskDueCalendarEvent>
  | ReturnType<typeof toHearingCalendarEvent>;

type CalendarListEventRow = {
  amount: Prisma.Decimal | null;
  event_date: Date | string;
  event_type: CalendarEventType;
  hearing_type: HearingType | null;
  id: string;
  status: "pending" | "overdue" | "in_progress" | null;
  time: string | null;
  title: string;
};

type HearingType =
  | "preliminary"
  | "trial_view"
  | "conciliation"
  | "mediation"
  | "testimonial"
  | "confessional"
  | "debate"
  | "investigative_statement"
  | "other";

function toCalendarEventTypes(types?: string) {
  if (!types) {
    return ["payment_due", "hearing", "task_due"] satisfies CalendarEventType[];
  }

  return types
    .split(",")
    .map((type) => type.trim())
    .filter(
      (type): type is CalendarEventType =>
        type === "payment_due" || type === "hearing" || type === "task_due"
    );
}

function toCalendarResponse({
  events,
  limit,
  mode,
  month
}: {
  events: CalendarEvent[];
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

function toTaskDueCalendarEvent(task: {
  endDate: Date | null;
  id: string;
  name: string;
  startDate: Date | null;
  status: "pending" | "in_progress" | "completed" | "cancelled";
}) {
  const taskDate = task.endDate ?? task.startDate;

  return {
    type: "task_due" as const,
    id: task.id,
    title: `Tarea: ${task.name}`,
    date: taskDate?.toISOString().slice(0, 10) ?? "",
    status: task.status
  };
}

function toHearingCalendarEvent(hearing: {
  date: Date;
  description: string;
  id: string;
  time: string;
  type: HearingType;
}) {
  return {
    type: "hearing" as const,
    id: hearing.id,
    title: `Audiencia: ${hearing.description}`,
    date: hearing.date.toISOString().slice(0, 10),
    hearingType: hearing.type,
    time: hearing.time
  };
}

function toCalendarEventFromRow(row: CalendarListEventRow): CalendarEvent {
  const date = toCalendarDateString(row.event_date);

  if (row.event_type === "payment_due") {
    return {
      type: "payment_due",
      id: row.id,
      title: row.title,
      date,
      amount: Number(row.amount ?? 0),
      status: row.status === "overdue" ? "overdue" : "pending"
    };
  }

  if (row.event_type === "task_due") {
    return {
      type: "task_due",
      id: row.id,
      title: row.title,
      date,
      status: row.status === "in_progress" ? "in_progress" : "pending"
    };
  }

  return {
    type: "hearing",
    id: row.id,
    title: row.title,
    date,
    hearingType: row.hearing_type ?? "other",
    time: row.time ?? ""
  };
}

function compareCalendarEvents(first: CalendarEvent, second: CalendarEvent) {
  return first.date.localeCompare(second.date) || first.id.localeCompare(second.id);
}

function joinSql(parts: Prisma.Sql[], separator: Prisma.Sql) {
  return parts
    .slice(1)
    .reduce((joined, part) => Prisma.sql`${joined} ${separator} ${part}`, parts[0]);
}

function toCalendarDateString(date: Date | string) {
  return date instanceof Date ? date.toISOString().slice(0, 10) : date.slice(0, 10);
}

function toIlikeContainsPattern(search: string) {
  return `%${search.replace(/[\\%_]/g, "\\$&")}%`;
}

function encodeCalendarCursor(cursor: CalendarCursor) {
  return Buffer.from(
    JSON.stringify({
      date: cursor.date,
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
      date: parsed.date,
      id: parsed.id
    };
  } catch {
    return null;
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
