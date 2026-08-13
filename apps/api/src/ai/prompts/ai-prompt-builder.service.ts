import { Injectable } from "@nestjs/common";
import { buildBogappSystemPrompt } from "@bogaap/ai-core";
import type { AiChatInput } from "../ai.schemas";
import type { AiToolDefinition } from "../ai.catalog";
import type { AiContext } from "../types/ai-context.types";

@Injectable()
export class AiPromptBuilderService {
  buildSystemPrompt(tool: AiToolDefinition, context: AiContext, input: AiChatInput) {
    return buildBogappSystemPrompt({
      context,
      model: input.model,
      tool
    });
  }
}
