"use client";

import { Check, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { SUBJECT_COLORS } from "@/lib/constants";
import type { Subject } from "@/lib/types";
import { cn } from "@/lib/utils";

type SubjectEditDialogProps = {
  open: boolean;
  subject: Subject | null;
  onClose: () => void;
  onSave: (subjectId: string, name: string, color: string) => Promise<boolean>;
};

export function SubjectEditDialog({ open, subject, onClose, onSave }: SubjectEditDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(SUBJECT_COLORS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !subject) return;
    setName(subject.name);
    setColor(subject.color);
    setError("");
    setLoading(false);
  }, [open, subject]);

  if (!subject) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmed = name.trim();

    if (!trimmed) {
      setError("Naziv predmeta ne može biti prazan.");
      return;
    }

    if (trimmed.length > 60) {
      setError("Naziv može imati najviše 60 karaktera.");
      return;
    }

    setLoading(true);

    try {
      const success = await onSave(subject.id, trimmed, color);
      if (success) onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={loading ? () => undefined : onClose}
      title="Izmeni predmet"
      description="Promeni naziv ili boju kojom se predmet ističe u listi."
      size="sm"
      closeOnBackdrop={!loading}
      icon={
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
          <Palette className="h-5 w-5" />
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="edit-subject-name" className="label">
            Naziv predmeta
          </label>
          <input
            id="edit-subject-name"
            data-autofocus
            className="input"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError("");
            }}
            maxLength={60}
            aria-invalid={Boolean(error)}
          />
          {error ? (
            <p className="mt-1.5 text-xs font-semibold text-danger" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div>
          <p className="label">Boja predmeta</p>
          <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
            {SUBJECT_COLORS.map((paletteColor) => {
              const selected = paletteColor.toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={paletteColor}
                  type="button"
                  onClick={() => setColor(paletteColor)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition hover:scale-110",
                    selected ? "border-fg" : "border-transparent"
                  )}
                  style={{ backgroundColor: paletteColor }}
                  aria-label={`Izaberi boju ${paletteColor}`}
                  aria-pressed={selected}
                >
                  {selected ? <Check className="h-3.5 w-3.5 text-[#08120a]" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2 p-3">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
          <p className="truncate text-sm font-bold">{name.trim() || subject.name}</p>
          <span className="ml-auto text-xs text-muted">pregled</span>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
            Otkaži
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Spinner /> : <Check className="h-4 w-4" />}
            Sačuvaj izmene
          </button>
        </div>
      </form>
    </Modal>
  );
}
