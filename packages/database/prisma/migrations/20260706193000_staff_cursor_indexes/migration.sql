-- Ensure staff queries use tenant-scoped indexes and DNI is not globally unique.
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
