-- Add currency tracking to case expenses and persistent sync jobs for paid expenses -> cashbox.

ALTER TABLE "case_expenses"
  ADD COLUMN "currency_code" CHAR(3);

UPDATE "case_expenses" AS ce
SET "currency_code" = ts."default_currency_code"
FROM "tenant_settings" AS ts
WHERE ts."tenant_id" = ce."tenant_id"
  AND ce."currency_code" IS NULL;

UPDATE "case_expenses"
SET "currency_code" = 'ARS'
WHERE "currency_code" IS NULL;

ALTER TABLE "case_expenses"
  ALTER COLUMN "currency_code" SET NOT NULL;

ALTER TABLE "case_expenses"
  ADD CONSTRAINT "case_expenses_currency_code_fkey"
  FOREIGN KEY ("currency_code") REFERENCES "currencies"("code")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TYPE "CaseExpenseCashboxSyncJobAction" AS ENUM (
  'upsert_cashbox_movement',
  'delete_cashbox_movement'
);

CREATE TYPE "CaseExpenseCashboxSyncJobStatus" AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed'
);

CREATE TABLE "case_expense_cashbox_sync_jobs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "case_id" UUID NOT NULL,
  "case_expense_id" UUID NOT NULL,
  "action" "CaseExpenseCashboxSyncJobAction" NOT NULL,
  "status" "CaseExpenseCashboxSyncJobStatus" NOT NULL DEFAULT 'pending',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "next_run_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_error" TEXT,
  "actor_user_id" UUID,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "case_expense_cashbox_sync_jobs_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "case_expense_cashbox_sync_jobs"
  ADD CONSTRAINT "case_expense_cashbox_sync_jobs_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "case_expense_cashbox_sync_jobs"
  ADD CONSTRAINT "case_expense_cashbox_sync_jobs_actor_user_id_fkey"
  FOREIGN KEY ("actor_user_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "cashbox_movements"
  ADD COLUMN "case_expense_id" UUID;

CREATE UNIQUE INDEX "case_expense_cashbox_sync_jobs_case_expense_id_key"
  ON "case_expense_cashbox_sync_jobs"("case_expense_id");

CREATE INDEX "case_expense_cashbox_sync_jobs_status_next_run_at_idx"
  ON "case_expense_cashbox_sync_jobs"("status", "next_run_at");

CREATE INDEX "case_expense_cashbox_sync_jobs_tenant_id_status_idx"
  ON "case_expense_cashbox_sync_jobs"("tenant_id", "status");

CREATE INDEX "case_expense_cashbox_sync_jobs_tenant_id_case_id_idx"
  ON "case_expense_cashbox_sync_jobs"("tenant_id", "case_id");

CREATE INDEX "case_expenses_tenant_id_currency_code_idx"
  ON "case_expenses"("tenant_id", "currency_code");

CREATE UNIQUE INDEX "cashbox_movements_case_expense_id_key"
  ON "cashbox_movements"("case_expense_id");

CREATE INDEX "cashbox_movements_tenant_id_case_expense_id_idx"
  ON "cashbox_movements"("tenant_id", "case_expense_id");
