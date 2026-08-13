import type { CreateAccountFormValues } from "@/lib/validation/auth";
import type { CreateAccountFieldConfig } from "../_types/create-account.types";

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
    placeholder: "Nombre del Estudio",
    autoComplete: "name",
    type: "text"
  },
  {
    name: "email",
    label: "Email",
    placeholder: "ejemplo@gmail.com",
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
