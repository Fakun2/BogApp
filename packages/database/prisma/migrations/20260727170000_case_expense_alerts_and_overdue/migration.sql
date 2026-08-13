-- Add system-managed overdue status for expenses.
ALTER TYPE "CaseExpenseStatus" ADD VALUE IF NOT EXISTS 'overdue';

-- Store optional alert configuration for future notification flows.
ALTER TABLE "case_expenses"
  ADD COLUMN "alert_enabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "alert_at" TIMESTAMPTZ(6);

CREATE INDEX "case_expenses_tenant_id_alert_at_idx" ON "case_expenses"("tenant_id", "alert_at");
