"use client";

import { useCallback, useState } from "react";
import type { StaffWorker } from "../_types/staff.types";

type CreateStaffDraft = {
  assignPracticeArea: boolean;
  avatarUrl: string;
  dni: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
  practiceAreaIds: string[];
  role: string;
  status: "active" | "suspended";
};

export function useCreateStaffDraft() {
  const initialDraft: CreateStaffDraft = {
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
  const [workerDraft, setWorkerDraft] = useState<CreateStaffDraft>(initialDraft);

  const updateWorkerDraft = useCallback(<K extends keyof CreateStaffDraft>(
    key: K,
    value: CreateStaffDraft[K]
  ) => {
    setWorkerDraft((current) => ({ ...current, [key]: value }));
  }, []);

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
    setWorkerDraft(initialDraft);
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
