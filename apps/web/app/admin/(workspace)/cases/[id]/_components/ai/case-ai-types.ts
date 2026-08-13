export type CaseAiSourceType = "case" | "document" | "task" | "hearing" | "expense" | "legal";

export type CaseAiSource = {
  id: string;
  label: string;
  detail: string;
  type: CaseAiSourceType;
};

export type CaseAiMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  confidence?: "high" | "medium" | "low";
  createdAtLabel: string;
  sources?: CaseAiSource[];
};

export type CaseAiStatus = "idle" | "loading" | "error" | "no-permission" | "no-context";
