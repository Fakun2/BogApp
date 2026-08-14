"use client";

import { useState } from "react";
import { Loader2, MoreHorizontal, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { hasPermission } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import {
  useDisableTenantCurrencyMutation,
  useEnableTenantCurrencyMutation
} from "../../../_hooks/use-currencies-query";
import type { CurrencyDto } from "../../../_types/currencies.types";
import { DisableCurrencyDialog } from "./disable-currency-dialog";

export function CurrencyRowActions({ currency }: { currency: CurrencyDto }) {
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const session = useSession();
  const disableMutation = useDisableTenantCurrencyMutation();
  const enableMutation = useEnableTenantCurrencyMutation();
  const canManage = hasPermission(session, "finance:update");
  const isMutating = disableMutation.isPending || enableMutation.isPending;

  async function handleDisable() {
    try {
      await disableMutation.mutateAsync(currency.code);
      setDisableDialogOpen(false);
    } catch {
      // The mutation exposes the error in the confirmation panel.
    }
  }

  async function handleEnable() {
    try {
      await enableMutation.mutateAsync(currency.code);
    } catch {
      // The mutation exposes the error through the dashboard mutation boundary.
    }
  }

  if (!canManage) {
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
          {currency.active ? (
            <DropdownMenuItem
              variant="destructive"
              disabled={isMutating}
              onSelect={(event) => {
                event.preventDefault();
                setDisableDialogOpen(true);
              }}
            >
              <PowerOff className="h-4 w-4" aria-hidden="true" />
              Deshabilitar
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={isMutating}
              onSelect={(event) => {
                event.preventDefault();
                void handleEnable();
              }}
            >
              {enableMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Power className="h-4 w-4" aria-hidden="true" />
              )}
              Habilitar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DisableCurrencyDialog
        cashboxBalance={currency.cashboxBalance}
        currencyCode={currency.code}
        currencyName={currency.name}
        currencySymbol={currency.symbol}
        error={disableMutation.error?.message}
        loading={disableMutation.isPending}
        open={disableDialogOpen}
        onConfirm={handleDisable}
        onOpenChange={setDisableDialogOpen}
      />
    </>
  );
}
