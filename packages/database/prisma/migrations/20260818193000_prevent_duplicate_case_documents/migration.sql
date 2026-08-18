WITH ranked_documents AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      PARTITION BY "tenant_id", "case_id", "checksum"
      ORDER BY "created_at" DESC, "id" DESC
    ) AS duplicate_rank
  FROM "documents"
  WHERE "deleted_at" IS NULL AND "checksum" IS NOT NULL
)
UPDATE "documents"
SET "checksum" = NULL
WHERE "id" IN (
  SELECT "id"
  FROM ranked_documents
  WHERE duplicate_rank > 1
);

CREATE UNIQUE INDEX "documents_tenant_case_checksum_active_key"
  ON "documents"("tenant_id", "case_id", "checksum")
  WHERE "deleted_at" IS NULL AND "checksum" IS NOT NULL;
