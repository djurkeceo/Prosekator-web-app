"use client";

import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { GRADE_COLORS, GRADE_LABELS } from "@/lib/constants";
import { formatAverage, getSubjectAverage, getSubjectFinalGrade } from "@/lib/calculations";
import type { Grade, Subject } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

type SubjectCardProps = {
  subject: Subject;
  index: number;
  isSaving: boolean;
  onAddGrade: (subject: Subject) => void;
  onEditGrade: (subject: Subject, grade: Grade, gradeIndex: number) => void;
  onEditSubject: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
};

export function SubjectCard({
  subject,
  index,
  isSaving,
  onAddGrade,
  onEditGrade,
  onEditSubject,
  onDelete,
}: SubjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const average = getSubjectAverage(subject);
  const finalGrade = getSubjectFinalGrade(subject);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <article
      className="card animate-fade-up relative overflow-visible p-4 pl-5 transition-transform hover:-translate-y-0.5"
      style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
    >
      <span
        className="absolute bottom-4 left-0 top-4 w-1.5"
        style={{ backgroundColor: subject.color }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: subject.color }}
            aria-hidden="true"
          />
          <h3 className="truncate text-[0.95rem] font-extrabold sm:text-base" title={subject.name}>
            {subject.name}
          </h3>
        </div>

        <div ref={menuRef} className="relative flex shrink-0 items-center gap-1">
          {isSaving ? <Spinner className="h-3.5 w-3.5 text-muted" /> : null}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center border-2 border-line bg-surface text-fg shadow-[2px_2px_0_var(--shadow-color)] transition hover:bg-accent-soft"
            aria-label={`Opcije za ${subject.name}`}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen ? (
            <div className="card animate-fade-up absolute right-0 top-[calc(100%+6px)] z-30 w-44 p-1.5" role="menu">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEditSubject(subject);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-muted transition hover:bg-accent-soft hover:text-fg"
                role="menuitem"
              >
                <Pencil className="h-3.5 w-3.5" />
                Izmeni predmet
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(subject);
                }}
                className="flex w-full items-center gap-2 rounded-none px-3 py-2 text-left text-xs font-semibold text-danger transition hover:bg-danger-soft"
                role="menuitem"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Obriši predmet
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {subject.grades.length === 0 ? (
            <span className="text-xs text-muted">Još nema ocena.</span>
          ) : (
            subject.grades.map((grade, gradeIndex) => {
              const color = GRADE_COLORS[grade.value] || "#B4D63D";
              return (
                <button
                  key={grade.id}
                  type="button"
                  onClick={() => onEditGrade(subject, grade, gradeIndex)}
                  className="group relative flex h-9 min-w-9 items-center justify-center border-2 border-line px-2 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-[2px_2px_0_var(--shadow-color)]"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${color} 22%, var(--surface))`,
                    color: `color-mix(in srgb, ${color} 68%, var(--fg))`,
                  }}
                  aria-label={`Ocena ${grade.value} — ${grade.description || GRADE_LABELS[grade.value]}. Klikni za izmenu.`}
                  title={grade.description || GRADE_LABELS[grade.value]}
                >
                  {grade.value}
                  <span className="tooltip-surface pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 hidden w-max max-w-48 -translate-x-1/2 rounded-none px-2.5 py-1.5 text-center text-[10px] font-semibold leading-4 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
                    {grade.description || GRADE_LABELS[grade.value]}
                    <span className="mt-0.5 block text-[9px] font-medium text-muted">
                      {formatDate(grade.createdAt)}
                    </span>
                  </span>
                </button>
              );
            })
          )}

          <button
            type="button"
            onClick={() => onAddGrade(subject)}
            className="flex h-9 min-w-9 items-center justify-center border-2 border-dashed border-line bg-surface px-2 text-fg transition hover:border-solid hover:bg-accent-soft"
            aria-label={`Dodaj ocenu za ${subject.name}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex shrink-0 flex-col items-end border-2 border-line bg-accent-soft px-2.5 py-1.5 text-fg">
          <span className="text-[9px] font-bold uppercase tracking-[0.14em]">Prosek</span>
          <span
            className={cn(
              "text-xl font-bold leading-none tracking-tight",
              average === null && "text-muted"
            )}
          >
            {average === null ? "—" : formatAverage(average)}
          </span>
          {finalGrade !== null ? (
            <span className="mt-1 text-[10px] font-semibold">
              Zaključna: <span className="font-bold">{finalGrade}</span>
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
