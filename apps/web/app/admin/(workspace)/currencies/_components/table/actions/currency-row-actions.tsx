"use client";

import { useState } from "react";
import { MoreHorizontal, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { hasPermission } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import { useDisableTenantCurrencyMutation } from "../../../_hooks/use-currencies-query";
import type { CurrencyDto } from "../../../_types/currencies.types";
import { DisableCurrencyDialog } from "./disable-currency-dialog";

export function CurrencyRowActions({ currency }: { currency: CurrencyDto }) {
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const session = useSession();
  const disableMutation = useDisableTenantCurrencyMutation();
  const canDisable = hasPermission(session, "finance:update") && currency.active;

  async function handleDisable() {
    try {
      await disableMutation.mutateAsync(currency.code);
      setDisableDialogOpen(false);
    } catch {
      // The mutation exposes the error in the confirmation panel.
    }
  }

  if (!canDisable) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 border-border/50 p-0"
            aria-label={`Acciones para ${currency.name}`}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              setDisableDialogOpen(true);
            }}
          >
            <PowerOff className="h-4 w-4" aria-hidden="true" />
            Deshabilitar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DisableCurrencyDialog
        currencyName={currency.name}
        error={disableMutation.error?.message}
        loading={disableMutation.isPending}
        open={disableDialogOpen}
        onConfirm={handleDisable}
        onOpenChange={setDisableDialogOpen}
      />
    </>
  );
}
