import type { ReactNode } from "react";
import { IaShell } from "./_components/ia-shell";

export default function AdminAiLayout({ children }: { children: ReactNode }) {
  return <IaShell>{children}</IaShell>;
}
