import { hasPermissions } from "@/lib/auth/permissions";
import type { BogaapSession } from "@/lib/auth/session";
import type { AdminCommandSection, AdminNavSection } from "../_types/admin";

export function getAuthorizedNavSections(
  session: BogaapSession | null,
  sections: AdminNavSection[]
): AdminNavSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => isAuthorizedItem(session, item))
    }))
    .filter((section) => section.items.length > 0);
}

export function getAuthorizedCommandSections(
  session: BogaapSession | null,
  sections: AdminCommandSection[]
): AdminCommandSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => isAuthorizedItem(session, item))
    }))
    .filter((section) => section.items.length > 0);
}

function isAuthorizedItem(
  session: BogaapSession | null,
  item: {
    permissionMode?: "all" | "any";
    requiredPermissions?: string[];
    status?: "ready" | "soon";
  }
) {
  if (item.status === "soon") {
    return false;
  }

  return hasPermissions(session, item.requiredPermissions, item.permissionMode);
}
