-- Add DNI to users and seed the staff create permission for existing databases.
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "dni" TEXT;

DROP INDEX IF EXISTS "users_dni_key";
CREATE INDEX IF NOT EXISTS "users_dni_idx" ON "users" ("dni");

CREATE INDEX IF NOT EXISTS "tenant_memberships_tenant_id_status_idx"
  ON "tenant_memberships" ("tenant_id", "status");
CREATE INDEX IF NOT EXISTS "practice_areas_tenant_id_active_name_idx"
  ON "practice_areas" ("tenant_id", "active", "name");
CREATE INDEX IF NOT EXISTS "roles_is_system_name_idx"
  ON "roles" ("is_system", "name");
CREATE INDEX IF NOT EXISTS "tenant_membership_practice_areas_practice_area_id_tenant_membership_id_idx"
  ON "tenant_membership_practice_areas" ("practice_area_id", "tenant_membership_id");

INSERT INTO "permissions" ("id", "code", "resource", "action", "updated_at")
VALUES
  ('20000000-0000-0000-0000-000000000104', 'staff:create', 'staff', 'create', CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO UPDATE SET
  "resource" = EXCLUDED."resource",
  "action" = EXCLUDED."action",
  "updated_at" = CURRENT_TIMESTAMP;

INSERT INTO "role_permissions" ("id", "role_id", "permission_id")
SELECT grants.id, roles.id, permissions.id
FROM (
  VALUES
    ('20000000-0000-0000-0000-000000000304'::uuid, 'admin'),
    ('20000000-0000-0000-0000-000000000305'::uuid, 'owner')
) AS grants(id, role_code)
JOIN "roles" roles ON roles."code" = grants.role_code
JOIN "permissions" permissions ON permissions."code" = 'staff:create'
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
