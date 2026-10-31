"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastItem = ToastInput & {
  id: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (input: ToastInput | string) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<ToastVariant, string> = {
  success: "border-accent/30 bg-accent-soft text-fg",
  error: "border-danger/30 bg-danger-soft text-fg",
  info: "border-line-strong bg-surface-solid text-fg",
};

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput | string) => {
      const payload: ToastInput = typeof input === "string" ? { title: input } : input;
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      const item: ToastItem = {
        ...payload,
        id,
        variant: payload.variant || "info",
      };

      setItems((current) => [...current.slice(-2), item]);
      window.setTimeout(() => dismiss(id), item.variant === "error" ? 6000 : 4200);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast, dismiss }), [dismiss, toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[120] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:items-end sm:px-0"
        aria-live="polite"
        aria-atomic="false"
      >
        {items.map((item) => {
          const Icon = icons[item.variant];
          return (
            <div
              key={item.id}
              className={cn(
                "animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-3.5 shadow-strong backdrop-blur-xl",
                variantStyles[item.variant]
              )}
              role="status"
            >
              <Icon
                className={cn(
                  "mt-0.5 h-5 w-5 shrink-0",
                  item.variant === "success" && "text-accent",
                  item.variant === "error" && "text-danger",
                  item.variant === "info" && "text-info"
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-5">{item.title}</p>
                {item.description ? (
                  <p className="mt-0.5 text-xs leading-5 text-muted">{item.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="rounded-full p-1 text-muted transition hover:bg-surface-2 hover:text-fg"
                aria-label="Zatvori obaveštenje"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
