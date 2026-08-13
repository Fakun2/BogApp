import type { AiAuthorizedContext } from "./context";
import type { AiModel } from "./models";
import type { AiTool } from "./tools";

export type AiProviderRequest = {
  context: AiAuthorizedContext;
  model: AiModel;
  prompt: string;
  systemPrompt: string;
  tenantId: string;
  tool: AiTool;
  userId: string;
};

export type AiProviderResponse = {
  content: string;
  finishReason: "stop" | "length" | "error";
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
};
