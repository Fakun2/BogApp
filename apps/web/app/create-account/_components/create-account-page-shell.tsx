"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCreateAccountCursor } from "../_hooks/use-create-account-cursor";
import { CreateAccountCursor } from "./create-account-cursor";
import { CreateAccountLoadingDialog } from "./create-account-loading-dialog";

type CreateAccountPageShellProps = {
  children: ReactNode;
  darkMode: boolean;
  submitting: boolean;
  transitionExiting: boolean;
  transitionSuccess: boolean;
};

export function CreateAccountPageShell({
  children,
  darkMode,
  submitting,
  transitionExiting,
  transitionSuccess
}: CreateAccountPageShellProps) {
  const { surfaceHandlers } = useCreateAccountCursor();

  return (
    <main
      className={cn(
        "min-h-screen bg-background py-4 text-foreground transition-colors lg:h-screen lg:cursor-none lg:overflow-hidden lg:px-3 lg:[&_*]:cursor-none 2xl:py-12",
        darkMode && "dark"
      )}
      {...surfaceHandlers}
    >
      {children}
      <CreateAccountCursor />
      <CreateAccountLoadingDialog
        exiting={transitionExiting}
        success={transitionSuccess}
        visible={submitting}
      />
    </main>
  );
}
