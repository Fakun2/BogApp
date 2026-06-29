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
    label: "Nombre completo",
    placeholder: "Ej. Juan Perez",
    autoComplete: "name",
    type: "text"
  },
  {
    name: "email",
    label: "Email laboral",
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
  badge: "Gestion juridica privada",
  title: "Crear cuenta",
  description:
    "Configura tu acceso a BogApp para gestionar clientes, expedientes y tareas del estudio en un solo lugar.",
  divider: "o",
  formTooltip: "Datos seguros del estudio",
  submit: "Crear cuenta",
  submitTooltip: "Crear acceso",
  existingAccount: "¿Ya tenes cuenta?",
  login: "Iniciar sesion"
} as const;

export const createAccountMedia = {
  imageUrl: "/create-account-mosaic.png",
  label: "Vista visual del workspace juridico BogApp"
} as const;

export const createAccountMediaTileRadius = {
  brand: "rounded-[30px]",
  default: "rounded-[24px]",
  feature: "rounded-[18px]",
  tight: "rounded-[14px]"
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

export const createAccountMediaTiles: CreateAccountMediaTileConfig[] = [];
