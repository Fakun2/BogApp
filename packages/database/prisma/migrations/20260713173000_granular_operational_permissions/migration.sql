INSERT INTO "permissions" ("id", "code", "resource", "action", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'staff:update', 'staff', 'update', now(), now()),
  (gen_random_uuid(), 'staff:delete', 'staff', 'delete', now(), now()),
  (gen_random_uuid(), 'clients:create', 'clients', 'create', now(), now()),
  (gen_random_uuid(), 'clients:update', 'clients', 'update', now(), now()),
  (gen_random_uuid(), 'clients:delete', 'clients', 'delete', now(), now()),
  (gen_random_uuid(), 'cases:create', 'cases', 'create', now(), now()),
  (gen_random_uuid(), 'cases:update', 'cases', 'update', now(), now()),
  (gen_random_uuid(), 'cases:delete', 'cases', 'delete', now(), now()),
  (gen_random_uuid(), 'tasks:create', 'tasks', 'create', now(), now()),
  (gen_random_uuid(), 'tasks:update', 'tasks', 'update', now(), now()),
  (gen_random_uuid(), 'tasks:delete', 'tasks', 'delete', now(), now()),
  (gen_random_uuid(), 'finance:create', 'finance', 'create', now(), now()),
  (gen_random_uuid(), 'finance:update', 'finance', 'update', now(), now()),
  (gen_random_uuid(), 'finance:delete', 'finance', 'delete', now(), now())
ON CONFLICT ("code") DO UPDATE
SET
  "resource" = EXCLUDED."resource",
  "action" = EXCLUDED."action",
  "updated_at" = now();

INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "created_at")
SELECT gen_random_uuid(), r."id", p."id", now()
FROM "roles" r
CROSS JOIN "permissions" p
WHERE r."code" = 'owner'
  AND p."resource" IN ('staff', 'clients', 'cases', 'tasks', 'finance')
  AND p."action" IN ('read', 'create', 'update', 'delete')
ON CONFLICT ("role_id", "permission_id") DO NOTHING;

INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "created_at")
SELECT gen_random_uuid(), r."id", p."id", now()
FROM "roles" r
CROSS JOIN "permissions" p
WHERE r."code" = 'admin'
  AND p."resource" IN ('staff', 'clients', 'cases', 'tasks', 'finance')
  AND p."action" IN ('read', 'create', 'update', 'delete')
ON CONFLICT ("role_id", "permission_id") DO NOTHING;

INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "created_at")
SELECT gen_random_uuid(), r."id", p."id", now()
FROM "roles" r
JOIN "permissions" p ON p."code" IN (
  'clients:read',
  'clients:create',
  'clients:update',
  'cases:read',
  'cases:create',
  'cases:update',
  'tasks:read',
  'tasks:create',
  'tasks:update',
  'finance:read'
)
WHERE r."code" = 'lawyer'
ON CONFLICT ("role_id", "permission_id") DO NOTHING;

INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "created_at")
SELECT gen_random_uuid(), r."id", p."id", now()
FROM "roles" r
JOIN "permissions" p ON p."code" IN (
  'clients:read',
  'cases:read',
  'tasks:read',
  'tasks:create',
  'tasks:update'
)
WHERE r."code" = 'paralegal'
ON CONFLICT ("role_id", "permission_id") DO NOTHING;

INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "created_at")
SELECT gen_random_uuid(), r."id", p."id", now()
FROM "roles" r
JOIN "permissions" p ON p."code" IN (
  'clients:read',
  'cases:read',
  'finance:read',
  'finance:create',
  'finance:update',
  'finance:delete'
)
WHERE r."code" = 'accounting'
ON CONFLICT ("role_id", "permission_id") DO NOTHING;

INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "created_at")
SELECT gen_random_uuid(), r."id", p."id", now()
FROM "roles" r
JOIN "permissions" p ON p."code" IN (
  'clients:read',
  'cases:read',
  'tasks:read',
  'finance:read'
)
WHERE r."code" = 'viewer'
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
