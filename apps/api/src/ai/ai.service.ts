import { Injectable } from "@nestjs/common";
import { aiModels, aiToolsById } from "./ai.catalog";
import type { AiChatInput } from "./ai.schemas";
import { AiAuditService } from "./audit/ai-audit.service";
import { AiContextService } from "./context/ai-context.service";
import { AiPolicyService } from "./policies/ai-policy.service";
import { AiPromptBuilderService } from "./prompts/ai-prompt-builder.service";
import { AiProviderService } from "./providers/ai-provider.service";

@Injectable()
export class AiService {
  constructor(
    private readonly audit: AiAuditService,
    private readonly context: AiContextService,
    private readonly policy: AiPolicyService,
    private readonly promptBuilder: AiPromptBuilderService,
    private readonly provider: AiProviderService
  ) {}

  async listTools(tenantId: string, userId: string) {
    const access = await this.policy.validateTenantUserAccess(tenantId, userId);

    return {
      models: aiModels,
      tools: this.policy.filterAllowedTools(access)
    };
  }

  async startChat(tenantId: string, userId: string, input: AiChatInput) {
    const access = await this.policy.validateTenantUserAccess(tenantId, userId);
    const tool = aiToolsById[input.tool];

    this.policy.assertCanUseTool(access, tool);

    try {
      const context = await this.context.buildContext(tenantId, input, tool);
      const systemPrompt = this.promptBuilder.buildSystemPrompt(tool, context, input);
      const providerResponse = await this.provider.generate({
        context,
        model: input.model,
        prompt: input.prompt,
        systemPrompt,
        tenantId,
        tool: tool.id,
        userId
      });

      const runId = await this.audit.recordChat({
        caseId: input.caseId,
        finishReason: providerResponse.finishReason,
        inputTokens: providerResponse.usage.inputTokens,
        model: input.model,
        outputTokens: providerResponse.usage.outputTokens,
        promptLength: input.prompt.length,
        status: "accepted",
        tenantId,
        tool: tool.id,
        userId
      });

      return {
        id: runId ?? `ai-chat-${Date.now()}`,
        guardrails: {
          mode: "read_only" as const,
          requiredPermissions: tool.requiredPermissions
        },
        message: {
          role: "assistant" as const,
          content: providerResponse.content
        },
        model: input.model,
        status: "accepted" as const,
        tool: tool.id
      };
    } catch (error) {
      await this.audit.recordChat({
        caseId: input.caseId,
        errorCode: getAuditErrorCode(error),
        errorMessage: getAuditErrorMessage(error),
        model: input.model,
        promptLength: input.prompt.length,
        status: "failed",
        tenantId,
        tool: tool.id,
        userId
      });

      throw error;
    }
  }
}

function getAuditErrorCode(error: unknown) {
  return error instanceof Error ? error.constructor.name : "UnknownError";
}

function getAuditErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Error desconocido.";
}
