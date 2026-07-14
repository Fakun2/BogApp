INSERT INTO "permissions" ("id", "code", "resource", "action", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'roles:read', 'roles', 'read', now(), now()),
  (gen_random_uuid(), 'roles:create', 'roles', 'create', now(), now()),
  (gen_random_uuid(), 'roles:modify', 'roles', 'modify', now(), now()),
  (gen_random_uuid(), 'roles:eliminate', 'roles', 'eliminate', now(), now())
ON CONFLICT ("code") DO UPDATE
SET
  "resource" = EXCLUDED."resource",
  "action" = EXCLUDED."action",
  "updated_at" = now();

INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "created_at")
SELECT gen_random_uuid(), "roles"."id", "permissions"."id", now()
FROM "roles"
CROSS JOIN "permissions"
WHERE "roles"."code" = 'owner'
  AND "permissions"."code" IN (
    'roles:read',
    'roles:create',
    'roles:modify',
    'roles:eliminate'
  )
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
