"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

export type ColorMode = "navy-slate";
export type ThemeVariant = "light" | "dark";

type ThemeContextValue = {
  colorMode: ColorMode;
  isDark: boolean;
  setColorMode: (colorMode: ColorMode) => void;
  setVariant: (variant: ThemeVariant) => void;
  toggleVariant: () => void;
  variant: ThemeVariant;
};

const colorModes: ColorMode[] = ["navy-slate"];
const themeClassNames = ["theme-monotone", "theme-dorado", "theme-navy-slate"];
const themeStorageKey = "bogaap-theme";
const variantStorageKey = "bogaap-theme-variant";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredColorMode(): ColorMode {
  if (typeof window === "undefined") {
    return "navy-slate";
  }

  const stored = window.localStorage.getItem(themeStorageKey);
  return colorModes.includes(stored as ColorMode) ? (stored as ColorMode) : "navy-slate";
}

function getStoredVariant(): ThemeVariant {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem(variantStorageKey) === "light" ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>(getStoredColorMode);
  const [variant, setVariant] = useState<ThemeVariant>(getStoredVariant);
  const isDark = variant === "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...themeClassNames);
    root.classList.add(`theme-${colorMode}`);
    root.classList.toggle("dark", isDark);
    window.localStorage.setItem(themeStorageKey, colorMode);
    window.localStorage.setItem(variantStorageKey, variant);
  }, [colorMode, isDark, variant]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorMode,
      isDark,
      setColorMode,
      setVariant,
      toggleVariant: () => setVariant((current) => (current === "dark" ? "light" : "dark")),
      variant
    }),
    [colorMode, isDark, variant]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }

  return theme;
}
