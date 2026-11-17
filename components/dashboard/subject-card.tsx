"use client";

import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { GRADE_COLORS, GRADE_LABELS } from "@/lib/constants";
import { formatAverage, getSubjectAverage, getSubjectFinalGrade } from "@/lib/calculations";
import type { Grade, Subject } from "@/lib/types";
import { cn, formatDate, gradeCountLabel } from "@/lib/utils";

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
      className="card animate-fade-up relative overflow-visible p-4 transition-colors hover:border-line-strong"
      style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <span
            className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-[1px]"
            style={{ backgroundColor: subject.color }}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <h3 className="truncate font-mono text-[15px] font-medium tracking-[-0.02em]" title={subject.name}>
              {subject.name}
            </h3>
            <p className="mt-1 font-mono text-[9px] text-muted">
              {gradeCountLabel(subject.grades.length)}
              {finalGrade !== null ? ` · zaključna ${finalGrade}` : " · bez zaključne"}
            </p>
          </div>
        </div>

        <div ref={menuRef} className="relative flex shrink-0 items-center gap-1">
          {isSaving ? <Spinner className="h-3.5 w-3.5 text-muted" /> : null}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="icon-btn h-8 w-8"
            aria-label={`Opcije za ${subject.name}`}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen ? (
            <div
              className="animate-fade-up absolute right-0 top-[calc(100%+6px)] z-30 w-44 overflow-hidden rounded-[8px] border border-line bg-surface p-1 shadow-strong"
              role="menu"
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEditSubject(subject);
                }}
                className="flex w-full items-center gap-2 rounded-[4px] px-2.5 py-2 text-left text-[11px] text-muted transition hover:bg-surface-2 hover:text-fg"
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
                className="flex w-full items-center gap-2 rounded-[4px] px-2.5 py-2 text-left text-[11px] text-danger transition hover:bg-danger-soft"
                role="menuitem"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Obriši predmet
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {subject.grades.length === 0 ? (
            <span className="font-mono text-[10px] text-muted">još nema ocena</span>
          ) : (
            subject.grades.map((grade, gradeIndex) => {
              const color = GRADE_COLORS[grade.value] || "#2B2BFF";
              return (
                <button
                  key={grade.id}
                  type="button"
                  onClick={() => onEditGrade(subject, grade, gradeIndex)}
                  className="group/grade relative flex h-8 min-w-8 items-center justify-center rounded-[2px] border px-1.5 font-mono text-[11px] font-medium transition hover:border-fg"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${color} 8%, var(--surface))`,
                    borderColor: `color-mix(in srgb, ${color} 26%, var(--line))`,
                    color: `color-mix(in srgb, ${color} 76%, var(--fg))`,
                  }}
                  aria-label={`Ocena ${grade.value} — ${grade.description || GRADE_LABELS[grade.value]}. Klikni za izmenu.`}
                  title={grade.description || GRADE_LABELS[grade.value]}
                >
                  {grade.value}
                  <span className="tooltip-surface pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 hidden w-max max-w-48 -translate-x-1/2 px-2 py-1.5 text-center text-[9px] leading-4 opacity-0 transition group-hover/grade:opacity-100 group-focus-visible/grade:opacity-100 sm:block">
                    {grade.description || GRADE_LABELS[grade.value]}
                    <span className="mt-0.5 block text-[8px] text-muted">
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
            className="flex h-8 min-w-8 items-center justify-center rounded-[2px] border border-dashed border-line bg-surface px-1.5 text-fg transition hover:border-solid hover:border-fg hover:bg-surface-2"
            aria-label={`Dodaj ocenu za ${subject.name}`}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex shrink-0 flex-col items-end border-l border-line pl-3">
          <span className="font-mono text-[8.5px] text-muted">prosek</span>
          <span
            className={cn(
              "mt-1 font-mono text-lg leading-none tracking-[-0.03em]",
              average === null ? "text-muted" : "text-fg"
            )}
          >
            {average === null ? "—" : formatAverage(average)}
          </span>
          {finalGrade !== null ? (
            <span className="mt-1 font-mono text-[9px] text-muted">
              zaključna <span className="text-fg">{finalGrade}</span>
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
