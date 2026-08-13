CREATE TYPE "FinanceCategoryKind" AS ENUM ('income', 'expense', 'both');

CREATE TABLE "global_finance_categories" (
  "id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "kind" "FinanceCategoryKind" NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "global_finance_categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tenant_finance_categories" (
  "id" UUID NOT NULL,
  "tenant_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "kind" "FinanceCategoryKind" NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "tenant_finance_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "global_finance_categories_code_key"
  ON "global_finance_categories"("code");

CREATE INDEX "global_finance_categories_active_kind_name_idx"
  ON "global_finance_categories"("active", "kind", "name");

CREATE UNIQUE INDEX "tenant_finance_categories_tenant_id_name_key"
  ON "tenant_finance_categories"("tenant_id", "name");

CREATE INDEX "tenant_finance_categories_tenant_id_active_idx"
  ON "tenant_finance_categories"("tenant_id", "active");

CREATE INDEX "tenant_finance_categories_tenant_id_kind_idx"
  ON "tenant_finance_categories"("tenant_id", "kind");

ALTER TABLE "tenant_finance_categories"
  ADD CONSTRAINT "tenant_finance_categories_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "global_finance_categories" ("id", "name", "code", "kind", "active", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'Sin categoría', 'sin-categoria', 'both', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Pago de cliente', 'pago-de-cliente', 'income', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Anticipo / seña', 'anticipo-sena', 'income', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Honorarios profesionales', 'honorarios-profesionales', 'income', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Recupero de gastos', 'recupero-de-gastos', 'income', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Tasa de justicia', 'tasa-de-justicia', 'expense', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Gastos judiciales', 'gastos-judiciales', 'expense', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Diligenciamientos', 'diligenciamientos', 'expense', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Notificaciones y cédulas', 'notificaciones-cedulas', 'expense', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Peritos / informes técnicos', 'peritos-informes-tecnicos', 'expense', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Movilidad y viáticos', 'movilidad-viaticos', 'expense', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Papelería e impresiones', 'papeleria-impresiones', 'expense', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Correo / mensajería', 'correo-mensajeria', 'expense', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Servicios del estudio', 'servicios-del-estudio', 'expense', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Transferencia interna', 'transferencia-interna', 'both', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "kind" = EXCLUDED."kind",
  "active" = EXCLUDED."active",
  "updated_at" = CURRENT_TIMESTAMP;

ALTER TABLE tenant_finance_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_finance_categories_tenant_isolation ON tenant_finance_categories;
CREATE POLICY tenant_finance_categories_tenant_isolation
  ON tenant_finance_categories
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
