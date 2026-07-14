import { BriefcaseBusiness, Settings2, UserRound } from "lucide-react";

export const onboardingSteps = [
  {
    title: "Cuenta de usuario",
    eyebrow: "Identidad",
    description: "Usamos la cuenta autenticada para crear el estudio.",
    icon: UserRound
  },
  {
    title: "Estudio juridico",
    eyebrow: "Datos del estudio",
    description: "Datos legales y ubicacion del estudio dentro del SaaS.",
    icon: BriefcaseBusiness
  },
  {
    title: "Espacio de trabajo",
    eyebrow: "Configuracion",
    description: "Areas iniciales para empezar a operar el estudio.",
    icon: Settings2
  }
] as const;
