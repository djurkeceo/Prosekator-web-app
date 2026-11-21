"use client";

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
    <section className="premium-card fig">
      <div className="fig-bar">
        <span className="fig-label">fig. 03 — poslednje ocene</span>
        <span className="font-mono text-[10px]">{recent.length} × 5</span>
      </div>

      {recent.length === 0 ? (
        <div className="p-4">
          <p className="border border-dashed border-line p-4 text-center font-mono text-[10px] leading-5 text-muted">
            kada dodaš ocenu, najnovije će se pojaviti ovde
          </p>
        </div>
      ) : (
        <div className="divide-y divide-line px-2">
          {recent.map(({ grade, subject }) => {
            const gradeIndex = subject.grades.findIndex((item) => item.id === grade.id);
            const color = GRADE_COLORS[grade.value] || "#2B2BFF";

            return (
              <button
                key={`${subject.id}-${grade.id}`}
                type="button"
                onClick={() => onEditGrade(subject, grade, gradeIndex)}
                className="flex w-full items-center gap-3 rounded-[2px] px-1.5 py-2.5 text-left transition-all duration-150 hover:translate-x-1 hover:bg-surface-2 active:scale-[0.99]"
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border font-mono text-[10px]"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${color} 8%, var(--surface))`,
                    borderColor: `color-mix(in srgb, ${color} 26%, var(--line))`,
                    color: `color-mix(in srgb, ${color} 76%, var(--fg))`,
                  }}
                >
                  {grade.value}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium">{subject.name}</p>
                  <p className="truncate font-mono text-[9px] text-muted">
                    {grade.description || "bez opisa"}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[8.5px] text-muted">
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
