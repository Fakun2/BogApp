import type { CreateAccountFormValues } from "@/lib/validation/auth";
import type {
  CreateAccountFieldConfig,
  CreateAccountMediaTileCorners,
  CreateAccountMediaTileConfig
} from "../_types/create-account.types";

export const createAccountInitialForm: CreateAccountFormValues = {
  fullName: "",
  email: "",
  password: "",
  phone: ""
};

export const createAccountFieldMap: CreateAccountFieldConfig[] = [
  {
    name: "fullName",
    label: "Nombre",
    placeholder: "Estudio BOGAP",
    autoComplete: "name",
    type: "text"
  },
  {
    name: "email",
    label: "Email",
    placeholder: "hola@estudio.com",
    autoComplete: "email",
    inputMode: "email",
    type: "email"
  },
  {
    name: "password",
    label: "Contraseña",
    placeholder: "••••••••",
    autoComplete: "new-password",
    type: "password"
  }
];

export const createAccountCopy = {
  badge: "Workspace legal privado",
  title: "Crear cuenta",
  description: "Ingresá tus datos para crear tu identidad global en BOGAP.",
  divider: "o",
  formTooltip: "hola!",
  submit: "Crear cuenta",
  submitTooltip: "Vamos!",
  existingAccount: "¿Ya tenés cuenta?",
  login: "Entrar"
} as const;

export const createAccountLoadingCopy = {
  animatedWord: "espere",
  footerItems: ["Validando datos...", "Creando acceso seguro...", "Preparando inicio de sesión..."],
  subtitle: "Estamos preparando tu acceso seguro a BOGAP.",
  successTitle: "Cuenta creada con exito!",
  titlePrefix: "Creando cuenta, "
} as const;

export const createAccountLoadingDurationMs = 3000;
export const createAccountLoadingExitMs = 720;
export const createAccountLoadingIntroMs = 1400;
export const createAccountLoadingOverlayStartDelayMs = 80;
export const createAccountLoadingSuccessMs = 1300;
export const createAccountLoadingTotalMs =
  createAccountLoadingOverlayStartDelayMs +
  createAccountLoadingIntroMs +
  createAccountLoadingDurationMs;

export const createAccountMedia = {
  videoUrl: "/media/lawyer.mp4",
  label: "video de abogado"
} as const;

const defaultMedia = {
  alt: "Composición visual abstracta del workspace",
  src: createAccountMedia.videoUrl,
  type: "video" as const
};

export const createAccountMediaTileRadius = {
  brand: "rounded-[24px]",
  default: "rounded-[24px]",
  feature: "rounded-[24px]",
  tight: "rounded-[24px]"
} as const;

export const createAccountMediaTileCorners = {
  all(overrides: CreateAccountMediaTileCorners = {}) {
    return {
      bottomLeft: true,
      bottomRight: true,
      topLeft: true,
      topRight: true,
      ...overrides
    };
  }
} as const;

