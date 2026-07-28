CREATE TABLE "case_expense_attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "expense_id" UUID NOT NULL,
    "uploaded_by_user_id" UUID NOT NULL,
    "storage_provider" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "object_key" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "checksum" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "case_expense_attachments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "case_expense_attachments_tenant_id_idx" ON "case_expense_attachments"("tenant_id");
CREATE INDEX "case_expense_attachments_case_id_idx" ON "case_expense_attachments"("case_id");
CREATE INDEX "case_expense_attachments_expense_id_idx" ON "case_expense_attachments"("expense_id");
CREATE INDEX "case_expense_attachments_uploaded_by_user_id_idx" ON "case_expense_attachments"("uploaded_by_user_id");
CREATE INDEX "case_expense_attachments_tenant_id_case_id_idx" ON "case_expense_attachments"("tenant_id", "case_id");
CREATE INDEX "case_expense_attachments_tenant_id_expense_id_idx" ON "case_expense_attachments"("tenant_id", "expense_id");
CREATE INDEX "case_expense_attachments_tenant_id_deleted_at_idx" ON "case_expense_attachments"("tenant_id", "deleted_at");

ALTER TABLE "case_expense_attachments"
  ADD CONSTRAINT "case_expense_attachments_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "case_expense_attachments"
  ADD CONSTRAINT "case_expense_attachments_case_id_fkey"
  FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "case_expense_attachments"
  ADD CONSTRAINT "case_expense_attachments_expense_id_fkey"
  FOREIGN KEY ("expense_id") REFERENCES "case_expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "case_expense_attachments"
  ADD CONSTRAINT "case_expense_attachments_uploaded_by_user_id_fkey"
  FOREIGN KEY ("uploaded_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
