"use client";

import type { ReactNode } from "react";
import { useCreateAccountCursor } from "../../_hooks/use-create-account-cursor";
import { CreateAccountCursor } from "../cursor/create-account-cursor";
import { CreateAccountLoadingDialog } from "../loading/create-account-loading-dialog";

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
      className="fixed inset-0 h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-background p-3 text-foreground transition-colors supports-[height:100dvh]:h-[100dvh] supports-[height:100dvh]:max-h-[100dvh] sm:p-4 lg:cursor-none lg:[&_*]:cursor-none"
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
