ALTER TABLE "forum_templates"
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

ALTER INDEX IF EXISTS "forum_templates_jurisdiction_template_id_active_display_order_i"
RENAME TO "forum_templates_jurisdiction_template_id_active_display_ord_idx";
