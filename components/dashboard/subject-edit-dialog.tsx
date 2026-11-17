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
        <span className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-line bg-accent-soft text-yellow-fg">
          <Palette className="h-4 w-4" />
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
            <p className="mt-1.5 text-[11px] text-danger" role="alert">
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
                    "flex h-7 w-7 items-center justify-center rounded-[2px] border transition hover:scale-105",
                    selected ? "border-fg ring-1 ring-fg" : "border-line/40"
                  )}
                  style={{ backgroundColor: paletteColor }}
                  aria-label={`Izaberi boju ${paletteColor}`}
                  aria-pressed={selected}
                >
                  {selected ? (
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[1px] bg-surface text-fg shadow-soft">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 border border-line bg-surface-2 p-3">
          <span className="h-2 w-2 rounded-[1px]" style={{ backgroundColor: color }} />
          <p className="truncate font-mono text-[12px]">{name.trim() || subject.name}</p>
          <span className="ml-auto font-mono text-[9px] text-muted">pregled</span>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
            Otkaži
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Spinner /> : <Check className="h-3.5 w-3.5" />}
            Sačuvaj izmene
          </button>
        </div>
      </form>
    </Modal>
  );
}
