CREATE TABLE "tenant_membership_practice_areas" (
  "id" UUID NOT NULL,
  "tenant_membership_id" UUID NOT NULL,
  "practice_area_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "tenant_membership_practice_areas_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tenant_membership_practice_areas_tenant_membership_id_practice_area_id_key"
  ON "tenant_membership_practice_areas"("tenant_membership_id", "practice_area_id");

CREATE INDEX "tenant_membership_practice_areas_practice_area_id_idx"
  ON "tenant_membership_practice_areas"("practice_area_id");

ALTER TABLE "tenant_membership_practice_areas"
  ADD CONSTRAINT "tenant_membership_practice_areas_tenant_membership_id_fkey"
  FOREIGN KEY ("tenant_membership_id") REFERENCES "tenant_memberships"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tenant_membership_practice_areas"
  ADD CONSTRAINT "tenant_membership_practice_areas_practice_area_id_fkey"
  FOREIGN KEY ("practice_area_id") REFERENCES "practice_areas"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
