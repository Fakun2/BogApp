"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PencilLine, UserPlus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { useStaffSheetController } from "../../_hooks/use-staff-sheet-controller";
import type { StaffFormMode } from "../../_types/staff-form.types";
import type { StaffListResponse, StaffWorker } from "../../_types/staff.types";
import { CreateStaffAreaSection } from "./create-staff-area-section";
import { CreateStaffField } from "./create-staff-field";
import { CreateStaffFooter } from "./create-staff-footer";
import { CreateStaffPasswordField } from "./create-staff-password-field";
import { CreateStaffPhotoDropzone } from "./create-staff-photo-dropzone";
import { CreateStaffRoleSection } from "./create-staff-role-section";
import { CreateStaffStatusSection } from "./create-staff-status-section";
import { CreateStaffTrigger } from "./create-staff-trigger";

export function CreateStaffSheet({
  mode = "create",
  onCreated,
  staffData,
  trigger,
  worker
}: {
  mode?: StaffFormMode;
  onCreated?: () => void;
  staffData: StaffListResponse | undefined;
  trigger?: ReactNode;
  worker?: StaffWorker;
}) {
  const [open, setOpen] = useState(false);
  const HeaderIcon = mode === "create" ? UserPlus : PencilLine;
  const {
    error,
    errors,
    handleSubmit,
    practiceAreaOptions,
    prepareDraft,
    roleLocked,
    roleOptions,
    submitting,
    togglePracticeArea,
    updateWorkerDraft,
    workerDraft
  } = useStaffSheetController({
    mode,
    onSuccess: () => {
      onCreated?.();
      setOpen(false);
    },
    staffData,
    worker
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    prepareDraft();
  }, [open, prepareDraft]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger ?? <CreateStaffTrigger />}</SheetTrigger>
      <SheetContent className="w-[780px] max-w-[94vw] overflow-hidden border-border bg-card sm:max-w-[780px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 text-lg">
            <span className="flex size-9 items-center justify-center rounded-xl bg-btn-primary text-btn-primary-foreground">
              <HeaderIcon className="h-4 w-4" aria-hidden="true" />
            </span>
            Cargar Empleado
          </SheetTitle>
          <SheetDescription className="sr-only">
            Formulario para cargar o actualizar los datos, rol y areas de trabajo de un empleado.
          </SheetDescription>
        </SheetHeader>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-4 pb-1 md:grid-cols-2">
            <CreateStaffPhotoDropzone />
            <CreateStaffField
              error={errors.firstName}
              id="create-worker-first-name"
              label="Nombre"
              maxLength={30}
              name="createWorkerFirstName"
              onChange={(value) => updateWorkerDraft("firstName", value.slice(0, 30))}
              placeholder="Nombre"
              required
              value={workerDraft.firstName}
            />
            <CreateStaffField
              error={errors.lastName}
              id="create-worker-last-name"
              label="Apellido"
              maxLength={30}
              name="createWorkerLastName"
              onChange={(value) => updateWorkerDraft("lastName", value.slice(0, 30))}
              placeholder="Apellido"
              required
              value={workerDraft.lastName}
            />
            <CreateStaffField
              error={errors.dni}
              id="create-worker-dni"
              inputMode="numeric"
              label="DNI"
              maxLength={8}
              name="createWorkerDni"
              onChange={(value) => updateWorkerDraft("dni", value.replace(/\D/g, "").slice(0, 8))}
              pattern="[0-9]*"
              placeholder="Documento"
              required
              value={workerDraft.dni}
            />
            <CreateStaffField
              error={errors.phone}
              id="create-worker-phone"
              inputMode="numeric"
              label="Celular"
              maxLength={13}
              name="createWorkerPhone"
              onChange={(value) =>
                updateWorkerDraft("phone", value.replace(/\D/g, "").slice(0, 13))
              }
              pattern="[0-9]*"
              placeholder="Numero de telefono"
              type="tel"
              value={workerDraft.phone}
            />
            <CreateStaffField
              error={errors.email}
              id="create-worker-email"
              label="Email laboral"
              name="createWorkerEmail"
              onChange={(value) => updateWorkerDraft("email", value)}
              placeholder="persona@estudio.com"
              required
              type="email"
              value={workerDraft.email}
            />
            <CreateStaffPasswordField
              error={errors.password}
              onChange={(value) => updateWorkerDraft("password", value)}
              required={mode === "create"}
              value={workerDraft.password}
            />
            <CreateStaffRoleSection
              error={errors.role}
              locked={roleLocked}
              lockedMessage="No podes cambiar tu propio rol."
              value={workerDraft.role}
              onValueChange={(value) => updateWorkerDraft("role", value)}
              options={roleOptions}
            />
            <CreateStaffStatusSection
              active={workerDraft.status === "active"}
              onActiveChange={(active) =>
                updateWorkerDraft("status", active ? "active" : "suspended")
              }
            />
            <div className="md:col-span-2">
              <CreateStaffAreaSection
                assignPracticeArea={workerDraft.assignPracticeArea}
                options={practiceAreaOptions}
                practiceAreaIds={workerDraft.practiceAreaIds}
                onAssignPracticeAreaChange={(checked) => {
                  updateWorkerDraft("assignPracticeArea", checked);
                  if (!checked) {
                    updateWorkerDraft("practiceAreaIds", []);
                  }
                }}
                onPracticeAreaToggle={togglePracticeArea}
              />
            </div>
            {error ? (
              <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive md:col-span-2">
                {error.message}
              </p>
            ) : null}
          </div>
          <CreateStaffFooter mode={mode} submitting={submitting} />
        </form>
      </SheetContent>
    </Sheet>
  );
}
