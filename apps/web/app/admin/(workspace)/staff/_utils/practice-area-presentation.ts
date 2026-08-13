import {
  Banknote,
  BriefcaseBusiness,
  Building2,
  FileText,
  Handshake,
  Landmark,
  PenTool,
  Receipt,
  Scale,
  Shield,
  UsersRound,
  type LucideIcon
} from "lucide-react";

const templateIconMap: Record<string, LucideIcon> = {
  "derecho-administrativo": Landmark,
  "derecho-civil": Scale,
  "derecho-comercial-societario": Building2,
  "derecho-concursal": Banknote,
  "derecho-familia": UsersRound,
  "derecho-laboral": BriefcaseBusiness,
  "derecho-notarial-escribania": PenTool,
  "derecho-penal": Shield,
  "derecho-sucesorio": FileText,
  "derecho-tributario": Receipt,
  "mediacion-metodos-alternativos-resolucion-conflictos": Handshake
};

export function getPracticeAreaIcon(templateCode: string | null): LucideIcon {
  return templateCode ? (templateIconMap[templateCode] ?? Scale) : Scale;
}

export function getPracticeAreaDescription({
  description,
  name
}: {
  description: string | null;
  name: string;
}) {
  return description?.trim() || `Gestiona casos, tareas y seguimiento vinculados a ${name}.`;
}
