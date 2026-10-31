"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  loading?: boolean;
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Potvrdi",
  cancelLabel = "Otkaži",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  const Icon = variant === "danger" ? Trash2 : AlertTriangle;

  return (
    <Modal
      open={open}
      onClose={loading ? () => undefined : onClose}
      title={title}
      description={description}
      size="sm"
      closeOnBackdrop={!loading}
      icon={
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl",
            variant === "danger" ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent-strong"
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      }
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn("btn", variant === "danger" ? "btn-danger" : "btn-primary")}
            disabled={loading}
          >
            {loading ? <Spinner /> : <Icon className="h-4 w-4" />}
            {confirmLabel}
          </button>
        </div>
      }
    >
      <div className="rounded-2xl border border-line bg-surface-2 p-3 text-xs leading-5 text-muted">
        Ova akcija se ne može automatski poništiti.
      </div>
    </Modal>
  );
}
