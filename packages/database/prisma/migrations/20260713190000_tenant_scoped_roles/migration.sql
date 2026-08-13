ALTER TABLE "roles" ADD COLUMN "tenant_id" UUID;

ALTER TABLE "roles"
ADD CONSTRAINT "roles_tenant_id_fkey"
FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "roles_tenant_id_active_name_idx" ON "roles"("tenant_id", "active", "name");

ALTER TABLE "tenant_memberships" DROP CONSTRAINT "tenant_memberships_role_id_fkey";

ALTER TABLE "tenant_memberships" ALTER COLUMN "role_id" DROP NOT NULL;

ALTER TABLE "tenant_memberships"
ADD CONSTRAINT "tenant_memberships_role_id_fkey"
FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
