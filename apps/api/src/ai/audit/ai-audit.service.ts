import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import type { AiModel, AiTool } from "../ai.schemas";

type AiAuditInput = {
  caseId?: string;
  errorCode?: string;
  errorMessage?: string;
  finishReason?: string;
  inputTokens?: number;
  model: AiModel;
  outputTokens?: number;
  provider?: string;
  promptLength: number;
  status: "accepted" | "failed";
  tenantId: string;
  tool: AiTool;
  userId: string;
};

@Injectable()
export class AiAuditService {
  private readonly logger = new Logger(AiAuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async recordChat(input: AiAuditInput) {
    try {
      const run = await this.prisma.runWithTenant(input.tenantId, (tx) =>
        tx.aiChatRun.create({
          select: { id: true },
          data: {
            caseId: input.caseId,
            errorCode: input.errorCode,
            errorMessage: sanitizeAuditMessage(input.errorMessage),
            finishReason: input.finishReason,
            inputTokens: input.inputTokens,
            model: input.model,
            outputTokens: input.outputTokens,
            promptLength: input.promptLength,
            provider: input.provider,
            status: input.status,
            tenantId: input.tenantId,
            tool: input.tool,
            userId: input.userId
          }
        })
      );

      return run.id;
    } catch (error) {
      this.logger.error("No se pudo registrar auditoria de IA.", error);
      return null;
    }
  }
}

function sanitizeAuditMessage(message?: string) {
  if (!message) {
    return undefined;
  }

  return message.slice(0, 500);
}
