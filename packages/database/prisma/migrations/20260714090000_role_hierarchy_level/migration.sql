ALTER TABLE "roles"
ADD COLUMN IF NOT EXISTS "hierarchy_level" INTEGER NOT NULL DEFAULT 1;

UPDATE "roles"
SET "hierarchy_level" = CASE
  WHEN "code" = 'owner' THEN 3
  WHEN "code" = 'admin' THEN 2
  ELSE COALESCE("hierarchy_level", 1)
END;

CREATE INDEX IF NOT EXISTS "roles_hierarchy_level_idx" ON "roles"("hierarchy_level");
