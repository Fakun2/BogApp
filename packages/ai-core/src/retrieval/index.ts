export const LEGAL_NORM_CHUNKING_STRATEGY = "legal-norm-unit-v1" as const;

export const LEGAL_NORM_EMBEDDING_DIMENSIONS = 1536 as const;

export type LegalNormRetrievedSource = {
  id: string;
  type: "legal_norm";
  title: string;
  canonicalRef: string;
  jurisdiction: string;
  versionLabel: string;
  effectiveFrom: Date;
  effectiveTo: Date | null;
};

export type RetrievedContextChunk = {
  id: string;
  content: string;
  source: {
    id: string;
    type: "case" | "client" | "task" | "hearing" | "expense" | "document" | "legal_norm";
    title?: string;
    canonicalRef?: string;
    jurisdiction?: string;
    versionLabel?: string;
  };
  score?: number;
};

export type RetrievalResult = {
  chunks: RetrievedContextChunk[];
};
