CREATE INDEX IF NOT EXISTS "case_expenses_pending_due_idx"
ON "case_expenses" ("tenant_id", "case_id", "payment_date")
WHERE "status" = 'pending';