export const createAccountMediaTiles: CreateAccountMediaTileConfig[] = [
  {
    id: "top-left",
    kind: "media",
    className: "col-start-1 col-span-1 row-start-1 row-span-2",
    media: defaultMedia,
    objectPosition: "0% 0%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: true,
      topRight: false,
      bottomLeft: false,
      bottomRight: true
    })
  },
  {
    id: "top-wide-left",
    kind: "media",
    className: "col-start-2 col-span-2 row-start-1 row-span-2",
    media: defaultMedia,
    objectPosition: "32% 0%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: false,
      topRight: false,
      bottomLeft: true,
      bottomRight: true
    })
  },
  {
    id: "top-wide-right",
    kind: "media",
    className: "col-start-4 col-span-2 row-start-1 row-span-2",
    media: defaultMedia,
    objectPosition: "66% 0%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: false,
      topRight: false,
      bottomLeft: true,
      bottomRight: true
    })
  },
  {
    id: "top-right",
    kind: "media",
    className: "col-start-6 col-span-1 row-start-1 row-span-2",
    media: defaultMedia,
    objectPosition: "100% 0%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: false,
      topRight: true,
      bottomLeft: true,
      bottomRight: false
    })
  },
  {
    id: "left-main",
    kind: "media",
    className: "col-start-1 col-span-1 row-start-3 row-span-4",
    media: defaultMedia,
    objectPosition: "0% 32%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: false,
      topRight: true,
      bottomLeft: false,
      bottomRight: true
    })
  },
  {
    id: "center-main-left",
    kind: "media",
    className: "col-start-2 col-span-2 row-start-3 row-span-4",
    media: defaultMedia,
    objectPosition: "32% 32%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: true,
      topRight: true,
      bottomLeft: true,
      bottomRight: true
    })
  },
  {
    id: "center-main-right",
    kind: "media",
    className: "col-start-4 col-span-2 row-start-3 row-span-4",
    media: defaultMedia,
    objectPosition: "66% 32%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: true,
      topRight: true,
      bottomLeft: true,
      bottomRight: true
    })
  },
  {
    id: "right-main",
    kind: "media",
    className: "col-start-6 col-span-1 row-start-3 row-span-4",
    media: defaultMedia,
    objectPosition: "100% 32%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: true,
      topRight: false,
      bottomLeft: true,
      bottomRight: false
    })
  },
  {
    id: "left-dark",
    kind: "media",
    className: "col-start-1 col-span-1 row-start-7 row-span-4",
    media: defaultMedia,
    objectPosition: "0% 66%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: false,
      topRight: true,
      bottomLeft: false,
      bottomRight: true
    })
  },
  {
    id: "feature-tenant",
    kind: "media",
    className: "col-start-2 col-span-2 row-start-7 row-span-4",
    media: defaultMedia,
    radiusClassName: createAccountMediaTileRadius.feature,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: true,
      topRight: true,
      bottomLeft: true,
      bottomRight: true
    })
  },
  {
    id: "feature-rbac",
    kind: "feature",
    className: "col-start-4 col-span-2 row-start-7 row-span-4",
    title: "User-Friendly Interface",
    description: "Create, customize, and share tenant workflows with clear roles.",
    tone: "purple",
    radiusClassName: createAccountMediaTileRadius.feature,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: true,
      topRight: true,
      bottomLeft: true,
      bottomRight: true
    })
  },
  {
    id: "brand-mark",
    kind: "brand",
    className: "col-start-6 col-span-1 row-start-7 row-span-4",
    radiusClassName: createAccountMediaTileRadius.brand,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: true,
      topRight: false,
      bottomLeft: true,
      bottomRight: false
    })
  },
  {
    id: "bottom-left",
    kind: "media",
    className: "col-start-1 col-span-1 row-start-11 row-span-2",
    media: defaultMedia,
    objectPosition: "0% 100%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: false,
      topRight: true,
      bottomLeft: false,
      bottomRight: false
    })
  },
  {
    id: "bottom-center-left",
    kind: "media",
    className: "col-start-2 col-span-2 row-start-11 row-span-2",
    media: defaultMedia,
    objectPosition: "32% 100%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: true,
      topRight: true,
      bottomLeft: false,
      bottomRight: false
    })
  },
  {
    id: "bottom-center-right",
    kind: "media",
    className: "col-start-4 col-span-2 row-start-11 row-span-2",
    media: defaultMedia,
    objectPosition: "66% 100%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: true,
      topRight: true,
      bottomLeft: false,
      bottomRight: false
    })
  },
  {
    id: "bottom-right",
    kind: "media",
    className: "col-start-6 col-span-1 row-start-11 row-span-2",
    media: defaultMedia,
    objectPosition: "100% 100%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: true,
      topRight: false,
      bottomLeft: false,
      bottomRight: true
    })
  }
];
