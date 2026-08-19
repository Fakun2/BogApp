CREATE UNIQUE INDEX IF NOT EXISTS "cases_tenant_id_id_key"
  ON "cases"("tenant_id", "id");

CREATE UNIQUE INDEX IF NOT EXISTS "document_categories_tenant_id_id_key"
  ON "document_categories"("tenant_id", "id");

ALTER TABLE "documents"
  DROP CONSTRAINT IF EXISTS "documents_case_id_fkey";

ALTER TABLE "documents"
  DROP CONSTRAINT IF EXISTS "documents_category_id_fkey";

ALTER TABLE "documents"
  ADD CONSTRAINT "documents_tenant_id_case_id_fkey"
  FOREIGN KEY ("tenant_id", "case_id")
  REFERENCES "cases"("tenant_id", "id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE "documents"
  ADD CONSTRAINT "documents_tenant_id_category_id_fkey"
  FOREIGN KEY ("tenant_id", "category_id")
  REFERENCES "document_categories"("tenant_id", "id")
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
