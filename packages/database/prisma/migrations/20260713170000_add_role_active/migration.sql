ALTER TABLE "roles" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX "roles_active_name_idx" ON "roles"("active", "name");
