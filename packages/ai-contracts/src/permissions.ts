export const aiPermissions = [
  "ai:case_summary",
  "ai:case_chat",
  "ai:draft_create",
  "ai:document_index",
  "ai:feedback_create",
  "ai:audit_read"
] as const;

export type AiPermission = (typeof aiPermissions)[number];

