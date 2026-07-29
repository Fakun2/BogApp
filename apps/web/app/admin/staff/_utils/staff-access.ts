import type { StaffListResponse, StaffWorker } from "../_types/staff.types";

export function canManageWorkerByHierarchy({
  actorRoleCode,
  currentUserId,
  roleOptions,
  worker
}: {
  actorRoleCode: string | undefined;
  currentUserId: string | undefined;
  roleOptions: StaffListResponse["filterOptions"]["roles"];
  worker: StaffWorker;
}) {
  const actorHierarchy = getRoleHierarchy(actorRoleCode, roleOptions);
  const workerHierarchy = getRoleHierarchy(worker.role?.code, roleOptions, worker.role);

  if (actorHierarchy === 3) {
    return true;
  }

  if (currentUserId && currentUserId === worker.userId) {
    return false;
  }

  return workerHierarchy < actorHierarchy;
}

function getRoleHierarchy(
  roleCode: string | undefined,
  roleOptions: StaffListResponse["filterOptions"]["roles"],
  fallbackRole?: unknown
) {
  if (!roleCode) {
    return 0;
  }

  const option = roleOptions.find((role) => role.code === roleCode);
  const hierarchyLevel = readHierarchyLevel(option) ?? readHierarchyLevel(fallbackRole);

  if (hierarchyLevel) {
    return hierarchyLevel;
  }

  if (roleCode === "owner") {
    return 3;
  }

  if (roleCode === "admin") {
    return 2;
  }

  return 1;
}

function readHierarchyLevel(role: unknown) {
  if (!role || typeof role !== "object" || !("hierarchyLevel" in role)) {
    return null;
  }

  const hierarchyLevel = (role as { hierarchyLevel?: unknown }).hierarchyLevel;
  return hierarchyLevel === 1 || hierarchyLevel === 2 || hierarchyLevel === 3
    ? hierarchyLevel
    : null;
}
