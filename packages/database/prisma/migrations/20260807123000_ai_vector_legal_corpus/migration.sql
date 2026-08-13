CREATE EXTENSION IF NOT EXISTS vector;

CREATE TYPE "AiLegalDocumentType" AS ENUM (
  'constitution',
  'code',
  'law',
  'decree',
  'resolution',
  'jurisprudence',
  'doctrine',
  'other'
);

CREATE TYPE "AiLegalNormUnitType" AS ENUM (
  'preamble',
  'part',
  'book',
  'title',
  'chapter',
  'section',
  'article',
  'paragraph',
  'clause',
  'subsection',
  'other'
);

CREATE TYPE "AiEmbeddingStatus" AS ENUM (
  'pending',
  'embedded',
  'stale',
  'failed'
);

CREATE TABLE "ai_legal_documents" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID,
  "jurisdiction" TEXT NOT NULL,
  "document_type" "AiLegalDocumentType" NOT NULL,
  "title" TEXT NOT NULL,
  "source_url" TEXT,
  "is_public" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ai_legal_documents_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ai_legal_documents_public_scope_check"
    CHECK (("is_public" = true AND "tenant_id" IS NULL) OR ("is_public" = false AND "tenant_id" IS NOT NULL))
);

CREATE TABLE "ai_legal_document_versions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID,
  "legal_document_id" UUID NOT NULL,
  "version_label" TEXT NOT NULL,
  "effective_from" DATE NOT NULL,
  "effective_to" DATE,
  "source_hash" TEXT NOT NULL,
  "source_published_at" DATE,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ai_legal_document_versions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ai_legal_document_versions_effective_range_check"
    CHECK ("effective_to" IS NULL OR "effective_to" >= "effective_from")
);

CREATE TABLE "ai_legal_norm_units" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID,
  "legal_document_version_id" UUID NOT NULL,
  "parent_unit_id" UUID,
  "canonical_ref" TEXT NOT NULL,
  "unit_type" "AiLegalNormUnitType" NOT NULL,
  "article_number" TEXT,
  "clause_number" TEXT,
  "order_index" INTEGER NOT NULL,
  "text" TEXT NOT NULL,
  "text_hash" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ai_legal_norm_units_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ai_legal_norm_units_text_not_empty_check" CHECK (length(trim("text")) > 0)
);

CREATE TABLE "ai_legal_norm_chunks" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID,
  "legal_norm_unit_id" UUID NOT NULL,
  "chunk_index" INTEGER NOT NULL DEFAULT 0,
  "content" TEXT NOT NULL,
  "content_hash" TEXT NOT NULL,
  "token_count" INTEGER,
  "embedding_model" TEXT NOT NULL,
  "embedding_dimensions" INTEGER NOT NULL DEFAULT 1536,
  "embedding" vector(1536),
  "status" "AiEmbeddingStatus" NOT NULL DEFAULT 'pending',
  "embedded_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ai_legal_norm_chunks_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ai_legal_norm_chunks_content_not_empty_check" CHECK (length(trim("content")) > 0),
  CONSTRAINT "ai_legal_norm_chunks_token_count_check" CHECK ("token_count" IS NULL OR "token_count" > 0),
  CONSTRAINT "ai_legal_norm_chunks_dimensions_check" CHECK ("embedding_dimensions" = 1536)
);

CREATE INDEX "ai_legal_documents_tenant_id_idx" ON "ai_legal_documents"("tenant_id");
CREATE INDEX "ai_legal_documents_tenant_id_jurisdiction_document_type_idx"
  ON "ai_legal_documents"("tenant_id", "jurisdiction", "document_type");
CREATE INDEX "ai_legal_documents_jurisdiction_document_type_title_idx"
  ON "ai_legal_documents"("jurisdiction", "document_type", "title");
CREATE INDEX "ai_legal_documents_is_public_idx" ON "ai_legal_documents"("is_public");

CREATE UNIQUE INDEX "ai_legal_document_versions_legal_document_id_version_label_key"
  ON "ai_legal_document_versions"("legal_document_id", "version_label");
CREATE INDEX "ai_legal_document_versions_tenant_id_idx" ON "ai_legal_document_versions"("tenant_id");
CREATE INDEX "ai_legal_document_versions_legal_document_id_effective_from_idx"
  ON "ai_legal_document_versions"("legal_document_id", "effective_from");
CREATE INDEX "ai_legal_document_versions_effective_from_effective_to_idx"
  ON "ai_legal_document_versions"("effective_from", "effective_to");

CREATE UNIQUE INDEX "ai_legal_norm_units_legal_document_version_id_canonical_ref_key"
  ON "ai_legal_norm_units"("legal_document_version_id", "canonical_ref");
CREATE UNIQUE INDEX "ai_legal_norm_units_legal_document_version_id_text_hash_key"
  ON "ai_legal_norm_units"("legal_document_version_id", "text_hash");
CREATE INDEX "ai_legal_norm_units_tenant_id_idx" ON "ai_legal_norm_units"("tenant_id");
CREATE INDEX "ai_legal_norm_units_legal_document_version_id_order_index_idx"
  ON "ai_legal_norm_units"("legal_document_version_id", "order_index");
