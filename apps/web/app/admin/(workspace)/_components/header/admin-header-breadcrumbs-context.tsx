"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";

export type AdminHeaderBreadcrumbItem = {
  href?: string;
  label: string;
};

type AdminHeaderBreadcrumbsContextValue = {
  breadcrumbs: AdminHeaderBreadcrumbItem[] | null;
  setBreadcrumbs: (items: AdminHeaderBreadcrumbItem[] | null) => void;
};

const AdminHeaderBreadcrumbsContext = createContext<AdminHeaderBreadcrumbsContextValue | null>(null);

export function AdminHeaderBreadcrumbsProvider({ children }: { children: ReactNode }) {
  const [breadcrumbs, setBreadcrumbsState] = useState<AdminHeaderBreadcrumbItem[] | null>(null);
  const setBreadcrumbs = useCallback((items: AdminHeaderBreadcrumbItem[] | null) => {
    setBreadcrumbsState(items);
  }, []);
  const value = useMemo(
    () => ({ breadcrumbs, setBreadcrumbs }),
    [breadcrumbs, setBreadcrumbs]
  );

  return (
    <AdminHeaderBreadcrumbsContext.Provider value={value}>
      {children}
    </AdminHeaderBreadcrumbsContext.Provider>
  );
}

export function useAdminHeaderBreadcrumbs() {
  const context = useContext(AdminHeaderBreadcrumbsContext);
  if (!context) {
    throw new Error("useAdminHeaderBreadcrumbs must be used within AdminHeaderBreadcrumbsProvider.");
  }
  return context;
}

