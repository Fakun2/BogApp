"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PencilLine, UserPlus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  createStaffFormSchema,
  updateStaffFormSchema,
  type CreateStaffFormValues
} from "@/lib/validation/staff";
import { getActiveTenantAccess } from "@/lib/auth/permissions";
import { clearSession } from "@/lib/auth/session";
import { useSession } from "@/lib/auth/use-session";
import { useCreateStaffDraft } from "../../_hooks/use-create-staff-draft";
import { useCreateStaffMutation } from "../../_hooks/use-create-staff-mutation";
import { useUpdateStaffMutation } from "../../_hooks/use-update-staff-mutation";
import type { StaffListResponse, StaffWorker } from "../../_types/staff.types";
import { CreateStaffAreaSection } from "./create-staff-area-section";
import { CreateStaffField } from "./create-staff-field";
import { CreateStaffFooter } from "./create-staff-footer";
import { CreateStaffPasswordField } from "./create-staff-password-field";
import { CreateStaffPhotoDropzone } from "./create-staff-photo-dropzone";
import { CreateStaffRoleSection } from "./create-staff-role-section";
import { CreateStaffStatusSection } from "./create-staff-status-section";
import { CreateStaffTrigger } from "./create-staff-trigger";

type CreateStaffErrors = Partial<Record<keyof CreateStaffFormValues, string>>;

export function CreateStaffSheet({
  mode = "create",
  onCreated,
  staffData,
  trigger,
  worker
}: {
  mode?: "create" | "update";
  onCreated?: () => void;
  staffData: StaffListResponse | undefined;
  trigger?: ReactNode;
  worker?: StaffWorker;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<CreateStaffErrors>({});
  const session = useSession();
  const createStaffMutation = useCreateStaffMutation();
  const updateStaffMutation = useUpdateStaffMutation(worker?.id);
  const { loadWorkerDraft, resetWorkerDraft, togglePracticeArea, updateWorkerDraft, workerDraft } =
    useCreateStaffDraft();
  const error = mode === "create" ? createStaffMutation.error : updateStaffMutation.error;
  const submitting = mode === "create" ? createStaffMutation.isPending : updateStaffMutation.isPending;
  const practiceAreaOptions = (staffData?.filterOptions.practiceAreas ?? []).map((area) => ({
    description: area.description,
    label: area.name,
    templateCode: area.templateCode,
    value: area.id
  }));
  const roleOptions = (staffData?.filterOptions.roles ?? []).map((role) => ({
    assignable: getRoleAssignable(role),
    code: role.code,
    description: role.description,
    label: role.name
  }));
  const HeaderIcon = mode === "create" ? UserPlus : PencilLine;
  const activeRole = getActiveTenantAccess(session)?.role;
  const roleLocked = mode === "update" && worker?.userId === session?.user.id && activeRole !== "owner";

  useEffect(() => {
    if (!open) {
      return;
    }

    setErrors({});
    if (mode === "update" && worker) {
      loadWorkerDraft(worker);
      return;
    }

    resetWorkerDraft();
  }, [loadWorkerDraft, mode, open, resetWorkerDraft, worker]);

  async function logoutAndRedirectToLogin() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    clearSession();
    router.replace("/login");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      ...workerDraft,
      practiceAreaIds: workerDraft.assignPracticeArea ? workerDraft.practiceAreaIds : []
    };
    if (mode === "create") {
      const parsed = createStaffFormSchema.safeParse(payload);
      if (!parsed.success) {
        setErrors(toCreateStaffErrors(parsed.error.flatten().fieldErrors));
        return;
      }

      setErrors({});
      try {
        await createStaffMutation.mutateAsync(parsed.data);
        resetWorkerDraft();
        onCreated?.();
        setOpen(false);
      } catch {
        // The mutation exposes the error state in the form.
      }
      return;
    }

    const parsed = updateStaffFormSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(toCreateStaffErrors(parsed.error.flatten().fieldErrors));
      return;
    }

    setErrors({});
    try {
      await updateStaffMutation.mutateAsync(parsed.data);

      if (isOwnPasswordChange({ password: parsed.data.password, sessionUserId: session?.user.id, worker })) {
        await logoutAndRedirectToLogin();
        return;
      }

      resetWorkerDraft();
      onCreated?.();
      setOpen(false);
    } catch {
      // The mutation exposes the error state in the form.
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? <CreateStaffTrigger />}
      </SheetTrigger>
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
              name="createWorkerFirstName"
              onChange={(value) => updateWorkerDraft("firstName", value)}
              placeholder="Nombre"
              required
              value={workerDraft.firstName}
            />
            <CreateStaffField
              error={errors.lastName}
              id="create-worker-last-name"
              label="Apellido"
              name="createWorkerLastName"
              onChange={(value) => updateWorkerDraft("lastName", value)}
              placeholder="Apellido"
              required
              value={workerDraft.lastName}
            />
            <CreateStaffField
              error={errors.dni}
              id="create-worker-dni"
              label="DNI"
              name="createWorkerDni"
              onChange={(value) => updateWorkerDraft("dni", value.replace(/\D/g, ""))}
              placeholder="Documento"
              required
              value={workerDraft.dni}
            />
            <CreateStaffField
              error={errors.phone}
              id="create-worker-phone"
              label="Celular"
              name="createWorkerPhone"
              onChange={(value) => updateWorkerDraft("phone", value.replace(/\D/g, ""))}
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

function toCreateStaffErrors(fieldErrors: Partial<Record<keyof CreateStaffFormValues, string[]>>) {
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0]])
  ) as CreateStaffErrors;
}

function getRoleAssignable(role: unknown) {
  if (!role || typeof role !== "object" || !("assignable" in role)) {
    return true;
  }

  const assignable = (role as { assignable?: unknown }).assignable;
  return typeof assignable === "boolean" ? assignable : true;
}

function isOwnPasswordChange({
  password,
  sessionUserId,
  worker
}: {
  password?: string;
  sessionUserId?: string;
  worker?: StaffWorker;
}) {
  return Boolean(worker && sessionUserId && worker.userId === sessionUserId && password?.trim());
}
