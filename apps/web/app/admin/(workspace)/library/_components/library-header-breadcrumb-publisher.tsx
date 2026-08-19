"use client";

import { useEffect, useMemo } from "react";
import { useAdminHeaderBreadcrumbs } from "../../_components/header/admin-header-breadcrumbs-context";
import type { DocumentFolderDto } from "../_types/library.types";

export function LibraryHeaderBreadcrumbPublisher({
  breadcrumbs
}: {
  breadcrumbs: DocumentFolderDto[];
}) {
  const { setBreadcrumbs } = useAdminHeaderBreadcrumbs();
  const headerBreadcrumbs = useMemo(
    () => [
      { href: "/admin/library", label: "Biblioteca" },
      ...breadcrumbs.map((folder) => ({
        href: `/admin/library?folderId=${folder.id}`,
        label: folder.name
      }))
    ],
    [breadcrumbs]
  );

  useEffect(() => {
    setBreadcrumbs(headerBreadcrumbs);
    return () => setBreadcrumbs(null);
  }, [headerBreadcrumbs, setBreadcrumbs]);

  return null;
}

