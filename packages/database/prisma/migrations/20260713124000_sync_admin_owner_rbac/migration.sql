-- Keep database RBAC grants aligned with apps/api/src/rbac/rbac.constants.ts.
-- Owner receives every known permission; Admin receives every permission except billing:manage.

INSERT INTO "role_permissions" ("id", "role_id", "permission_id")
SELECT gen_random_uuid(), roles."id", permissions."id"
FROM "roles" roles
CROSS JOIN "permissions" permissions
WHERE roles."code" = 'owner'
ON CONFLICT ("role_id", "permission_id") DO NOTHING;

INSERT INTO "role_permissions" ("id", "role_id", "permission_id")
SELECT gen_random_uuid(), roles."id", permissions."id"
FROM "roles" roles
CROSS JOIN "permissions" permissions
WHERE roles."code" = 'admin'
  AND permissions."code" <> 'billing:manage'
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
