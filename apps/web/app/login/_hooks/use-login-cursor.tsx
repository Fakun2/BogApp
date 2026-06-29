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

type CursorState = {
  inputFocused: boolean;
  label: string;
  tooltipVisible: boolean;
  visible: boolean;
  x: number;
  y: number;
};

type LoginCursorContextValue = CursorState & {
  surfaceHandlers: {
    onBlurCapture: (event: ReactFocusEvent<HTMLElement>) => void;
    onFocusCapture: (event: ReactFocusEvent<HTMLElement>) => void;
    onMouseEnter: (event: MouseEvent<HTMLElement>) => void;
    onMouseLeave: () => void;
    onMouseMove: (event: MouseEvent<HTMLElement>) => void;
  };
};

const loginTooltipCopy = {
  form: "Hola!",
  submit: "Bienvenido!"
} as const;

const initialCursorState: CursorState = {
  inputFocused: false,
  label: loginTooltipCopy.form,
  tooltipVisible: false,
  visible: false,
  x: 0,
  y: 0
};

const LoginCursorContext = createContext<LoginCursorContextValue | null>(null);

type LoginCursorProviderProps = {
  children: ReactNode;
  disabled?: boolean;
};

export function LoginCursorProvider({ children, disabled = false }: LoginCursorProviderProps) {
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
        label: loginTooltipCopy.form,
        tooltipVisible: true
      }));
    }

    function handleFocusOut(event: FocusEvent) {
      if (!isInputTarget(event.target)) {
        return;
      }

      syncActiveInput();
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
    const isFormTarget = isElement && Boolean(target.closest("[data-login-form]"));
    const isSubmitTarget = isElement && Boolean(target.closest("[data-login-submit]"));
    const inputFocused = isInputTarget(document.activeElement);

    setCursor((current) => ({
      inputFocused: current.inputFocused || inputFocused,
      label: isSubmitTarget ? loginTooltipCopy.submit : loginTooltipCopy.form,
      tooltipVisible: isFormTarget && !disabled,
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
      label: loginTooltipCopy.form,
      tooltipVisible: inputFocused ? true : current.tooltipVisible
    }));
  }

  const value: LoginCursorContextValue = {
    ...cursor,
    tooltipVisible: cursor.tooltipVisible && !disabled,
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

  return <LoginCursorContext.Provider value={value}>{children}</LoginCursorContext.Provider>;
}

export function useLoginCursor() {
  const context = useContext(LoginCursorContext);

  if (!context) {
    throw new Error("useLoginCursor must be used inside LoginCursorProvider");
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
