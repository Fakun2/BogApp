"use client";

import { useCallback, useState } from "react";
import type { StaffDraft } from "../_types/staff-form.types";
import type { StaffWorker } from "../_types/staff.types";

const initialStaffDraft: StaffDraft = {
  assignPracticeArea: false,
  avatarUrl: "",
  dni: "",
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  phone: "",
  practiceAreaIds: [],
  role: "",
  status: "active"
};

export function useCreateStaffDraft() {
  const [workerDraft, setWorkerDraft] = useState<StaffDraft>(initialStaffDraft);

  const updateWorkerDraft = useCallback(
    <K extends keyof StaffDraft>(key: K, value: StaffDraft[K]) => {
      setWorkerDraft((current) => ({ ...current, [key]: value }));
    },
    []
  );

  const togglePracticeArea = useCallback((practiceAreaId: string) => {
    setWorkerDraft((current) => {
      const isSelected = current.practiceAreaIds.includes(practiceAreaId);

      return {
        ...current,
        practiceAreaIds: isSelected
          ? current.practiceAreaIds.filter((id) => id !== practiceAreaId)
          : [...current.practiceAreaIds, practiceAreaId]
      };
    });
  }, []);

  const resetWorkerDraft = useCallback(() => {
    setWorkerDraft(initialStaffDraft);
  }, []);

  const loadWorkerDraft = useCallback((worker: StaffWorker) => {
    setWorkerDraft({
      assignPracticeArea: worker.practiceAreas.length > 0,
      avatarUrl: "",
      dni: worker.dni ?? "",
      email: worker.email,
      firstName: worker.firstName,
      lastName: worker.lastName,
      password: "",
      phone: worker.phone ?? "",
      practiceAreaIds: worker.practiceAreas.map((area) => area.id),
      role: worker.role?.code ?? "",
      status: worker.status === "active" ? "active" : "suspended"
    });
  }, []);

  return {
    loadWorkerDraft,
    resetWorkerDraft,
    togglePracticeArea,
    updateWorkerDraft,
    workerDraft
  };
}
