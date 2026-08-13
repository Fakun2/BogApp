import type { AiPermission } from "./permissions";

export type AiRequestPurpose = "case_summary" | "case_chat" | "legal_draft" | "document_index";

export type InternalAiRequestContext = {
  requestId: string;
  tenantId: string;
  userId: string;
  permissions: AiPermission[];
  purpose: AiRequestPurpose;
};

export type CaseScopedAiRequest = InternalAiRequestContext & {
  caseId: string;
};

