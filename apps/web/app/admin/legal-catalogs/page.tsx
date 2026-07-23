"use client";

import { useState, type ReactNode } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Gavel,
  Loader2,
  MapPinned,
  XCircle,
  type LucideIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequirePermission } from "../_components/auth";
import { adminSurfaceClassName, adminSurfacePrimaryClassName } from "../_constants/dashboard";
import { useForumsQuery, useProvincesQuery } from "./_hooks/use-legal-catalogs-query";
import type {
  Forum,
  LegalCatalogPage,
  LegalCatalogSort,
  LegalCatalogTab,
  Province
} from "./_types/legal-catalogs.types";

const catalogPageSize = 8;
const provinceFilterPageSize = 50;

export default function LegalCatalogsPage() {
  const [tab, setTab] = useState<LegalCatalogTab>("forums");
  const [forumOffset, setForumOffset] = useState(0);
  const [provinceOffset, setProvinceOffset] = useState(0);
  const [sort, setSort] = useState<LegalCatalogSort>("name:asc");
  const [provinceId, setProvinceId] = useState("");

  const forumsQuery = useForumsQuery({
    limit: catalogPageSize,
    offset: forumOffset,
    provinceId: provinceId || undefined,
    sort
  });
  const provincesQuery = useProvincesQuery({
    limit: catalogPageSize,
    offset: provinceOffset,
    sort
  });
  const provinceOptionsQuery = useProvincesQuery({
    limit: provinceFilterPageSize,
    offset: 0,
    sort: "name:asc"
  });

  const currentPageInfo =
    tab === "forums" ? forumsQuery.data?.pageInfo : provincesQuery.data?.pageInfo;
  const provinceOptions = provinceOptionsQuery.data?.items ?? [];

  function updateSort(nextSort: LegalCatalogSort) {
    setSort(nextSort);
    setForumOffset(0);
    setProvinceOffset(0);
  }

  function updateProvinceFilter(nextProvinceId: string) {
    setProvinceId(nextProvinceId);
    setForumOffset(0);
  }

  return (
    <RequirePermission
      mode="any"
      permissions={["forums:read", "provinces:read"]}
      fallback={<RestrictedLegalCatalogs />}
    >
      <div className="flex h-[calc(100svh-136px)] min-h-0 flex-col gap-4 overflow-hidden md:h-[calc(100svh-152px)]">
        <div className="grid shrink-0 gap-3 md:grid-cols-3">
          <Metric
            icon={Gavel}
            label="Fueros encontrados"
            value={forumsQuery.data?.pageInfo.total ?? 0}
          />
          <Metric
            icon={MapPinned}
            label="Provincias activas"
            value={provincesQuery.data?.pageInfo.total ?? 0}
          />
          <Metric
            icon={Building2}
            label="Items por pagina"
            value={currentPageInfo?.limit ?? catalogPageSize}
          />
        </div>

        <Card
          data-admin-surface
          className={`${adminSurfaceClassName} flex min-h-0 flex-1 flex-col overflow-hidden border-0 shadow-[var(--admin-card-shadow)]`}
        >
          <CardHeader className="flex shrink-0 flex-col gap-4 border-b border-border/30 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <CardTitle className={`text-lg font-semibold ${adminSurfacePrimaryClassName}`}>
                Catalogos legales
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Consulta provincias globales y fueros disponibles para expedientes.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="grid grid-cols-2 gap-2 rounded-md border border-border/40 bg-secondary/30 p-1">
                <TabButton active={tab === "forums"} onClick={() => setTab("forums")}>
                  Fueros
                </TabButton>
                <TabButton active={tab === "provinces"} onClick={() => setTab("provinces")}>
                  Provincias
                </TabButton>
              </div>
              <CatalogFilters
                provinceId={provinceId}
                provinceOptions={provinceOptions}
                showProvinceFilter={tab === "forums"}
                sort={sort}
                onProvinceChange={updateProvinceFilter}
                onSortChange={updateSort}
              />
            </div>
          </CardHeader>
          <CardContent className="grid min-h-0 flex-1 grid-rows-[1fr_auto] gap-3 overflow-hidden px-6 py-5">
            {tab === "forums" ? (
              <ForumsPanel
                page={forumsQuery.data}
                error={forumsQuery.error}
                loading={forumsQuery.isLoading}
              />
            ) : (
              <ProvincesPanel
                page={provincesQuery.data}
                error={provincesQuery.error}
                loading={provincesQuery.isLoading}
              />
            )}
            <CatalogPagination
              pageInfo={currentPageInfo}
              onNext={() =>
                tab === "forums"
                  ? setForumOffset((current) => current + catalogPageSize)
                  : setProvinceOffset((current) => current + catalogPageSize)
              }
              onPrevious={() =>
                tab === "forums"
                  ? setForumOffset((current) => Math.max(0, current - catalogPageSize))
                  : setProvinceOffset((current) => Math.max(0, current - catalogPageSize))
              }
            />
          </CardContent>
        </Card>
      </div>
    </RequirePermission>
  );
}

function ForumsPanel({
  error,
  loading,
  page
}: {
  error: Error | null;
  loading: boolean;
  page: LegalCatalogPage<Forum> | undefined;
}) {
  return (
    <CatalogTable
      columns={["Fuero", "Provincia", "Origen", "Estado"]}
      emptyText="Todavia no hay fueros cargados."
      error={error}
      loading={loading}
      rows={(page?.items ?? []).map((forum) => ({
        id: forum.id,
        cells: [
          <CatalogName key="name" description={forum.description} name={forum.name} />,
          forum.province?.province ?? forum.province?.name ?? "Sin provincia",
          forum.isSystem ? "Sistema" : "Custom",
          <StatusPill key="status" active={forum.active} />
        ]
      }))}
    />
  );
}

