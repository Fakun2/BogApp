ALTER TABLE "case_tasks"
ADD COLUMN IF NOT EXISTS "assigned_membership_id" UUID,
ADD COLUMN IF NOT EXISTS "last_seen_at" TIMESTAMPTZ(6);

CREATE INDEX IF NOT EXISTS "case_tasks_tenant_id_assigned_membership_id_idx"
  ON "case_tasks"("tenant_id", "assigned_membership_id");

CREATE INDEX IF NOT EXISTS "case_tasks_tenant_id_last_seen_at_idx"
  ON "case_tasks"("tenant_id", "last_seen_at");

ALTER TABLE "case_tasks"
DROP CONSTRAINT IF EXISTS "case_tasks_assigned_membership_id_fkey";

ALTER TABLE "case_tasks"
ADD CONSTRAINT "case_tasks_assigned_membership_id_fkey"
  FOREIGN KEY ("assigned_membership_id") REFERENCES "tenant_memberships"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
