ALTER TABLE "document_storage_cleanup_jobs"
  DROP CONSTRAINT IF EXISTS "document_storage_cleanup_jobs_tenant_id_fkey";

ALTER TABLE "document_storage_cleanup_jobs"
  ADD CONSTRAINT "document_storage_cleanup_jobs_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
