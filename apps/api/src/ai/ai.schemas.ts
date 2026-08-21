import type { AiModel, AiTool } from "@bogaap/ai-contracts";
import { aiModelIds, aiToolIds } from "@bogaap/ai-contracts";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const aiModelSchema = z.enum(aiModelIds);
export const aiToolSchema = z.enum(aiToolIds);

export const aiChatSchema = z.object({
  caseId: z.string().uuid().optional(),
  model: aiModelSchema.default("justinia-legal"),
  prompt: z.string().trim().min(1).max(4000),
  tool: aiToolSchema.default("general")
});

export class AiChatDto extends createZodDto(aiChatSchema) { }

export type AiChatInput = z.infer<typeof aiChatSchema>;
export type { AiModel, AiTool };

export class AiToolDto {
  id!: AiTool;
  name!: string;
  description!: string;
  requiredPermissions!: string[];
}

export class AiModelDto {
  id!: AiModel;
  name!: string;
  provider!: string;
}

export class AiToolsResponseDto {
  models!: AiModelDto[];
  tools!: AiToolDto[];
}

export class AiChatMessageDto {
  role!: "assistant";
  content!: string;
}

export class AiChatGuardrailsDto {
  mode!: "read_only";
  requiredPermissions!: string[];
}

export class AiChatResponseDto {
  id!: string;
  model!: AiModel;
  tool!: AiTool;
  status!: "accepted";
  guardrails!: AiChatGuardrailsDto;
  message!: AiChatMessageDto;
}
