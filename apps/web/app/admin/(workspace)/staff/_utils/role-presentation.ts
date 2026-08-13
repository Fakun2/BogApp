import {
  BadgeCheck,
  Calculator,
  Crown,
  Eye,
  Gavel,
  ShieldCheck,
  UserCog,
  type LucideIcon
} from "lucide-react";

const roleIconMap: Record<string, LucideIcon> = {
  accounting: Calculator,
  admin: ShieldCheck,
  lawyer: Gavel,
  owner: Crown,
  paralegal: UserCog,
  viewer: Eye
};

const roleDescriptionMap: Record<string, string> = {
  accounting: "Accede a clientes, expedientes y gestion financiera del estudio.",
  admin: "Administra el estudio, equipo, roles y configuracion operativa.",
  lawyer: "Gestiona clientes, expedientes, documentos, tareas y seguimiento legal.",
  owner: "Tiene control completo del estudio, permisos, facturacion y administracion.",
  paralegal: "Colabora en expedientes, documentos y tareas sin administrar permisos.",
  viewer: "Consulta informacion del estudio sin modificar datos operativos."
};

export function getRoleIcon(roleCode: string): LucideIcon {
  return roleIconMap[roleCode] ?? BadgeCheck;
}

export function getRoleDescription({
  code,
  description
}: {
  code: string;
  description: string | null;
}) {
  return description?.trim() || roleDescriptionMap[code] || "Define el alcance de acceso dentro del estudio.";
}
