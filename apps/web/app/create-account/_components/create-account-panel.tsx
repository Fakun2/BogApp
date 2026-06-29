import Link from "next/link";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createAccountCopy } from "../_constants/create-account.constants";
import { CreateAccountForm } from "./create-account-form";
import { CreateAccountHeader } from "./create-account-header";
import { FormDivider } from "./form-divider";
import type { UseCreateAccountFormResult } from "../_types/create-account.types";

type CreateAccountPanelProps = {
  darkMode: boolean;
  formState: UseCreateAccountFormResult;
  onToggleTheme: () => void;
};

export function CreateAccountPanel({
  darkMode,
  formState,
  onToggleTheme
}: CreateAccountPanelProps) {
  return (
    <Card className="p-2 flex min-h-screen overflow-hidden rounded-2xl border border-border bg-card/95 shadow-none lg:h-full lg:min-h-0">
      <CardContent className="flex w-full flex-col py-2 2xl:py-4 sm:px-5">
        <div className="flex items-center justify-between">
          <Button asChild variant="outline" className="size-9 rounded-full p-0">
            <Link href="/" aria-label="BOGAP">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-full px-3"
            onClick={onToggleTheme}
            aria-label="Cambiar tema"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        <div className="mx-auto flex w-full max-w-[300px] flex-1 flex-col justify-center py-3">
          <CreateAccountHeader />
          <FormDivider />
          <CreateAccountForm state={formState} />

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {createAccountCopy.existingAccount}{" "}
            <Link
              className="rounded-full border border-border px-3 py-1 font-medium text-foreground transition-colors hover:bg-secondary"
              href="/login"
            >
              {createAccountCopy.login}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
