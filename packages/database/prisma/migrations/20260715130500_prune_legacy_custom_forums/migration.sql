DELETE FROM "forums"
WHERE "template_id" IS NULL;

UPDATE "forums"
SET
  "province_id" = "forum_templates"."province_id",
  "name" = "forum_templates"."name",
  "description" = "forum_templates"."description",
  "active" = true,
  "is_system" = true
FROM "forum_templates"
WHERE "forums"."template_id" = "forum_templates"."id";
