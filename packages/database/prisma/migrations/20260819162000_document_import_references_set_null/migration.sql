ALTER TABLE "document_import_jobs"
  DROP CONSTRAINT IF EXISTS "document_import_jobs_tenant_id_root_folder_id_fkey";

ALTER TABLE "document_import_jobs"
  ADD CONSTRAINT "document_import_jobs_tenant_id_root_folder_id_fkey"
  FOREIGN KEY ("tenant_id", "root_folder_id") REFERENCES "document_folders"("tenant_id", "id")
  ON DELETE SET NULL ("root_folder_id") ON UPDATE CASCADE;

ALTER TABLE "document_import_items"
  DROP CONSTRAINT IF EXISTS "document_import_items_tenant_id_folder_id_fkey";

ALTER TABLE "document_import_items"
  ADD CONSTRAINT "document_import_items_tenant_id_folder_id_fkey"
  FOREIGN KEY ("tenant_id", "folder_id") REFERENCES "document_folders"("tenant_id", "id")
  ON DELETE SET NULL ("folder_id") ON UPDATE CASCADE;

ALTER TABLE "document_import_items"
  DROP CONSTRAINT IF EXISTS "document_import_items_tenant_id_document_id_fkey";

ALTER TABLE "document_import_items"
  ADD CONSTRAINT "document_import_items_tenant_id_document_id_fkey"
  FOREIGN KEY ("tenant_id", "document_id") REFERENCES "documents"("tenant_id", "id")
  ON DELETE SET NULL ("document_id") ON UPDATE CASCADE;
