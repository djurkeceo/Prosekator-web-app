"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  mounted: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    const initial: Theme = current === "light" ? "light" : "dark";
    setThemeState(initial);
    setMounted(true);

    const media = window.matchMedia("(prefers-color-scheme: light)");
    const handleSystemChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem(STORAGE_KEYS.theme)) return;
      const next: Theme = event.matches ? "light" : "dark";
      setThemeState(next);
      applyTheme(next);
    };

    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);

    try {
      localStorage.setItem(STORAGE_KEYS.theme, next);
    } catch {
      // Storage can be disabled; the theme still applies for this session.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, mounted, setTheme, toggleTheme }),
    [mounted, setTheme, theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
