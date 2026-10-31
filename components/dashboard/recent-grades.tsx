"use client";

import { Clock3 } from "lucide-react";
import { getRecentGrades } from "@/lib/calculations";
import { GRADE_COLORS } from "@/lib/constants";
import type { Grade, Subject } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type RecentGradesProps = {
  subjects: Subject[];
  onEditGrade: (subject: Subject, grade: Grade, gradeIndex: number) => void;
};

export function RecentGrades({ subjects, onEditGrade }: RecentGradesProps) {
  const recent = getRecentGrades(subjects, 5);

  return (
    <section className="card p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-3 text-info">
          <Clock3 className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-extrabold">Poslednje ocene</h2>
          <p className="text-xs text-muted">Najnovije unete ocene.</p>
        </div>
      </div>

      {recent.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line p-4 text-center text-xs leading-5 text-muted">
          Kada dodaš ocenu, najnovije će se pojaviti ovde.
        </p>
      ) : (
        <div className="mt-4 space-y-1">
          {recent.map(({ grade, subject }) => {
            const gradeIndex = subject.grades.findIndex((item) => item.id === grade.id);
            const color = GRADE_COLORS[grade.value] || "#B4D63D";

            return (
              <button
                key={`${subject.id}-${grade.id}`}
                type="button"
                onClick={() => onEditGrade(subject, grade, gradeIndex)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-surface-2"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-sm font-extrabold"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
                    borderColor: `color-mix(in srgb, ${color} 38%, transparent)`,
                    color: `color-mix(in srgb, ${color} 70%, var(--fg))`,
                  }}
                >
                  {grade.value}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{subject.name}</p>
                  <p className="truncate text-[10px] text-muted">
                    {grade.description || "Bez opisa"}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] font-semibold text-muted">
                  {formatDate(grade.createdAt)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
