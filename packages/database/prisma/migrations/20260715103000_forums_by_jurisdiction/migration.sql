ALTER TABLE "forums"
ADD COLUMN IF NOT EXISTS "jurisdiction_id" uuid;

UPDATE "forums"
SET "jurisdiction_id" = (
  SELECT "jurisdictions"."id"
  FROM "jurisdictions"
  WHERE "jurisdictions"."tenant_id" = "forums"."tenant_id"
    AND "jurisdictions"."active" = true
  ORDER BY "jurisdictions"."name" ASC
  LIMIT 1
)
WHERE "forums"."jurisdiction_id" IS NULL;

ALTER TABLE "forums"
DROP CONSTRAINT IF EXISTS "forums_jurisdiction_id_fkey";

ALTER TABLE "forums"
ADD CONSTRAINT "forums_jurisdiction_id_fkey"
  FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

DROP INDEX IF EXISTS "forums_tenant_id_name_key";
CREATE UNIQUE INDEX IF NOT EXISTS "forums_tenant_id_jurisdiction_id_name_key"
  ON "forums"("tenant_id", "jurisdiction_id", "name");

CREATE INDEX IF NOT EXISTS "forums_jurisdiction_id_idx" ON "forums"("jurisdiction_id");
