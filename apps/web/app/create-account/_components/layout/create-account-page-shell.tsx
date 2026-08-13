"use client";

import type { ReactNode } from "react";
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

  return (
    <main
      className="fixed inset-0 h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-background p-2 text-foreground transition-colors supports-[height:100dvh]:h-[100dvh] supports-[height:100dvh]:max-h-[100dvh] xl:p-3"
    >
      {children}
      <CreateAccountLoadingDialog
        exiting={transitionExiting}
        success={transitionSuccess}
        visible={submitting}
      />
    </main>
  );
}
