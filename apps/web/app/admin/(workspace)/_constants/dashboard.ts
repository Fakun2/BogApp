import {
  Banknote,
  BriefcaseBusiness,
  CalendarClock,
  Users
} from "lucide-react";
import type { AdminMetric, AdminQuickLink } from "../_types/admin";

export const adminMetrics: AdminMetric[] = [
  {
    label: "Casos activos",
    value: "24",
    detail: "7 con movimiento reciente",
    icon: BriefcaseBusiness
  },
  { label: "Clientes", value: "132", detail: "18 sociedades registradas", icon: Users },
  { label: "Caja diaria", value: "$0", detail: "Sin cierres pendientes", icon: Banknote },
  { label: "Vencimientos", value: "6", detail: "Proximos 7 dias", icon: CalendarClock }
];

export const adminQuickLinks: AdminQuickLink[] = [
  {
    href: "/admin/cases",
    label: "Abrir casos",
    description: "Expedientes, estados y proximos pasos"
  },
  {
    href: "/admin/clients",
    label: "Ver clientes",
    description: "Personas, sociedades y contactos clave"
  },
  {
    href: "/admin/staff",
    label: "Gestionar staff",
    description: "Usuarios habilitados y permisos"
  }
];

export const adminWorkspaceStatus = [
  "Tenant activo",
  "Onboarding completo",
  "Sesion local disponible",
  "Theme BOGAP aplicado"
];

export const adminSurfaceClassName = "bg-card text-card-foreground";
export const adminSurfaceMutedClassName = "text-muted-foreground";
export const adminSurfacePrimaryClassName = "text-foreground";
export const adminPrimaryActionButtonClassName =
  "bg-btn-primary text-btn-primary-foreground hover:bg-btn-primary/85 disabled:bg-btn-primary/60 disabled:text-btn-primary-foreground";
