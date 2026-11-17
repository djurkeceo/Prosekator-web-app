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

const accentStyles: Record<ToastVariant, string> = {
  success: "bg-green",
  error: "bg-danger",
  info: "bg-info",
};

const iconStyles: Record<ToastVariant, string> = {
  success: "text-green",
  error: "text-danger",
  info: "text-info",
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
              className="animate-toast-in pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-[6px] border border-line bg-surface p-3.5 shadow-strong"
              role="status"
            >
              <span
                className={cn("absolute inset-y-0 left-0 w-0.5", accentStyles[item.variant])}
                aria-hidden="true"
              />
              <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconStyles[item.variant])} />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium leading-5">{item.title}</p>
                {item.description ? (
                  <p className="mt-0.5 text-[10.5px] leading-5 text-muted">{item.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="p-1 text-muted transition-colors hover:text-fg"
                aria-label="Zatvori obaveštenje"
              >
                <X className="h-3.5 w-3.5" />
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