function ProvincesPanel({
  error,
  loading,
  page
}: {
  error: Error | null;
  loading: boolean;
  page: LegalCatalogPage<Province> | undefined;
}) {
  return (
    <CatalogTable
      columns={["Provincia", "Codigo", "Pais", "Estado"]}
      emptyText="Todavia no hay provincias cargadas."
      error={error}
      loading={loading}
      rows={(page?.items ?? []).map((province) => ({
        id: province.id,
        cells: [
          province.name,
          province.code,
          province.country,
          <StatusPill key="status" active={province.active} />
        ]
      }))}
    />
  );
}

function CatalogFilters({
  provinceId,
  provinceOptions,
  showProvinceFilter,
  sort,
  onProvinceChange,
  onSortChange
}: {
  provinceId: string;
  provinceOptions: Province[];
  showProvinceFilter: boolean;
  sort: LegalCatalogSort;
  onProvinceChange: (provinceId: string) => void;
  onSortChange: (sort: LegalCatalogSort) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="grid grid-cols-2 gap-1 rounded-md border border-border/40 bg-card p-1">
        <FilterButton active={sort === "name:asc"} onClick={() => onSortChange("name:asc")}>
          A-Z
        </FilterButton>
        <FilterButton active={sort === "name:desc"} onClick={() => onSortChange("name:desc")}>
          Z-A
        </FilterButton>
      </div>
      {showProvinceFilter ? (
        <select
          className="h-10 rounded-md border border-border/40 bg-card px-3 text-sm text-foreground shadow-none outline-none focus:border-ring/50 focus:ring-2 focus:ring-ring/10"
          value={provinceId}
          onChange={(event) => onProvinceChange(event.target.value)}
          aria-label="Filtrar fueros por provincia"
        >
          <option value="">Todas las provincias</option>
          {provinceOptions.map((province) => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}

function CatalogTable({
  columns,
  emptyText,
  error,
  loading,
  rows
}: {
  columns: string[];
  emptyText: string;
  error: Error | null;
  loading: boolean;
  rows: Array<{ cells: ReactNode[]; id: string }>;
}) {
  const fillerRows = Math.max(0, catalogPageSize - rows.length);

  return (
    <div className="grid min-h-0 grid-rows-[auto_1fr] overflow-hidden rounded-md border border-border/30">
      <div className="grid shrink-0 grid-cols-4 border-b border-border/30 bg-secondary/30 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {columns.map((column) => (
          <div key={column} className="px-4 py-3">
            {column}
          </div>
        ))}
      </div>
      <div className="h-full min-h-0 overflow-hidden">
        {loading ? (
          <StateBox
            icon={<Loader2 className="h-4 w-4 animate-spin" />}
            text="Cargando catalogo..."
          />
        ) : error ? (
          <StateBox icon={<XCircle className="h-4 w-4" />} text={error.message} tone="error" />
        ) : rows.length === 0 ? (
          <StateBox text={emptyText} />
        ) : (
          <div className="grid h-full grid-rows-8">
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-4 items-center border-b border-border/20 text-sm last:border-b-0"
              >
                {row.cells.map((cell, index) => (
                  <div key={index} className="min-w-0 px-4 py-3">
                    <div className="truncate">{cell}</div>
                  </div>
                ))}
              </div>
            ))}
            {Array.from({ length: fillerRows }).map((_, index) => (
              <div key={`filler-${index}`} className="border-b border-border/10 last:border-b-0" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CatalogName({ description, name }: { description?: string | null; name: string }) {
  return (
    <span className="block min-w-0">
      <span className="block truncate font-medium text-foreground">{name}</span>
      {description ? (
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{description}</span>
      ) : null}
    </span>
  );
}

function CatalogPagination({
  pageInfo,
  onNext,
  onPrevious
}: {
  pageInfo:
    | {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        limit: number;
        offset: number;
        total: number;
      }
    | undefined;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const currentPage = pageInfo ? Math.floor(pageInfo.offset / pageInfo.limit) + 1 : 1;
  const totalPages = pageInfo ? Math.max(1, Math.ceil(pageInfo.total / pageInfo.limit)) : 1;

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>
        Pagina {currentPage} de {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <PageButton disabled={!pageInfo?.hasPreviousPage} onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </PageButton>
        <PageButton disabled={!pageInfo?.hasNextPage} onClick={onNext}>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </PageButton>
      </div>
    </div>
  );
}

function PageButton({
  children,
  disabled,
  onClick
}: {
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex size-9 items-center justify-center rounded-md border border-border/40 bg-card text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${active ? "bg-emerald-500/10 text-emerald-700" : "bg-muted text-muted-foreground"}`}
    >
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} border-0 shadow-[var(--admin-card-shadow)]`}
    >
      <CardContent className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}

function TabButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`h-9 rounded-md px-3 text-sm font-medium transition-colors ${active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function FilterButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`h-8 rounded px-3 text-xs font-semibold transition-colors ${active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function StateBox({
  icon,
  text,
  tone = "muted"
}: {
  icon?: ReactNode;
  text: string;
  tone?: "error" | "muted";
}) {
  return (
    <div
      className={`flex h-full min-h-0 items-center justify-center gap-2 px-6 text-center text-sm ${tone === "error" ? "bg-destructive/5 text-destructive" : "text-muted-foreground"}`}
    >
      {icon}
      {text}
    </div>
  );
}

function RestrictedLegalCatalogs() {
  return (
    <Card
      data-admin-surface
      className="mx-auto max-w-xl rounded-xl border-0 bg-card text-card-foreground shadow-[var(--admin-card-shadow)]"
    >
      <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <Gavel className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Catalogos restringidos</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Necesitas permisos para consultar fueros o provincias del sistema.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
