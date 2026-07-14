"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Keyboard, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const commandSections = getAuthorizedCommandSections(session, adminCommandSections);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-foreground/35 backdrop-blur-[1px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-[105px] z-[80] w-[calc(100vw-32px)] max-w-[576px] -translate-x-1/2 overflow-hidden rounded-md border border-border/80 bg-popover text-popover-foreground shadow-xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex h-14 items-center gap-3 border-b border-border/80 px-4">
            <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <Input
              className="h-10 border-0 bg-transparent px-0 text-base shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
              placeholder="Run a command or search..."
              autoFocus
            />
          </div>

          <div className="max-h-[430px] overflow-y-auto px-2 py-3">
            {commandSections.map((section) => (
              <CommandSection key={section.title} title={section.title}>
                {section.items.map((item) => (
                  <CommandPaletteItem
                    key={item.label}
                    item={item}
                    onOpenChange={onOpenChange}
                  />
                ))}
              </CommandSection>
            ))}

            <div className="flex items-center gap-2 px-2 py-2 text-xs text-muted-foreground">
              <Keyboard className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Ctrl K tambien abre este buscador.</span>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function CommandPaletteItem({
  item,
  onOpenChange
}: {
  item: AdminCommandItem;
  onOpenChange: (open: boolean) => void;
}) {
  const Icon = item.icon;

  return (
    <CommandLink href={item.href} onOpenChange={onOpenChange}>
      {Icon ? <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" /> : null}
      <span className="truncate">{item.label}</span>
      {item.shortcut ? (
        <kbd className="ml-auto rounded border border-border/80 bg-secondary/40 px-1.5 py-0.5 text-[11px] leading-none text-muted-foreground">
          Shift+{item.shortcut}
        </kbd>
      ) : null}
    </CommandLink>
  );
}

function CommandSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="pb-4">
      <h2 className="px-2 pb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </h2>
      <div className="grid gap-1">{children}</div>
    </section>
  );
}

function CommandLink({
  children,
  className,
  href,
  onOpenChange
}: {
  children: ReactNode;
  className?: string;
  href: string;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-11 items-center gap-3 rounded-md px-2 text-sm text-foreground transition-colors hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      onClick={() => onOpenChange(false)}
    >
      {children}
    </Link>
  );
}
