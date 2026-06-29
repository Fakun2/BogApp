"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  hasTenantAccess,
  readSession,
  saveSession,
  type BogaapSession
} from "@/lib/auth/session";
import {
  initialOnboardingState,
  onboardingLoadingExitMs,
  onboardingLoadingSuccessMs,
  onboardingLoadingTotalMs,
  onboardingSteps
} from "../_constants/onboarding.constants";
import { onboardingSchema, type OnboardingPayload } from "../_schemas/onboarding.schema";
import type {
  OnboardingFormState,
  OnboardingResult,
  PracticeAreaTemplate,
  StartOnboardingResponse,
  StepErrors,
  StepIndex
} from "../_types/onboarding.types";
import { getStepFromIssue, makeStudyName } from "../_utils/onboarding-format";
import { useOnboardingTransition } from "./use-onboarding-transition";

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function useOnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<StepIndex>(0);
  const [form, setForm] = useState<OnboardingFormState>(initialOnboardingState);
  const [session, setSession] = useState<BogaapSession | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [practiceAreasEnabled, setPracticeAreasEnabled] = useState(false);
  const [practiceAreaTemplates, setPracticeAreaTemplates] = useState<PracticeAreaTemplate[]>([]);
  const [practiceAreaTemplatesError, setPracticeAreaTemplatesError] = useState<string | null>(null);
  const [practiceAreaTemplatesLoading, setPracticeAreaTemplatesLoading] = useState(false);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [result, setResult] = useState<OnboardingResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const transition = useOnboardingTransition();

  const currentStep = onboardingSteps[step] ?? onboardingSteps[0];
  const progress = useMemo(() => ((step + 1) / onboardingSteps.length) * 100, [step]);

  useEffect(() => {
    const storedSession = readSession();

    if (!storedSession) {
      router.replace("/login");
      return;
    }

    if (hasTenantAccess(storedSession)) {
      router.replace("/admin");
      return;
    }

    const defaultStudyName = makeStudyName(storedSession.user.fullName);
    setSession(storedSession);
    void loadPracticeAreaTemplates(storedSession);
    setForm((current) => ({
      ...current,
      owner: {
        fullName: storedSession.user.fullName,
        email: storedSession.user.email
      },
      tenant: {
        ...current.tenant,
        name: current.tenant.name || defaultStudyName,
        legalName: current.tenant.legalName || defaultStudyName
      }
    }));
    setSessionReady(true);
  }, [router]);

  function clearStepError(stepIndex: StepIndex) {
    setStepErrors((current) => ({ ...current, [stepIndex]: undefined }));
  }

  function setStepError(stepIndex: StepIndex, message: string) {
    setStepErrors((current) => ({ ...current, [stepIndex]: message }));
  }

  function updateOwner<K extends keyof OnboardingFormState["owner"]>(
    key: K,
    value: OnboardingFormState["owner"][K]
  ) {
    setForm((current) => ({ ...current, owner: { ...current.owner, [key]: value } }));
    clearStepError(0);
  }

  function updateTenant<K extends keyof OnboardingFormState["tenant"]>(
    key: K,
    value: OnboardingFormState["tenant"][K]
  ) {
    setForm((current) => ({ ...current, tenant: { ...current.tenant, [key]: value } }));
    clearStepError(1);
  }

  function updateWorkspace<K extends keyof OnboardingFormState["workspace"]>(
    key: K,
    value: OnboardingFormState["workspace"][K]
  ) {
    setForm((current) => ({ ...current, workspace: { ...current.workspace, [key]: value } }));
    clearStepError(2);
  }

  function togglePracticeArea(code: string) {
    setForm((current) => {
      const selected = current.workspace.practiceAreaCodes.includes(code);
      const practiceAreaCodes = selected
        ? current.workspace.practiceAreaCodes.filter((item) => item !== code)
        : [...current.workspace.practiceAreaCodes, code];

      return {
        ...current,
        workspace: {
          ...current.workspace,
          practiceAreaCodes
        }
      };
    });
    clearStepError(2);
  }

  function setPracticeAreasEnabledValue(enabled: boolean) {
    setPracticeAreasEnabled(enabled);
    if (
      enabled &&
      session &&
      !practiceAreaTemplatesLoading &&
      practiceAreaTemplates.length === 0
    ) {
      void loadPracticeAreaTemplates(session);
    }
    clearStepError(2);
  }

  function buildPayload(): OnboardingPayload {
    return {
      owner: {
        fullName: form.owner.fullName,
        email: form.owner.email
      },
      tenant: {
        ...form.tenant
      },
      workspace: {
        ...form.workspace,
        practiceAreaCodes: practiceAreasEnabled ? form.workspace.practiceAreaCodes : [],
        practiceAreas: []
      }
    };
  }

  function validateStep(stepIndex: StepIndex) {
    const payload = buildPayload();
    const schemaByStep = [
      onboardingSchema.shape.owner,
      onboardingSchema.shape.tenant,
      onboardingSchema.shape.workspace
    ] as const;
    const dataByStep = [payload.owner, payload.tenant, payload.workspace] as const;
    const parsed = schemaByStep[stepIndex].safeParse(dataByStep[stepIndex]);

    if (!parsed.success) {
      setStepError(stepIndex, parsed.error.issues[0]?.message ?? "Revisa los datos de este paso.");
      return false;
    }

    clearStepError(stepIndex);
    return true;
  }

  function goToStep(nextStep: StepIndex) {
    if (nextStep === step || submitting) {
      return;
    }

    setStep(nextStep);
  }

  function goNext() {
    if (!validateStep(step)) {
      return;
    }

    goToStep(Math.min(step + 1, onboardingSteps.length - 1) as StepIndex);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearStepError(step);

    if (step < onboardingSteps.length - 1) {
      goNext();
    }
  }

  async function completeOnboarding() {
    clearStepError(step);

    if (!session) {
      router.replace("/login");
      return;
    }

    const parsed = onboardingSchema.safeParse(buildPayload());
    if (!parsed.success) {
      const errorStep = getStepFromIssue(parsed.error.issues[0]) ?? step;
      goToStep(errorStep);
      setStepError(errorStep, parsed.error.issues[0]?.message ?? "Revisa los datos de este paso.");
      return;
    }

    setSubmitting(true);
    transition.start();
    let shouldHideTransition = true;
    const transitionStartedAt = Date.now();

    try {
      const response = await requestStartOnboarding(parsed.data, session);

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(body?.message ?? "No se pudo completar el onboarding.");
      }

      const body = (await response.json()) as StartOnboardingResponse;
      saveSession({
        user: {
          ...session.user,
          fullName: parsed.data.owner.fullName,
          email: parsed.data.owner.email
        },
        tokens: body.tokens
      });
      setResult({ tenantId: body.tenantId, userId: body.userId });
      const elapsed = Date.now() - transitionStartedAt;
      await wait(Math.max(onboardingLoadingTotalMs - elapsed, 0));
      transition.showSuccess();
      await wait(onboardingLoadingSuccessMs);
      transition.exit();
      await wait(onboardingLoadingExitMs);
      shouldHideTransition = false;
      router.push("/admin");
    } catch (caught) {
      setStepError(
        2,
        caught instanceof Error ? caught.message : "No se pudo completar el onboarding."
      );
    } finally {
      if (shouldHideTransition) {
        transition.reset();
        setSubmitting(false);
      }
    }
  }

  return {
    currentStep,
    form,
    completeOnboarding,
    goNext,
    goToStep,
    practiceAreasEnabled,
    practiceAreaTemplates,
    practiceAreaTemplatesError,
    practiceAreaTemplatesLoading,
    progress,
    result,
    sessionReady,
    setPracticeAreasEnabled: setPracticeAreasEnabledValue,
    step,
    stepError: stepErrors[step],
    submit,
    submitting,
    transitionExiting: transition.exiting,
    transitionSuccess: transition.success,
    togglePracticeArea,
    updateOwner,
    updateWorkspace,
    updateTenant
  };

  async function loadPracticeAreaTemplates(activeSession: BogaapSession) {
    setPracticeAreaTemplatesLoading(true);
    setPracticeAreaTemplatesError(null);

    try {
      const response = await requestPracticeAreaTemplates(activeSession);

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
      }

      const templates = (await response.json()) as PracticeAreaTemplate[];
      setPracticeAreaTemplates(templates);
    } catch (caught) {
      setPracticeAreaTemplatesError(
        caught instanceof Error ? caught.message : "No se pudieron cargar las areas reutilizables."
      );
    } finally {
      setPracticeAreaTemplatesLoading(false);
    }
  }

  async function requestPracticeAreaTemplates(activeSession: BogaapSession) {
    const response = await fetchPracticeAreaTemplates(activeSession.tokens.accessToken);

    if (response.status !== 401) {
      return response;
    }

    const refreshedSession = await refreshSession(activeSession);
    if (!refreshedSession) {
      clearSession();
      router.replace("/login");
      return response;
    }

    setSession(refreshedSession);
    saveSession(refreshedSession);

    return fetchPracticeAreaTemplates(refreshedSession.tokens.accessToken);
  }

  async function fetchPracticeAreaTemplates(accessToken: string) {
    return fetch("/api/practice-area-templates", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  async function getResponseErrorMessage(response: Response) {
    const body = (await response.json().catch(() => null)) as { message?: unknown } | null;
    const message = body?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    return `No se pudieron cargar las areas reutilizables. (${response.status})`;
  }

  async function requestStartOnboarding(payload: OnboardingPayload, activeSession: BogaapSession) {
    const response = await startOnboardingRequest(payload, activeSession.tokens.accessToken);

    if (response.status !== 401) {
      return response;
    }

    const refreshedSession = await refreshSession(activeSession);
    if (!refreshedSession) {
      return response;
    }

    setSession(refreshedSession);
    saveSession(refreshedSession);

    return startOnboardingRequest(payload, refreshedSession.tokens.accessToken);
  }

  async function startOnboardingRequest(payload: OnboardingPayload, accessToken: string) {
    return fetch("/api/onboarding/start", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  }

  async function refreshSession(activeSession: BogaapSession) {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refreshToken: activeSession.tokens.refreshToken })
    });

    if (!response.ok) {
      return null;
    }

    const tokens = (await response.json()) as BogaapSession["tokens"];
    return {
      ...activeSession,
      tokens
    };
  }
}
