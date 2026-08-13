import type { AiTool } from "./tools";

export type AiCaseContext = {
  caseNumber: string;
  caption: string;
  description: string | null;
  subject: string | null;
  status: string;
};

export type AiDocumentContext = {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
};

export type AiDeadlineContext = {
  id: string;
  kind: "hearing" | "task";
  title: string;
  dueDate: Date | null;
  status: string;
};

export type AiAuthorizedContext = {
  case: AiCaseContext | null;
  documents: AiDocumentContext[];
  deadlines: AiDeadlineContext[];
  tool: AiTool;
};
