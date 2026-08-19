ALTER TABLE "document_storage_cleanup_jobs"
  DROP CONSTRAINT IF EXISTS "document_storage_cleanup_jobs_document_id_fkey";

CREATE UNIQUE INDEX IF NOT EXISTS "documents_tenant_id_id_key"
  ON "documents"("tenant_id", "id");

CREATE INDEX IF NOT EXISTS "document_storage_cleanup_jobs_tenant_id_document_id_idx"
  ON "document_storage_cleanup_jobs"("tenant_id", "document_id");

ALTER TABLE "document_storage_cleanup_jobs"
  ADD CONSTRAINT "document_storage_cleanup_jobs_tenant_id_document_id_fkey"
  FOREIGN KEY ("tenant_id", "document_id")
  REFERENCES "documents"("tenant_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
