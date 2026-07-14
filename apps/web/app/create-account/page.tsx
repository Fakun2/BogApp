"use client";

import { useTheme } from "@/lib/theme/theme-provider";
import { CreateAccountMedia } from "./_components/media/create-account-media";
import { CreateAccountPageShell } from "./_components/layout/create-account-page-shell";
import { CreateAccountPanel } from "./_components/layout/create-account-panel";
import { CreateAccountCursorProvider } from "./_hooks/use-create-account-cursor";
import { useCreateAccountForm } from "./_hooks/use-create-account-form";

export default function CreateAccountPage() {
  const theme = useTheme();
  const formState = useCreateAccountForm();

  return (
    <CreateAccountCursorProvider submitting={formState.submitting}>
      <CreateAccountPageShell
        submitting={formState.submitting}
        transitionExiting={formState.transitionExiting}
        transitionSuccess={formState.transitionSuccess}
      >
        <div className="mx-auto grid min-h-screen w-full gap-3 lg:h-full lg:min-h-0 lg:max-w-[1800px] lg:grid-cols-[530px_1fr]">
          <CreateAccountPanel
            darkMode={theme.isDark}
            formState={formState}
            onToggleTheme={theme.toggleVariant}
          />
          <CreateAccountMedia />
        </div>
      </CreateAccountPageShell>
    </CreateAccountCursorProvider>
  );
}
