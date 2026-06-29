-- CreateTable
CREATE TABLE "practice_area_templates" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "practice_area_templates_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "practice_areas" ADD COLUMN "template_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "practice_area_templates_code_key" ON "practice_area_templates"("code");

-- CreateIndex
CREATE INDEX "practice_area_templates_active_display_order_idx" ON "practice_area_templates"("active", "display_order");

-- CreateIndex
CREATE INDEX "practice_areas_template_id_idx" ON "practice_areas"("template_id");

-- CreateIndex
CREATE UNIQUE INDEX "practice_areas_tenant_id_template_id_key" ON "practice_areas"("tenant_id", "template_id");

-- AddForeignKey
ALTER TABLE "practice_areas" ADD CONSTRAINT "practice_areas_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "practice_area_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed global reusable templates
INSERT INTO "practice_area_templates" ("id", "code", "name", "display_order", "updated_at")
VALUES
  ('10000000-0000-0000-0000-000000000001', 'laboral', 'Laboral', 10, CURRENT_TIMESTAMP),
  ('10000000-0000-0000-0000-000000000002', 'familia', 'Familia', 20, CURRENT_TIMESTAMP),
  ('10000000-0000-0000-0000-000000000003', 'sucesiones', 'Sucesiones', 30, CURRENT_TIMESTAMP),
  ('10000000-0000-0000-0000-000000000004', 'civil', 'Civil', 40, CURRENT_TIMESTAMP),
  ('10000000-0000-0000-0000-000000000005', 'comercial', 'Comercial', 50, CURRENT_TIMESTAMP),
  ('10000000-0000-0000-0000-000000000006', 'penal', 'Penal', 60, CURRENT_TIMESTAMP),
  ('10000000-0000-0000-0000-000000000007', 'administrativo', 'Administrativo', 70, CURRENT_TIMESTAMP),
  ('10000000-0000-0000-0000-000000000008', 'tributario', 'Tributario', 80, CURRENT_TIMESTAMP),
  ('10000000-0000-0000-0000-000000000009', 'danos-y-perjuicios', 'Danos y perjuicios', 90, CURRENT_TIMESTAMP),
  ('10000000-0000-0000-0000-000000000010', 'contratos', 'Contratos', 100, CURRENT_TIMESTAMP),
  ('10000000-0000-0000-0000-000000000011', 'societario', 'Societario', 110, CURRENT_TIMESTAMP),
  ('10000000-0000-0000-0000-000000000012', 'defensa-del-consumidor', 'Defensa del consumidor', 120, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;
