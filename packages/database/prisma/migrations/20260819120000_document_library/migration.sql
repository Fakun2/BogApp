ALTER TYPE "DocumentStorageCleanupJobReason" ADD VALUE IF NOT EXISTS 'bulk_deleted';
ALTER TYPE "DocumentStorageCleanupJobReason" ADD VALUE IF NOT EXISTS 'folder_deleted';

CREATE TYPE "DocumentStatus" AS ENUM ('active', 'deleting');

CREATE TABLE "document_folders" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "parent_id" UUID,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "document_folders_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "document_folders_tenant_id_id_key"
  ON "document_folders"("tenant_id", "id");
CREATE UNIQUE INDEX "document_folders_tenant_parent_name_key"
  ON "document_folders"(
    "tenant_id",
    COALESCE("parent_id", '00000000-0000-0000-0000-000000000000'::uuid),
    lower("name")
  );
CREATE INDEX "document_folders_tenant_id_idx" ON "document_folders"("tenant_id");
CREATE INDEX "document_folders_tenant_id_parent_id_idx"
  ON "document_folders"("tenant_id", "parent_id");
CREATE INDEX "document_folders_tenant_id_name_idx" ON "document_folders"("tenant_id", "name");

ALTER TABLE "document_folders"
  ADD CONSTRAINT "document_folders_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "document_folders"
  ADD CONSTRAINT "document_folders_tenant_id_parent_id_fkey"
  FOREIGN KEY ("tenant_id", "parent_id") REFERENCES "document_folders"("tenant_id", "id")
  ON DELETE CASCADE ON UPDATE CASCADE;

DROP INDEX IF EXISTS "documents_tenant_case_checksum_active_key";

ALTER TABLE "documents"
  ADD COLUMN "folder_id" UUID,
  ADD COLUMN "title" TEXT,
  ADD COLUMN "extension" TEXT,
  ADD COLUMN "status" "DocumentStatus" NOT NULL DEFAULT 'active',
  ADD COLUMN "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "documents"
SET
  "title" = "original_name",
  "extension" = CASE
    WHEN "original_name" LIKE '%.%' THEN lower(regexp_replace("original_name", '^.*\.', ''))
    ELSE NULL
  END;

ALTER TABLE "documents"
  ALTER COLUMN "title" SET NOT NULL,
  ALTER COLUMN "case_id" DROP NOT NULL;

ALTER TABLE "documents"
  DROP CONSTRAINT IF EXISTS "documents_tenant_id_case_id_fkey";

ALTER TABLE "documents"
  ADD CONSTRAINT "documents_tenant_id_case_id_fkey"
  FOREIGN KEY ("tenant_id", "case_id") REFERENCES "cases"("tenant_id", "id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "documents"
  ADD CONSTRAINT "documents_tenant_id_folder_id_fkey"
  FOREIGN KEY ("tenant_id", "folder_id") REFERENCES "document_folders"("tenant_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "documents_folder_id_idx" ON "documents"("folder_id");
CREATE INDEX "documents_tenant_id_folder_id_idx" ON "documents"("tenant_id", "folder_id");
CREATE INDEX "documents_tenant_id_folder_id_created_at_idx"
  ON "documents"("tenant_id", "folder_id", "created_at");
CREATE INDEX "documents_tenant_id_status_idx" ON "documents"("tenant_id", "status");
CREATE INDEX "documents_tenant_id_mime_type_idx" ON "documents"("tenant_id", "mime_type");
CREATE INDEX "documents_tenant_id_title_idx" ON "documents"("tenant_id", "title");

CREATE UNIQUE INDEX "documents_tenant_folder_checksum_active_key"
  ON "documents"(
    "tenant_id",
    COALESCE("folder_id", '00000000-0000-0000-0000-000000000000'::uuid),
    "checksum"
  )
  WHERE "deleted_at" IS NULL AND "status" = 'active' AND "checksum" IS NOT NULL;

ALTER TABLE "document_folders" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS document_folders_tenant_isolation ON "document_folders";
CREATE POLICY document_folders_tenant_isolation
  ON "document_folders"
  USING (tenant_scoped(tenant_id))
  WITH CHECK (tenant_scoped(tenant_id));

ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS documents_tenant_isolation ON "documents";
CREATE POLICY documents_tenant_isolation
  ON "documents"
  USING (tenant_scoped(tenant_id) OR current_setting('app.document_cleanup_worker', true) = 'on')
  WITH CHECK (tenant_scoped(tenant_id) OR current_setting('app.document_cleanup_worker', true) = 'on');

ALTER TABLE "document_storage_cleanup_jobs" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS document_storage_cleanup_jobs_tenant_isolation
  ON "document_storage_cleanup_jobs";
CREATE POLICY document_storage_cleanup_jobs_tenant_isolation
  ON "document_storage_cleanup_jobs"
  USING (tenant_scoped(tenant_id) OR current_setting('app.document_cleanup_worker', true) = 'on')
  WITH CHECK (tenant_scoped(tenant_id) OR current_setting('app.document_cleanup_worker', true) = 'on');
