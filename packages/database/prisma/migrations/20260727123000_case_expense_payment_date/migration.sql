-- Backfill legacy expenses before making issue date mandatory.
UPDATE "case_expenses"
SET "expense_date" = CURRENT_DATE
WHERE "expense_date" IS NULL;

-- Add required payment date using the issue date as the safest historical fallback.
ALTER TABLE "case_expenses" ADD COLUMN "payment_date" DATE;

UPDATE "case_expenses"
SET "payment_date" = "expense_date";

ALTER TABLE "case_expenses" ALTER COLUMN "expense_date" SET NOT NULL;
ALTER TABLE "case_expenses" ALTER COLUMN "payment_date" SET NOT NULL;

CREATE INDEX "case_expenses_tenant_id_payment_date_idx" ON "case_expenses"("tenant_id", "payment_date");
