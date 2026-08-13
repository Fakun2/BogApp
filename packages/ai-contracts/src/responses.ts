export type AiResponseStatus = "completed" | "queued" | "failed";

export type AiSourceReference = {
  id: string;
  type: "case" | "client" | "task" | "hearing" | "expense" | "document" | "legal_norm";
  title?: string;
  canonicalRef?: string;
  jurisdiction?: string;
  versionLabel?: string;
};

export type AiTextResponse = {
  requestId: string;
  status: AiResponseStatus;
  content: string;
  sources: AiSourceReference[];
};
