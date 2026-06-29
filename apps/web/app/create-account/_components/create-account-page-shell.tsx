"use client";

import type { ReactNode } from "react";
import { useCreateAccountCursor } from "../_hooks/use-create-account-cursor";
import { CreateAccountCursor } from "./create-account-cursor";
import { CreateAccountLoadingDialog } from "./create-account-loading-dialog";

type CreateAccountPageShellProps = {
  children: ReactNode;
  submitting: boolean;
  transitionExiting: boolean;
  transitionSuccess: boolean;
};

export function CreateAccountPageShell({
  children,
  submitting,
  transitionExiting,
  transitionSuccess
}: CreateAccountPageShellProps) {
  const { surfaceHandlers } = useCreateAccountCursor();

  return (
    <main
      className="min-h-screen bg-background py-4 text-foreground transition-colors lg:h-screen lg:cursor-none lg:overflow-hidden lg:px-3 lg:[&_*]:cursor-none 2xl:py-12"
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
