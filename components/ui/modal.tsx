"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type ModalSize = "sm" | "md" | "lg";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  mobileSheet?: boolean;
  closeOnBackdrop?: boolean;
};

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  size = "md",
  mobileSheet = true,
  closeOnBackdrop = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !contentRef.current) return;

      const focusable = contentRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const focusTimer = window.setTimeout(() => {
      const preferred = contentRef.current?.querySelector<HTMLElement>(
        "[data-autofocus], input:not([type=hidden]), textarea, button"
      );
      preferred?.focus();
    }, 80);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [onClose, open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[110] flex justify-center p-3 sm:p-6",
        mobileSheet ? "items-end sm:items-center" : "items-center"
      )}
    >
      <div
        className="animate-fade-in absolute inset-0 bg-[rgba(3,6,12,0.74)] backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "card-solid animate-modal-in relative max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto p-5 sm:p-6",
          sizeClasses[size]
        )}
      >
        {mobileSheet ? (
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line-strong sm:hidden" />
        ) : null}

        <div className="flex items-start gap-3">
          {icon ? <div className="mt-0.5 shrink-0">{icon}</div> : null}
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-xl font-extrabold tracking-tight text-fg sm:text-2xl">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1.5 text-sm leading-6 text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button type="button" onClick={onClose} className="icon-btn -mr-1 -mt-1 h-10 w-10" aria-label="Zatvori">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="mt-5">{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
}
