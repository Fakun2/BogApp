import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import type { AiChatInput } from "../ai.schemas";
import type { AiToolDefinition } from "../ai.catalog";
import type { AiContext } from "../types/ai-context.types";

@Injectable()
export class AiContextService {
  constructor(private readonly prisma: PrismaService) {}

  async buildContext(tenantId: string, input: AiChatInput, tool: AiToolDefinition): Promise<AiContext> {
    if (tool.requiresCase && !input.caseId) {
      throw new ForbiddenException("Esta herramienta requiere un expediente del tenant activo.");
    }

    const caseContext = input.caseId ? await this.getCaseContext(tenantId, input.caseId) : null;

    return {
      case: caseContext,
      deadlines: input.caseId ? await this.getDeadlines(tenantId, input.caseId, tool) : [],
      documents: input.caseId ? await this.getDocuments(tenantId, input.caseId, tool) : [],
      tool: tool.id
    };
  }

  private async getCaseContext(tenantId: string, caseId: string) {
    const tenantCase = await this.prisma.case.findFirst({
      select: {
        caption: true,
        caseNumber: true,
        description: true,
        status: true,
        subject: true
      },
      where: { id: caseId, tenantId }
    });

    if (!tenantCase) {
      throw new NotFoundException("No se encontro el expediente en el tenant activo.");
    }

    return {
      ...tenantCase,
      status: tenantCase.status.toString()
    };
  }

  private async getDocuments(tenantId: string, caseId: string, tool: AiToolDefinition) {
    if (tool.id !== "case_documents") {
      return [];
    }

    return this.prisma.caseExpenseAttachment.findMany({
      select: {
        id: true,
        mimeType: true,
        originalName: true,
        sizeBytes: true
      },
      where: {
        caseId,
        deletedAt: null,
        tenantId
      },
      orderBy: { createdAt: "desc" },
      take: 10
    }).then((attachments) =>
      attachments.map((attachment) => ({
        id: attachment.id,
        mimeType: attachment.mimeType,
        name: attachment.originalName,
        sizeBytes: attachment.sizeBytes
      }))
    );
  }

  private async getDeadlines(tenantId: string, caseId: string, tool: AiToolDefinition) {
    if (tool.id !== "case_deadlines") {
      return [];
    }

    const [tasks, hearings] = await this.prisma.$transaction([
      this.prisma.caseTask.findMany({
        select: {
          endDate: true,
          id: true,
          name: true,
          status: true
        },
        where: {
          caseId,
          status: { notIn: ["completed", "cancelled"] },
          tenantId
        },
        orderBy: [{ endDate: "asc" }, { createdAt: "desc" }],
        take: 10
      }),
      this.prisma.caseHearing.findMany({
        select: {
          date: true,
          description: true,
          id: true,
          type: true
        },
        where: {
          caseId,
          tenantId
        },
        orderBy: [{ date: "asc" }, { createdAt: "desc" }],
        take: 10
      })
    ]);

    return [
      ...tasks.map((task) => ({
        dueDate: task.endDate,
        id: task.id,
        kind: "task" as const,
        status: task.status.toString(),
        title: task.name
      })),
      ...hearings.map((hearing) => ({
        dueDate: hearing.date,
        id: hearing.id,
        kind: "hearing" as const,
        status: "scheduled",
        title: hearing.description || hearing.type.toString()
      }))
    ];
  }
}
