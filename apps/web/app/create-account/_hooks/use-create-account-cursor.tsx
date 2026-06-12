"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent,
  type ReactNode
} from "react";
import { createAccountCopy } from "../_constants/create-account.constants";

type CursorState = {
  inputFocused: boolean;
  label: string;
  tooltipVisible: boolean;
  visible: boolean;
  x: number;
  y: number;
};

type CreateAccountCursorContextValue = CursorState & {
  surfaceHandlers: {
    onBlurCapture: (event: ReactFocusEvent<HTMLElement>) => void;
    onFocusCapture: (event: ReactFocusEvent<HTMLElement>) => void;
    onMouseEnter: (event: MouseEvent<HTMLElement>) => void;
    onMouseLeave: () => void;
    onMouseMove: (event: MouseEvent<HTMLElement>) => void;
  };
};

const initialCursorState: CursorState = {
  inputFocused: false,
  label: createAccountCopy.formTooltip,
  tooltipVisible: false,
  visible: false,
  x: 0,
  y: 0
};

const CreateAccountCursorContext = createContext<CreateAccountCursorContextValue | null>(null);

type CreateAccountCursorProviderProps = {
  children: ReactNode;
  submitting: boolean;
};

export function CreateAccountCursorProvider({
  children,
  submitting
}: CreateAccountCursorProviderProps) {
  const [cursor, setCursor] = useState<CursorState>(initialCursorState);

  useEffect(() => {
    function syncActiveInput() {
      window.setTimeout(() => {
        setCursor((current) => ({
          ...current,
          inputFocused: isInputTarget(document.activeElement)
        }));
      }, 0);
    }

    function handleFocusIn(event: FocusEvent) {
      if (!isInputTarget(event.target)) {
        return;
      }

      setCursor((current) => ({
        ...current,
        inputFocused: true,
        label: createAccountCopy.formTooltip,
        tooltipVisible: true
      }));
    }

    function handleFocusOut(event: FocusEvent) {
      if (!isInputTarget(event.target)) {
        return;
      }

      window.setTimeout(() => {
        setCursor((current) => ({
          ...current,
          inputFocused: isInputTarget(document.activeElement)
        }));
      }, 0);
    }

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    document.addEventListener("pointerup", syncActiveInput);
    document.addEventListener("keyup", syncActiveInput);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      document.removeEventListener("pointerup", syncActiveInput);
      document.removeEventListener("keyup", syncActiveInput);
    };
  }, []);

  function updateCursor(event: MouseEvent<HTMLElement>) {
    const target = event.target;
    const isElement = target instanceof Element;
    const isFormTarget = isElement && Boolean(target.closest("[data-create-account-form]"));
    const isSubmitTarget = isElement && Boolean(target.closest("[data-create-account-submit]"));
    const inputFocused = isInputTarget(document.activeElement);

    setCursor((current) => ({
      inputFocused: current.inputFocused || inputFocused,
      label: isSubmitTarget ? createAccountCopy.submitTooltip : createAccountCopy.formTooltip,
      tooltipVisible: isFormTarget && !submitting,
      visible: true,
      x: event.clientX,
      y: event.clientY
    }));
  }

  function updateInputFocus(event: ReactFocusEvent<HTMLElement>, inputFocused: boolean) {
    if (!isInputTarget(event.target)) {
      return;
    }

    setCursor((current) => ({
      ...current,
      inputFocused,
      label: createAccountCopy.formTooltip,
      tooltipVisible: inputFocused ? true : current.tooltipVisible
    }));
  }

  const value: CreateAccountCursorContextValue = {
    ...cursor,
    tooltipVisible: cursor.tooltipVisible && !submitting,
    surfaceHandlers: {
      onBlurCapture: (event) => updateInputFocus(event, false),
      onFocusCapture: (event) => updateInputFocus(event, true),
      onMouseEnter: updateCursor,
      onMouseLeave: () =>
        setCursor((current) => ({
          ...current,
          inputFocused: false,
          tooltipVisible: false,
          visible: false
        })),
      onMouseMove: updateCursor
    }
  };

  return (
    <CreateAccountCursorContext.Provider value={value}>
      {children}
    </CreateAccountCursorContext.Provider>
  );
}

export function useCreateAccountCursor() {
  const context = useContext(CreateAccountCursorContext);

  if (!context) {
    throw new Error("useCreateAccountCursor must be used inside CreateAccountCursorProvider");
  }

  return context;
}

function isInputTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}
