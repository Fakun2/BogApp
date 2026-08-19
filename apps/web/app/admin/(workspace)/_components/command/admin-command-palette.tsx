"use client";

import { useRouter } from "next/navigation";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { adminCommandSections } from "../../_constants/command-palette";
import { getAuthorizedCommandSections } from "../../_utils/authorization";
import type { AdminCommandItem } from "../../_types/admin";
import type { BogaapSession } from "@/lib/auth/session";

type AdminCommandPaletteProps = {
  open: boolean;
  session: BogaapSession | null;
  onOpenChange: (open: boolean) => void;
};

export function AdminCommandPalette({ open, session, onOpenChange }: AdminCommandPaletteProps) {
  const router = useRouter();
  const commandSections = getAuthorizedCommandSections(session, adminCommandSections);

  function runCommand(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-foreground/25 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[80] w-[calc(100vw-32px)] max-w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] border border-border/70 bg-popover/95 p-2.5 text-popover-foreground shadow-[0_22px_64px_-34px_rgba(15,23,42,0.66),0_0_0_1px_color-mix(in_oklab,var(--foreground)_8%,transparent)] outline-none backdrop-blur-xl data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <DialogPrimitive.Title className="sr-only">Buscador global</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Busca acciones rapidas y destinos de navegacion del panel.
          </DialogPrimitive.Description>
          <Command className="rounded-[18px] bg-transparent [&_[data-slot=command-input-wrapper]>svg]:hidden [&_[data-slot=command-input-wrapper]]:h-10 [&_[data-slot=command-input-wrapper]]:rounded-[16px] [&_[data-slot=command-input-wrapper]]:border [&_[data-slot=command-input-wrapper]]:border-border/50 [&_[data-slot=command-input-wrapper]]:bg-secondary/35 [&_[data-slot=command-input-wrapper]]:px-0 [&_[data-slot=command-input-wrapper]]:shadow-inner">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <CommandInput
                autoFocus
                placeholder="Buscar acciones..."
                className="h-10 pl-10 pr-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>

            <CommandList className="mt-2 max-h-[min(440px,calc(100svh-128px))] overflow-y-auto scrollbar-none px-0.5 pb-0.5">
              <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
                No hay acciones para esa busqueda.
              </CommandEmpty>

              {commandSections.map((section) => (
                <CommandGroup
                  key={section.title}
                  heading={section.title}
                  className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:normal-case [&_[cmdk-group-heading]]:tracking-normal [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {section.items.map((item) => (
                    <CommandPaletteItem
                      key={item.label}
                      item={item}
                      onSelect={() => runCommand(item.href)}
                    />
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function CommandPaletteItem({
  item,
  onSelect
}: {
  item: AdminCommandItem;
  onSelect: () => void;
}) {
  const Icon = item.icon;

  return (
    <CommandItem
      value={`${item.label} ${item.href}`}
      onSelect={onSelect}
      className={cn(
        "h-10 cursor-pointer rounded-[14px] px-2.5 text-base leading-none text-foreground transition-colors data-[selected=true]:bg-secondary/70 data-[selected=true]:text-foreground",
        item.shortcut ? "pr-3" : ""
      )}
    >
      {Icon ? <Icon className="h-[18px] w-[18px] text-foreground" aria-hidden="true" /> : null}
      <span className="truncate">{item.label}</span>
      {item.shortcut ? (
        <CommandShortcut className="ml-auto rounded-lg border border-border/60 bg-secondary/60 px-2 py-1 font-sans text-xs tracking-normal text-muted-foreground">
          Shift+{item.shortcut}
        </CommandShortcut>
      ) : null}
    </CommandItem>
  );
}
