"use client";

import { Banknote, CalendarPlus, ListTodo } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { adminPrimaryActionButtonClassName } from "../../../../_constants/dashboard";
import type { TaskAssigneeOption } from "../../../_types/cases.types";
import { CaseExpenseSheet } from "../expense-sheet";
import { CaseHearingSheet } from "../hearing-sheet";
import { CaseTaskSheet } from "../task-sheet";

export function CalendarEmptyDayActions({
  assignees,
  canCreateExpense,
  canCreateHearing,
  canCreateTask,
  caseId,
  date,
  day,
  open,
  onOpenChange
}: {
  assignees: TaskAssigneeOption[];
  canCreateExpense: boolean;
  canCreateHearing: boolean;
  canCreateTask: boolean;
  caseId: string;
  date: string;
  day: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [hearingOpen, setHearingOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);

  return (
    <>
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
                onClick={() => {
                  onOpenChange(false);
                  setExpenseOpen(true);
                }}
              />
            ) : null}
            {canCreateHearing ? (
              <CalendarActionButton
                icon={CalendarPlus}
                label="Nueva audiencia"
                onClick={() => {
                  onOpenChange(false);
                  setHearingOpen(true);
                }}
              />
            ) : null}
            {canCreateTask ? (
              <CalendarActionButton
                icon={ListTodo}
                label="Nueva tarea"
                onClick={() => {
                  onOpenChange(false);
                  setTaskOpen(true);
                }}
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
      {canCreateExpense ? (
        <CaseExpenseSheet
          caseId={caseId}
          defaultDate={date}
          onOpenChange={setExpenseOpen}
          open={expenseOpen}
          tasks={[]}
        />
      ) : null}
      {canCreateTask ? (
        <CaseTaskSheet
          assignees={assignees}
          caseId={caseId}
          defaultDate={date}
          onOpenChange={setTaskOpen}
          open={taskOpen}
        />
      ) : null}
      {canCreateHearing ? (
        <CaseHearingSheet
          caseId={caseId}
          defaultDate={date}
          onOpenChange={setHearingOpen}
          open={hearingOpen}
        />
      ) : null}
    </>
  );
}

function CalendarActionButton({
  disabled = false,
  icon: Icon,
  label,
  onClick,
  title
}: {
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
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
    </Button>
  );
}

function formatCalendarDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(
    new Date(`${date}T00:00:00`)
  );
}
