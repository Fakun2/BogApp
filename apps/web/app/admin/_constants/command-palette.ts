import {
  BriefcaseBusiness,
  Building2,
  Code2,
  FilePlus2,
  Gavel,
  Plus,
  ShieldCheck,
  Settings,
  Users
} from "lucide-react";
import type { AdminCommandSection } from "../_types/admin";

export const adminCommandSections: AdminCommandSection[] = [
  {
    title: "Shortcuts",
    items: [
      {
        href: "/admin/cases",
        label: "Nuevo caso",
        requiredPermissions: ["cases:write"],
        shortcut: "N",
        status: "soon"
      },
      {
        href: "/admin/clients",
        label: "Buscar clientes",
        requiredPermissions: ["clients:read"],
        shortcut: "F",
        status: "soon"
      },
      {
        href: "/admin/settings",
        label: "Ver atajos de teclado",
        requiredPermissions: ["tenants:manage"],
        shortcut: "?",
        status: "soon"
      }
    ]
  },
  {
    title: "Queries",
    items: [
      {
        href: "/admin/reports",
        label: "Consultar reportes",
        icon: Code2,
        requiredPermissions: ["finance:read"],
        status: "soon"
      }
    ]
  },
  {
    title: "Actions",
    items: [
      {
        href: "/admin/cases",
        label: "Crear...",
        icon: Plus,
        requiredPermissions: ["cases:write"],
        status: "soon"
      },
      {
        href: "/admin/settings",
        label: "Configurar estudio...",
        icon: Building2,
        requiredPermissions: ["tenants:manage"],
        status: "soon"
      },
      {
        href: "/admin/staff",
        label: "Gestionar staff...",
        icon: Settings,
        requiredPermissions: ["staff:read"]
      },
      {
        href: "/admin/roles",
        label: "Gestionar roles...",
        icon: ShieldCheck,
        requiredPermissions: ["roles:read"]
      },
      {
        href: "/admin/legal-catalogs",
        label: "Gestionar catalogos legales...",
        icon: Gavel,
        requiredPermissions: ["forums:read", "provinces:read"],
        permissionMode: "any"
      },
      {
        href: "/admin/cases",
        label: "Abrir expediente...",
        icon: BriefcaseBusiness,
        requiredPermissions: ["cases:read"],
        status: "soon"
      },
      {
        href: "/admin/clients",
        label: "Gestionar clientes...",
        icon: Users,
        requiredPermissions: ["clients:read"],
        status: "soon"
      },
      {
        href: "/admin/cashbox",
        label: "Registrar movimiento...",
        icon: FilePlus2,
        requiredPermissions: ["finance:update"],
        status: "soon"
      }
    ]
  }
];