CREATE INDEX "ai_legal_norm_units_parent_unit_id_idx" ON "ai_legal_norm_units"("parent_unit_id");
CREATE INDEX "ai_legal_norm_units_canonical_ref_idx" ON "ai_legal_norm_units"("canonical_ref");
CREATE INDEX "ai_legal_norm_units_unit_type_idx" ON "ai_legal_norm_units"("unit_type");
CREATE INDEX "ai_legal_norm_units_article_number_idx" ON "ai_legal_norm_units"("article_number");
CREATE INDEX "ai_legal_norm_units_text_tsv_idx"
  ON "ai_legal_norm_units" USING GIN (to_tsvector('spanish', "text"));

CREATE UNIQUE INDEX "ai_legal_norm_chunks_legal_norm_unit_id_chunk_index_key"
  ON "ai_legal_norm_chunks"("legal_norm_unit_id", "chunk_index");
CREATE UNIQUE INDEX "ai_legal_norm_chunks_legal_norm_unit_id_content_hash_key"
  ON "ai_legal_norm_chunks"("legal_norm_unit_id", "content_hash");
CREATE INDEX "ai_legal_norm_chunks_tenant_id_idx" ON "ai_legal_norm_chunks"("tenant_id");
CREATE INDEX "ai_legal_norm_chunks_tenant_id_status_updated_at_idx"
  ON "ai_legal_norm_chunks"("tenant_id", "status", "updated_at");
CREATE INDEX "ai_legal_norm_chunks_legal_norm_unit_id_idx" ON "ai_legal_norm_chunks"("legal_norm_unit_id");
CREATE INDEX "ai_legal_norm_chunks_embedding_model_status_idx"
  ON "ai_legal_norm_chunks"("embedding_model", "status");
CREATE INDEX "ai_legal_norm_chunks_content_tsv_idx"
  ON "ai_legal_norm_chunks" USING GIN (to_tsvector('spanish', "content"));
CREATE INDEX "ai_legal_norm_chunks_embedding_hnsw_idx"
  ON "ai_legal_norm_chunks" USING hnsw ("embedding" vector_cosine_ops)
  WHERE "embedding" IS NOT NULL;

ALTER TABLE "ai_legal_documents"
  ADD CONSTRAINT "ai_legal_documents_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ai_legal_document_versions"
  ADD CONSTRAINT "ai_legal_document_versions_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ai_legal_document_versions"
  ADD CONSTRAINT "ai_legal_document_versions_legal_document_id_fkey"
  FOREIGN KEY ("legal_document_id") REFERENCES "ai_legal_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ai_legal_norm_units"
  ADD CONSTRAINT "ai_legal_norm_units_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ai_legal_norm_units"
  ADD CONSTRAINT "ai_legal_norm_units_legal_document_version_id_fkey"
  FOREIGN KEY ("legal_document_version_id") REFERENCES "ai_legal_document_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ai_legal_norm_units"
  ADD CONSTRAINT "ai_legal_norm_units_parent_unit_id_fkey"
  FOREIGN KEY ("parent_unit_id") REFERENCES "ai_legal_norm_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ai_legal_norm_chunks"
  ADD CONSTRAINT "ai_legal_norm_chunks_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ai_legal_norm_chunks"
  ADD CONSTRAINT "ai_legal_norm_chunks_legal_norm_unit_id_fkey"
  FOREIGN KEY ("legal_norm_unit_id") REFERENCES "ai_legal_norm_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ai_legal_documents" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_legal_documents_tenant_isolation ON "ai_legal_documents";
CREATE POLICY ai_legal_documents_tenant_isolation
  ON "ai_legal_documents"
  USING ("tenant_id" IS NULL OR tenant_scoped("tenant_id"))
  WITH CHECK ("tenant_id" IS NULL OR tenant_scoped("tenant_id"));

ALTER TABLE "ai_legal_document_versions" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_legal_document_versions_tenant_isolation ON "ai_legal_document_versions";
CREATE POLICY ai_legal_document_versions_tenant_isolation
  ON "ai_legal_document_versions"
  USING ("tenant_id" IS NULL OR tenant_scoped("tenant_id"))
  WITH CHECK ("tenant_id" IS NULL OR tenant_scoped("tenant_id"));

ALTER TABLE "ai_legal_norm_units" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_legal_norm_units_tenant_isolation ON "ai_legal_norm_units";
CREATE POLICY ai_legal_norm_units_tenant_isolation
  ON "ai_legal_norm_units"
  USING ("tenant_id" IS NULL OR tenant_scoped("tenant_id"))
  WITH CHECK ("tenant_id" IS NULL OR tenant_scoped("tenant_id"));

ALTER TABLE "ai_legal_norm_chunks" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_legal_norm_chunks_tenant_isolation ON "ai_legal_norm_chunks";
CREATE POLICY ai_legal_norm_chunks_tenant_isolation
  ON "ai_legal_norm_chunks"
  USING ("tenant_id" IS NULL OR tenant_scoped("tenant_id"))
  WITH CHECK ("tenant_id" IS NULL OR tenant_scoped("tenant_id"));
