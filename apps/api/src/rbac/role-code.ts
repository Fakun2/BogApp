export function createRoleCode(tenantId: string, name: string) {
  const tenantPrefix = tenantId.replace(/-/g, "").slice(0, 8);
  const slug = slugifyRoleName(name);

  return `tenant_${tenantPrefix}_${slug}`;
}

function slugifyRoleName(name: string) {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);

  return normalized || "rol";
}
