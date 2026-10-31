"use client";

import { Check, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { GRADE_COLORS, GRADE_LABELS, GRADE_VALUES, QUICK_DESCRIPTIONS } from "@/lib/constants";
import { formatAverage, getSubjectAverage } from "@/lib/calculations";
import type { Grade, Subject } from "@/lib/types";
import { cn, generateId } from "@/lib/utils";

type GradeDialogProps = {
  open: boolean;
  subject: Subject | null;
  editingGrade: Grade | null;
  onClose: () => void;
  onSave: (grades: Grade[]) => Promise<boolean>;
};

export function GradeDialog({ open, subject, editingGrade, onClose, onSave }: GradeDialogProps) {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedValue(editingGrade?.value ?? null);
    setDescription(editingGrade?.description ?? "");
    setError("");
    setSaving(false);
    setDeleteOpen(false);
    setDeleting(false);
  }, [editingGrade, open]);

  if (!subject) return null;

  const subjectAverage = getSubjectAverage(subject);
  const isEditing = Boolean(editingGrade);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!selectedValue) {
      setError("Izaberi ocenu od 1 do 5.");
      return;
    }

    const trimmedDescription = description.trim().slice(0, 160);
    const nextGrade: Grade = editingGrade
      ? {
          ...editingGrade,
          value: selectedValue,
          description: trimmedDescription,
        }
      : {
          id: generateId(),
          value: selectedValue,
          description: trimmedDescription,
          createdAt: new Date().toISOString(),
        };

    const nextGrades = editingGrade
      ? subject.grades.map((grade) => (grade.id === editingGrade.id ? nextGrade : grade))
      : [...subject.grades, nextGrade];

    setSaving(true);
    const success = await onSave(nextGrades);
    setSaving(false);

    if (success) onClose();
  };

  const handleDelete = async () => {
    if (!editingGrade) return;

    setDeleting(true);
    const nextGrades = subject.grades.filter((grade) => grade.id !== editingGrade.id);
    const success = await onSave(nextGrades);
    setDeleting(false);

    if (success) {
      setDeleteOpen(false);
      onClose();
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={saving ? () => undefined : onClose}
        title={isEditing ? "Izmeni ocenu" : "Dodaj ocenu"}
        description={`${subject.name}${subjectAverage !== null ? ` • trenutni prosek ${formatAverage(subjectAverage)}` : ""}`}
        size="sm"
        closeOnBackdrop={!saving}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <p className="label">Ocena</p>
            <div className="grid grid-cols-5 gap-2">
              {GRADE_VALUES.map((value) => {
                const selected = selectedValue === value;
                const color = GRADE_COLORS[value];

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setSelectedValue(value);
                      if (error) setError("");
                    }}
                    className={cn(
                      "flex h-16 flex-col items-center justify-center rounded-2xl border-2 transition hover:-translate-y-0.5",
                      selected ? "shadow-soft" : "border-line bg-surface-2"
                    )}
                    style={
                      selected
                        ? {
                            backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)`,
                            borderColor: color,
                          }
                        : undefined
                    }
                    aria-pressed={selected}
                    aria-label={`Ocena ${value} — ${GRADE_LABELS[value]}`}
                  >
                    <span
                      className="text-xl font-extrabold"
                      style={{ color: selected ? `color-mix(in srgb, ${color} 70%, var(--fg))` : "var(--fg)" }}
                    >
                      {value}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-muted">
                      {GRADE_LABELS[value]}
                    </span>
                  </button>
                );
              })}
            </div>
            {error ? (
              <p className="mt-2 text-xs font-semibold text-danger" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="grade-description" className="label">
              Opis <span className="font-normal text-muted">(opciono)</span>
            </label>
            <input
              id="grade-description"
              className="input"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Npr. Prvi pismeni zadatak"
              maxLength={160}
              autoComplete="off"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {QUICK_DESCRIPTIONS.map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => setDescription(quick)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[10px] font-semibold transition",
                    description === quick
                      ? "border-accent bg-accent-soft text-accent-strong"
                      : "border-line bg-surface-2 text-muted hover:border-line-strong hover:text-fg"
                  )}
                >
                  {quick}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button type="submit" className="btn btn-primary w-full" disabled={saving}>
              {saving ? <Spinner /> : <Check className="h-4 w-4" />}
              {isEditing ? "Sačuvaj izmene" : "Dodaj ocenu"}
            </button>

            {isEditing ? (
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="btn btn-ghost w-full text-danger hover:bg-danger-soft hover:text-danger"
                disabled={saving}
              >
                <Trash2 className="h-4 w-4" />
                Obriši ocenu
              </button>
            ) : null}
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Obrisati ocenu?"
        description={
          editingGrade
            ? `Ocena ${editingGrade.value}${editingGrade.description ? ` (${editingGrade.description})` : ""} biće trajno uklonjena iz predmeta ${subject.name}.`
            : ""
        }
        confirmLabel="Obriši ocenu"
        loading={deleting}
        variant="danger"
      />
    </>
  );
}
