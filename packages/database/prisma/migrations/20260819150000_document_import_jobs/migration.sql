CREATE TYPE "DocumentImportJobStatus" AS ENUM (
  'pending',
  'processing',
  'completed',
  'partial_failed',
  'canceled',
  'failed'
);

CREATE TYPE "DocumentImportItemStatus" AS ENUM (
  'processing',
  'completed',
  'skipped_duplicate',
  'rejected',
  'failed',
  'canceled'
);

CREATE TABLE "document_import_jobs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "root_folder_id" UUID,
  "created_by_user_id" UUID NOT NULL,
  "status" "DocumentImportJobStatus" NOT NULL DEFAULT 'pending',
  "total_files" INTEGER NOT NULL DEFAULT 0,
  "total_bytes" INTEGER NOT NULL DEFAULT 0,
  "processed_files" INTEGER NOT NULL DEFAULT 0,
  "completed_files" INTEGER NOT NULL DEFAULT 0,
  "skipped_files" INTEGER NOT NULL DEFAULT 0,
  "rejected_files" INTEGER NOT NULL DEFAULT 0,
  "failed_files" INTEGER NOT NULL DEFAULT 0,
  "last_error" TEXT,
  "started_at" TIMESTAMPTZ(6),
  "completed_at" TIMESTAMPTZ(6),
  "canceled_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "document_import_jobs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "document_import_items" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "import_job_id" UUID NOT NULL,
  "folder_id" UUID,
  "document_id" UUID,
  "relative_path" TEXT NOT NULL,
  "original_name" TEXT NOT NULL,
  "mime_type" TEXT NOT NULL,
  "size_bytes" INTEGER NOT NULL,
  "checksum" TEXT,
  "status" "DocumentImportItemStatus" NOT NULL,
  "error" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "document_import_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "document_import_jobs_tenant_id_id_key"
  ON "document_import_jobs"("tenant_id", "id");
CREATE INDEX "document_import_jobs_tenant_id_idx" ON "document_import_jobs"("tenant_id");
CREATE INDEX "document_import_jobs_tenant_id_status_idx"
  ON "document_import_jobs"("tenant_id", "status");
CREATE INDEX "document_import_jobs_tenant_id_created_at_idx"
  ON "document_import_jobs"("tenant_id", "created_at");
CREATE INDEX "document_import_jobs_root_folder_id_idx" ON "document_import_jobs"("root_folder_id");
CREATE INDEX "document_import_jobs_created_by_user_id_idx"
  ON "document_import_jobs"("created_by_user_id");

CREATE UNIQUE INDEX "document_import_items_tenant_id_import_job_id_relative_path_key"
  ON "document_import_items"("tenant_id", "import_job_id", "relative_path");
CREATE INDEX "document_import_items_tenant_id_idx" ON "document_import_items"("tenant_id");
CREATE INDEX "document_import_items_tenant_id_import_job_id_idx"
  ON "document_import_items"("tenant_id", "import_job_id");
CREATE INDEX "document_import_items_tenant_id_status_idx"
  ON "document_import_items"("tenant_id", "status");
CREATE INDEX "document_import_items_folder_id_idx" ON "document_import_items"("folder_id");
CREATE INDEX "document_import_items_document_id_idx" ON "document_import_items"("document_id");

ALTER TABLE "document_import_jobs"
  ADD CONSTRAINT "document_import_jobs_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "document_import_jobs"
  ADD CONSTRAINT "document_import_jobs_tenant_id_root_folder_id_fkey"
  FOREIGN KEY ("tenant_id", "root_folder_id") REFERENCES "document_folders"("tenant_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "document_import_jobs"
  ADD CONSTRAINT "document_import_jobs_created_by_user_id_fkey"
  FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "document_import_items"
  ADD CONSTRAINT "document_import_items_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "document_import_items"
  ADD CONSTRAINT "document_import_items_tenant_id_import_job_id_fkey"
  FOREIGN KEY ("tenant_id", "import_job_id") REFERENCES "document_import_jobs"("tenant_id", "id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "document_import_items"
  ADD CONSTRAINT "document_import_items_tenant_id_folder_id_fkey"
  FOREIGN KEY ("tenant_id", "folder_id") REFERENCES "document_folders"("tenant_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "document_import_items"
  ADD CONSTRAINT "document_import_items_tenant_id_document_id_fkey"
  FOREIGN KEY ("tenant_id", "document_id") REFERENCES "documents"("tenant_id", "id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "document_import_jobs" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS document_import_jobs_tenant_isolation ON "document_import_jobs";
CREATE POLICY document_import_jobs_tenant_isolation
  ON "document_import_jobs"
  USING (tenant_scoped(tenant_id))
  WITH CHECK (tenant_scoped(tenant_id));

ALTER TABLE "document_import_items" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS document_import_items_tenant_isolation ON "document_import_items";
CREATE POLICY document_import_items_tenant_isolation
  ON "document_import_items"
  USING (tenant_scoped(tenant_id))
  WITH CHECK (tenant_scoped(tenant_id));
