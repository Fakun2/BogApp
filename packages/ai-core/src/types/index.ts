export type { AiAuthorizedContext, AiModel, AiTool } from "@bogaap/ai-contracts";

export type AiModelProvider = "ollama" | "openai" | "mock";

export type AiModelConfig = {
  provider: AiModelProvider;
  model: string;
};
