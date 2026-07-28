import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import type {
  CreateCaseTaskInput,
  ListCaseTasksQuery,
  UpdateCaseTaskInput
} from "../cases.schemas";

@Injectable()
export class CaseTasksUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async list(tenantId: string, caseId: string, query: ListCaseTasksQuery) {
    const cursor = decodeTasksCursor(query.cursor);
    await this.findTenantCaseOrThrow(tenantId, caseId);
    const tasks = await this.prisma.caseTask.findMany({
      where: {
        caseId,
        tenantId,
        ...(cursor ? { OR: getTaskCursorWhere(cursor) } : {})
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: query.limit + 1,
      select: caseTaskSelect
    });
    const pageItems = tasks.slice(0, query.limit);
    const lastItem = pageItems.at(-1);
    const hasNextPage = tasks.length > query.limit;

    return {
      items: pageItems.map(toCaseTaskDto),
      pageInfo: {
        limit: query.limit,
        offset: 0,
        nextCursor:
          hasNextPage && lastItem
            ? encodeTasksCursor({ createdAt: lastItem.createdAt, id: lastItem.id })
            : null,
        hasNextPage,
        total: pageItems.length + (hasNextPage ? 1 : 0)
      }
    };
  }

  async create(tenantId: string, caseId: string, input: CreateCaseTaskInput) {
    await this.findTenantCaseOrThrow(tenantId, caseId);
    const createdTask = await this.prisma.caseTask.create({
      data: {
        ...toCaseTaskWriteData(input),
        caseId,
        tenantId
      },
      select: caseTaskSelect
    });

    return toCaseTaskDto(createdTask);
  }

  async update(tenantId: string, caseId: string, taskId: string, input: UpdateCaseTaskInput) {
    await this.findTenantTaskOrThrow(tenantId, caseId, taskId);
    const updatedTask = await this.prisma.caseTask.update({
      where: { id: taskId },
      data: toCaseTaskWriteData(input),
      select: caseTaskSelect
    });

    return toCaseTaskDto(updatedTask);
  }

  async delete(tenantId: string, caseId: string, taskId: string) {
    await this.findTenantTaskOrThrow(tenantId, caseId, taskId);
    await this.prisma.caseTask.delete({ where: { id: taskId } });

    return { status: "ok" as const };
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
}

const caseTaskSelect = {
  caseId: true,
  createdAt: true,
  endDate: true,
  id: true,
  name: true,
  notes: true,
  startDate: true,
  status: true,
  updatedAt: true
} satisfies Prisma.CaseTaskSelect;

type CaseTaskWithSelect = Prisma.CaseTaskGetPayload<{ select: typeof caseTaskSelect }>;

function toCaseTaskWriteData(input: CreateCaseTaskInput | UpdateCaseTaskInput) {
  return {
    endDate: input.endDate ? new Date(`${input.endDate}T00:00:00.000Z`) : null,
    name: input.name,
    notes: input.notes ?? null,
    startDate: input.startDate ? new Date(`${input.startDate}T00:00:00.000Z`) : null,
    status: input.status
  };
}

function toCaseTaskDto(item: CaseTaskWithSelect) {
  return {
    id: item.id,
    caseId: item.caseId,
    name: item.name,
    startDate: item.startDate ? item.startDate.toISOString().slice(0, 10) : null,
    endDate: item.endDate ? item.endDate.toISOString().slice(0, 10) : null,
    status: item.status,
    notes: item.notes,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString()
  };
}

type TasksCursor = {
  createdAt: Date;
  id: string;
};

function encodeTasksCursor(cursor: TasksCursor) {
  return Buffer.from(
    JSON.stringify({
      createdAt: cursor.createdAt.toISOString(),
      id: cursor.id
    })
  ).toString("base64url");
}

function decodeTasksCursor(cursor?: string): TasksCursor | null {
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

function getTaskCursorWhere(cursor: TasksCursor): Prisma.CaseTaskWhereInput[] {
  return [
    { createdAt: { lt: cursor.createdAt } },
    { createdAt: cursor.createdAt, id: { gt: cursor.id } }
  ];
}
