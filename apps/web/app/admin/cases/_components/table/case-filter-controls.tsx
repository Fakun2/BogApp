"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CaseDateInput } from "../sheet/case-date-input";
import type { CaseFilterKey, CaseFiltersDraft } from "../../_types/case-filter.types";
import type { ForumDto, ProvinceDto } from "../../_types/cases.types";
import {
  caseInstanceFilterOptions,
  caseStatusFilterOptions
} from "../../_utils/case-filter-options";
import { CaseFilterField, caseFilterControlClassName } from "./case-filter-field";

export function CaseFilterControls({
  disabled,
  draft,
  forums,
  forumsLoading,
  provinces,
  provincesLoading,
  onUpdateDraft
}: {
  disabled: boolean;
  draft: CaseFiltersDraft;
  forums: ForumDto[];
  forumsLoading: boolean;
  provinces: ProvinceDto[];
  provincesLoading: boolean;
  onUpdateDraft: <K extends CaseFilterKey>(key: K, value: CaseFiltersDraft[K]) => void;
}) {
  const filterRenderMap = [
    {
      key: "search",
      render: (
        <CaseFilterField label="Nombre">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={draft.search}
              onChange={(event) => onUpdateDraft("search", event.target.value)}
              placeholder="Nro., caratula o asunto"
              disabled={disabled}
              aria-label="Buscar expediente"
              className={caseFilterControlClassName("pl-9")}
            />
          </div>
        </CaseFilterField>
      )
    },
    {
      key: "filingDate",
      render: (
        <CaseFilterField label="Fecha de ingreso">
          <CaseDateInput
            className={caseFilterControlClassName(
              "min-h-11 max-h-11 overflow-hidden py-0 leading-normal text-left [color-scheme:light] dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:shrink-0 [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-date-and-time-value]:min-h-0 [&::-webkit-date-and-time-value]:text-left"
            )}
            disabled={disabled}
            value={draft.filingDate}
            onChange={(event) => onUpdateDraft("filingDate", event.target.value)}
            aria-label="Filtrar por fecha de ingreso"
          />
        </CaseFilterField>
      )
    },
    {
      key: "provinceId",
      render: (
        <CaseFilterField label="Provincia">
          <select
            className={caseFilterControlClassName()}
            disabled={disabled || provincesLoading}
            value={draft.provinceId}
            onChange={(event) => onUpdateDraft("provinceId", event.target.value)}
            aria-label="Filtrar por provincia"
          >
            <option value="">Todas</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </CaseFilterField>
      )
    },
    {
      key: "judicialCenter",
      render: (
        <CaseFilterField label="Centro judicial">
          <Input
            className={caseFilterControlClassName()}
            disabled={disabled}
            value={draft.judicialCenter}
            onChange={(event) => onUpdateDraft("judicialCenter", event.target.value)}
            placeholder="Centro judicial"
            aria-label="Filtrar por centro judicial"
          />
        </CaseFilterField>
      )
    },
    {
      key: "forumTemplateId",
      render: (
        <CaseFilterField label="Fuero">
          <select
            className={caseFilterControlClassName()}
            disabled={disabled || !draft.provinceId || forumsLoading}
            value={draft.forumTemplateId}
            onChange={(event) => onUpdateDraft("forumTemplateId", event.target.value)}
            aria-label="Filtrar por fuero"
          >
            <option value="">Todos</option>
            {forums.map((forum) => (
              <option key={forum.id} value={forum.id}>
                {forum.name}
              </option>
            ))}
          </select>
        </CaseFilterField>
      )
    },
    {
      key: "court",
      render: (
        <CaseFilterField label="Juzgado / Tribunal">
          <Input
            className={caseFilterControlClassName()}
            disabled={disabled}
            value={draft.court}
            onChange={(event) => onUpdateDraft("court", event.target.value)}
            placeholder="Juzgado o tribunal"
            aria-label="Filtrar por juzgado o tribunal"
          />
        </CaseFilterField>
      )
    },
    {
      key: "instance",
      render: (
        <CaseFilterField label="Instancia">
          <select
            className={caseFilterControlClassName()}
            disabled={disabled}
            value={draft.instance}
            onChange={(event) => onUpdateDraft("instance", event.target.value)}
            aria-label="Filtrar por instancia"
          >
            {caseInstanceFilterOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </CaseFilterField>
      )
    },
    {
      key: "status",
      render: (
        <CaseFilterField label="Estado">
          <select
            className={caseFilterControlClassName()}
            disabled={disabled}
            value={draft.status}
            onChange={(event) => onUpdateDraft("status", event.target.value)}
            aria-label="Filtrar por estado"
          >
            {caseStatusFilterOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </CaseFilterField>
      )
    }
  ] satisfies Array<{ key: CaseFilterKey; render: React.ReactNode }>;

  return (
    <>
      {filterRenderMap.map((item) => (
        <div key={item.key}>{item.render}</div>
      ))}
    </>
  );
}
