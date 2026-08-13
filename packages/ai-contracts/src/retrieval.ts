export type AiLegalDocumentType =
  | "constitution"
  | "code"
  | "law"
  | "decree"
  | "resolution"
  | "jurisprudence"
  | "doctrine"
  | "other";

export type AiLegalNormUnitType =
  | "preamble"
  | "part"
  | "book"
  | "title"
  | "chapter"
  | "section"
  | "article"
  | "paragraph"
  | "clause"
  | "subsection"
  | "other";

export type AiEmbeddingStatus = "pending" | "embedded" | "stale" | "failed";

export type AiLegalNormChunkSource = {
  id: string;
  type: "legal_norm";
  title: string;
  canonicalRef: string;
  jurisdiction: string;
  documentType: AiLegalDocumentType;
  versionLabel: string;
  effectiveFrom: Date;
  effectiveTo: Date | null;
};
