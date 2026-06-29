import { BriefcaseBusiness, Settings2, UserRound } from "lucide-react";
import type { OnboardingFormState } from "../_types/onboarding.types";

export const initialOnboardingState: OnboardingFormState = {
  owner: {
    fullName: "",
    email: ""
  },
  tenant: {
    name: "",
    legalName: "",
    taxId: "",
    country: "Argentina",
    province: "",
    city: "",
    timezone: "America/Argentina/Buenos_Aires",
    defaultCurrency: "ARS",
    address: "",
    website: "",
    logoUrl: "",
    size: "",
    referralSource: ""
  },
  workspace: {
    practiceAreaCodes: [],
    practiceAreas: [],
    defaultRoleForInvites: "lawyer",
    caseNumberingMode: "manual",
    documentStorageMode: "local"
  }
};

export const onboardingSteps = [
  {
    title: "Cuenta owner",
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
    title: "Workspace",
    eyebrow: "Configuracion",
    description: "Areas iniciales para empezar a operar el estudio.",
    icon: Settings2
  }
] as const;

export const referralSources = [
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Instagram", value: "instagram" },
  { label: "Referido", value: "referido" },
  { label: "Web", value: "web" },
  { label: "IA", value: "ia" },
  { label: "Otro", value: "otro" }
] as const;

export const argentinaProvinces = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Cordoba",
  "Corrientes",
  "Entre Rios",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquen",
  "Rio Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucuman"
] as const;

export const onboardingLoadingCopy = {
  animatedWord: "espere",
  footerItems: ["Creando tenant...", "Asignando owner...", "Preparando workspace..."],
  subtitle: "Estamos configurando tu estudio juridico en BOGAP.",
  successTitle: "Estudio creado!",
  titlePrefix: "Creando estudio, "
} as const;

export const onboardingLoadingDurationMs = 2600;
export const onboardingLoadingExitMs = 720;
export const onboardingLoadingIntroMs = 1200;
export const onboardingLoadingOverlayStartDelayMs = 80;
export const onboardingLoadingSuccessMs = 1100;
export const onboardingLoadingTotalMs =
  onboardingLoadingOverlayStartDelayMs + onboardingLoadingIntroMs + onboardingLoadingDurationMs;
