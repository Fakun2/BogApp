-- Replace global reusable practice area templates for onboarding.
WITH desired_templates (id, code, name, display_order) AS (
  VALUES
    ('10000000-0000-0000-0000-000000000101'::uuid, 'derecho-civil', 'Derecho Civil', 10),
    ('10000000-0000-0000-0000-000000000102'::uuid, 'derecho-familia', 'Derecho de Familia', 20),
    ('10000000-0000-0000-0000-000000000103'::uuid, 'derecho-sucesorio', 'Derecho Sucesorio', 30),
    ('10000000-0000-0000-0000-000000000104'::uuid, 'derecho-comercial-societario', 'Derecho Comercial y Societario', 40),
    ('10000000-0000-0000-0000-000000000105'::uuid, 'derecho-laboral', 'Derecho Laboral', 50),
    ('10000000-0000-0000-0000-000000000106'::uuid, 'derecho-penal', 'Derecho Penal', 60),
    ('10000000-0000-0000-0000-000000000107'::uuid, 'derecho-administrativo', 'Derecho Administrativo', 70),
    ('10000000-0000-0000-0000-000000000108'::uuid, 'derecho-tributario', 'Derecho Tributario', 80),
    ('10000000-0000-0000-0000-000000000109'::uuid, 'derecho-concursal', 'Derecho Concursal', 90),
    ('10000000-0000-0000-0000-000000000110'::uuid, 'mediacion-metodos-alternativos-resolucion-conflictos', 'Mediación y Métodos Alternativos de Resolución de Conflictos', 100),
    ('10000000-0000-0000-0000-000000000111'::uuid, 'derecho-notarial-escribania', 'Derecho Notarial - Escribanía', 110)
)
INSERT INTO "practice_area_templates" ("id", "code", "name", "display_order", "active", "updated_at")
SELECT id, code, name, display_order, true, CURRENT_TIMESTAMP
FROM desired_templates
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "display_order" = EXCLUDED."display_order",
  "active" = true,
  "updated_at" = CURRENT_TIMESTAMP;

UPDATE "practice_area_templates"
SET "active" = false,
    "updated_at" = CURRENT_TIMESTAMP
WHERE "code" NOT IN (
  'derecho-civil',
  'derecho-familia',
  'derecho-sucesorio',
  'derecho-comercial-societario',
  'derecho-laboral',
  'derecho-penal',
  'derecho-administrativo',
  'derecho-tributario',
  'derecho-concursal',
  'mediacion-metodos-alternativos-resolucion-conflictos',
  'derecho-notarial-escribania'
);
