"use client";

import { useCallback, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  createStaffFormSchema,
  updateStaffFormSchema,
  type CreateStaffFormValues
} from "@/lib/validation/staff";
import { redirectToLoginForLogout } from "@/lib/auth/logout";
import { useSession } from "@/lib/auth/use-session";
import { useCreateStaffDraft } from "./use-create-staff-draft";
import { useCreateStaffMutation } from "./use-create-staff-mutation";
import { useUpdateStaffMutation } from "./use-update-staff-mutation";
import type { StaffFormErrors, StaffFormMode } from "../_types/staff-form.types";
import type { StaffListResponse, StaffWorker } from "../_types/staff.types";
import { mapAssignableRoleOptions, mapPracticeAreaOptions } from "../_utils/staff-form-options";

export function useStaffSheetController({
  mode,
  onSuccess,
  staffData,
  worker
}: {
  mode: StaffFormMode;
  onSuccess?: () => void;
  staffData: StaffListResponse | undefined;
  worker?: StaffWorker;
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<StaffFormErrors>({});
  const session = useSession();
  const createStaffMutation = useCreateStaffMutation();
  const updateStaffMutation = useUpdateStaffMutation(worker?.id);
  const { loadWorkerDraft, resetWorkerDraft, togglePracticeArea, updateWorkerDraft, workerDraft } =
    useCreateStaffDraft();

  const roleLocked = mode === "update" && worker?.userId === session?.user.id;
  const error = mode === "create" ? createStaffMutation.error : updateStaffMutation.error;
  const submitting =
    mode === "create" ? createStaffMutation.isPending : updateStaffMutation.isPending;

  const practiceAreaOptions = mapPracticeAreaOptions(staffData);
  const roleOptions = mapAssignableRoleOptions({
    currentRole: workerDraft.role,
    roleLocked,
    staffData
  });

  const prepareDraft = useCallback(() => {
    setErrors({});

    if (mode === "update" && worker) {
      loadWorkerDraft(worker);
      return;
    }

    resetWorkerDraft();
  }, [loadWorkerDraft, mode, resetWorkerDraft, worker]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      ...workerDraft,
      practiceAreaIds: workerDraft.assignPracticeArea ? workerDraft.practiceAreaIds : []
    };

    if (mode === "create") {
      const parsed = createStaffFormSchema.safeParse(payload);
      if (!parsed.success) {
        setErrors(toStaffFormErrors(parsed.error.flatten().fieldErrors));
        return;
      }

      setErrors({});
      try {
        await createStaffMutation.mutateAsync(parsed.data);
        resetWorkerDraft();
        onSuccess?.();
      } catch {
        // The mutation exposes the error state in the form.
      }
      return;
    }

    const parsed = updateStaffFormSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(toStaffFormErrors(parsed.error.flatten().fieldErrors));
      return;
    }

    setErrors({});
    try {
      await updateStaffMutation.mutateAsync(parsed.data);

      if (
        isOwnPasswordChange({
          password: parsed.data.password,
          sessionUserId: session?.user.id,
          worker
        })
      ) {
        await logoutAndRedirectToLogin(router);
        return;
      }

      resetWorkerDraft();
      onSuccess?.();
    } catch {
      // The mutation exposes the error state in the form.
    }
  }

  return {
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
  };
}

function toStaffFormErrors(fieldErrors: Partial<Record<keyof CreateStaffFormValues, string[]>>) {
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0]])
  ) as StaffFormErrors;
}

async function logoutAndRedirectToLogin(router: ReturnType<typeof useRouter>) {
  redirectToLoginForLogout(router);
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
