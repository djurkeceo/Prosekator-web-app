"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, mounted, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`icon-btn ${className}`}
      aria-label={theme === "dark" ? "Uključi svetlu temu" : "Uključi tamnu temu"}
      title={theme === "dark" ? "Svetla tema" : "Tamna tema"}
    >
      {!mounted ? (
        <Moon className="h-4.5 w-4.5 opacity-50" />
      ) : theme === "dark" ? (
        <Sun className="h-4.5 w-4.5" />
      ) : (
        <Moon className="h-4.5 w-4.5" />
      )}
    </button>
  );
}
