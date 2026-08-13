export type AiGuardrailMode = "read_only";

export type AiGuardrailResult = {
  mode: AiGuardrailMode;
  requiredPermissions: string[];
};
