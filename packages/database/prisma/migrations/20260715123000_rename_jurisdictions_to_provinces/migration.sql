ALTER TABLE IF EXISTS "jurisdiction_templates" RENAME TO "provinces";

ALTER INDEX IF EXISTS "jurisdiction_templates_code_key" RENAME TO "provinces_code_key";
ALTER INDEX IF EXISTS "jurisdiction_templates_active_display_order_idx" RENAME TO "provinces_active_display_order_idx";

ALTER TABLE IF EXISTS "forum_templates"
DROP CONSTRAINT IF EXISTS "forum_templates_jurisdiction_template_id_fkey";

ALTER TABLE IF EXISTS "forum_templates"
RENAME COLUMN "jurisdiction_template_id" TO "province_id";

ALTER INDEX IF EXISTS "forum_templates_jurisdiction_template_id_name_key"
RENAME TO "forum_templates_province_id_name_key";
ALTER INDEX IF EXISTS "forum_templates_jurisdiction_template_id_active_display_ord_idx"
RENAME TO "forum_templates_province_id_active_display_order_idx";

ALTER TABLE IF EXISTS "forum_templates"
ADD CONSTRAINT "forum_templates_province_id_fkey"
  FOREIGN KEY ("province_id") REFERENCES "provinces"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE IF EXISTS "forums"
ADD COLUMN IF NOT EXISTS "province_id" uuid;

UPDATE "forums"
SET "province_id" = COALESCE(
  (
    SELECT "jurisdictions"."template_id"
    FROM "jurisdictions"
    WHERE "jurisdictions"."id" = "forums"."jurisdiction_id"
    LIMIT 1
  ),
  (
    SELECT "forum_templates"."province_id"
    FROM "forum_templates"
    WHERE "forum_templates"."id" = "forums"."template_id"
    LIMIT 1
  )
)
WHERE "forums"."province_id" IS NULL;

ALTER TABLE IF EXISTS "forums"
DROP CONSTRAINT IF EXISTS "forums_jurisdiction_id_fkey";

ALTER TABLE IF EXISTS "forums"
DROP CONSTRAINT IF EXISTS "forums_province_id_fkey";

ALTER TABLE IF EXISTS "forums"
ADD CONSTRAINT "forums_province_id_fkey"
  FOREIGN KEY ("province_id") REFERENCES "provinces"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

DROP INDEX IF EXISTS "forums_tenant_id_jurisdiction_id_name_key";
CREATE UNIQUE INDEX IF NOT EXISTS "forums_tenant_id_province_id_name_key"
  ON "forums"("tenant_id", "province_id", "name");

DROP INDEX IF EXISTS "forums_jurisdiction_id_idx";
CREATE INDEX IF NOT EXISTS "forums_province_id_idx" ON "forums"("province_id");

ALTER TABLE IF EXISTS "forums"
DROP COLUMN IF EXISTS "jurisdiction_id";

DROP TABLE IF EXISTS "jurisdictions";
