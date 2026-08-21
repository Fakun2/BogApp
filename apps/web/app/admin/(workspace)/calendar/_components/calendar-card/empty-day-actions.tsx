"use client";

import { Banknote, CalendarPlus, ListTodo, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { adminPrimaryActionButtonClassName } from "../../../_constants/dashboard";

export type CalendarCreateEventType = "expense" | "hearing" | "task";

export function CalendarEmptyDayActions({
  canCreateExpense,
  canCreateHearing,
  canCreateTask,
  date,
  day,
  onCreate,
  open,
  onOpenChange
}: {
  canCreateExpense: boolean;
  canCreateHearing: boolean;
  canCreateTask: boolean;
  date: string;
  day: number;
  onCreate: (type: CalendarCreateEventType) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-72 max-w-[calc(100vw-2rem)] gap-2 p-2">
        <DialogHeader className="px-2 pb-2 pt-1">
          <DialogDescription className="text-xs font-medium uppercase tracking-normal">
            {formatCalendarDate(date)}
          </DialogDescription>
          <DialogTitle className="text-sm">Crear en dia {day}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-1">
          {canCreateExpense ? (
            <CalendarActionButton
              icon={Banknote}
              label="Nuevo gasto"
              onClick={() => onCreate("expense")}
            />
          ) : null}
          {canCreateHearing ? (
            <CalendarActionButton
              icon={CalendarPlus}
              label="Nueva audiencia"
              onClick={() => onCreate("hearing")}
            />
          ) : null}
          {canCreateTask ? (
            <CalendarActionButton
              icon={ListTodo}
              label="Nueva tarea"
              onClick={() => onCreate("task")}
            />
          ) : null}
          <CalendarActionButton
            disabled
            icon={UsersRound}
            label="Nueva reunion"
            title="Disponible pronto."
            trailing={
              <Badge variant="secondary" className="ml-auto h-5 rounded-md px-1.5 text-[10px]">
                Soon
              </Badge>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CalendarActionButton({
  disabled = false,
  icon: Icon,
  label,
  onClick,
  trailing,
  title
}: {
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  trailing?: ReactNode;
  title?: string;
}) {
  return (
    <Button
      type="button"
      variant={disabled ? "outline" : "secondary"}
      className={`h-10 w-full justify-start rounded-xl px-3 text-sm ${
        disabled ? "border-border/40 text-muted-foreground" : adminPrimaryActionButtonClassName
      }`}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
      {trailing}
    </Button>
  );
}

function formatCalendarDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(
    new Date(`${date}T00:00:00`)
  );
}
