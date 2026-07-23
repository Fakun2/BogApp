INSERT INTO "permissions" ("id", "code", "resource", "action", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'roles:update', 'roles', 'update', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'roles:delete', 'roles', 'delete', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'provinces:read', 'provinces', 'read', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO UPDATE SET
  "resource" = EXCLUDED."resource",
  "action" = EXCLUDED."action",
  "updated_at" = CURRENT_TIMESTAMP;

WITH permission_map AS (
  SELECT *
  FROM (VALUES
    ('roles:modify', 'roles:update'),
    ('roles:eliminate', 'roles:delete'),
    ('jurisdictions:read', 'provinces:read'),
    ('finance:write', 'finance:create'),
    ('finance:write', 'finance:update'),
    ('finance:write', 'finance:delete')
  ) AS mapping("old_code", "new_code")
)
INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "created_at")
SELECT gen_random_uuid(), "role_permissions"."role_id", "new_permissions"."id", CURRENT_TIMESTAMP
FROM "role_permissions"
JOIN "permissions" AS "old_permissions"
  ON "old_permissions"."id" = "role_permissions"."permission_id"
JOIN permission_map
  ON permission_map."old_code" = "old_permissions"."code"
JOIN "permissions" AS "new_permissions"
  ON "new_permissions"."code" = permission_map."new_code"
ON CONFLICT ("role_id", "permission_id") DO NOTHING;

DELETE FROM "role_permissions"
USING "permissions"
WHERE "role_permissions"."permission_id" = "permissions"."id"
  AND "permissions"."code" IN (
    'roles:modify',
    'roles:eliminate',
    'forums:create',
    'forums:update',
    'forums:delete',
    'jurisdictions:read',
    'jurisdictions:create',
    'jurisdictions:update',
    'jurisdictions:delete',
    'finance:write'
  );

DELETE FROM "permissions"
WHERE "code" IN (
  'roles:modify',
  'roles:eliminate',
  'forums:create',
  'forums:update',
  'forums:delete',
  'jurisdictions:read',
  'jurisdictions:create',
  'jurisdictions:update',
  'jurisdictions:delete',
  'finance:write'
);
