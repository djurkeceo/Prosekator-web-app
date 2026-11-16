import {
  ClipboardList,
  Minus,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import type { GradebookStats } from "@/lib/types";
import { formatAverage, formatGrade } from "@/lib/calculations";
import { cn, gradeCountLabel } from "@/lib/utils";

type AverageHeroProps = {
  stats: GradebookStats;
  isGuest: boolean;
  isRefreshing: boolean;
};

const gradeColors = {
  1: "#FF5C5C",
  2: "#FF8A3D",
  3: "#F5C542",
  4: "#4ED47A",
  5: "#B4D63D",
} as const;

function AverageRing({ average, hasGrades }: { average: number; hasGrades: boolean }) {
  return (
    <div
      className="flex h-28 w-28 shrink-0 flex-col items-center justify-center border-[3px] border-line bg-accent-soft text-fg shadow-[6px_6px_0_var(--shadow-color)] sm:h-32 sm:w-32"
      aria-label={hasGrades ? `Prosek ${formatAverage(average)} od 5` : "Još nema ocena"}
    >
      <span className="text-3xl font-bold leading-none tracking-tight sm:text-4xl">
        {hasGrades ? formatAverage(average) : "—"}
      </span>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em]">od 5,00</span>
    </div>
  );
}

function TrendBadge({ stats }: { stats: GradebookStats }) {
  const { direction, label } = stats.trend;

  return (
    <span
      className={cn(
        "badge",
        direction === "up" && "bg-accent-soft text-fg",
        direction === "down" && "bg-danger-soft text-danger",
        (direction === "flat" || direction === "none") && "bg-surface-3 text-muted"
      )}
    >
      {direction === "up" ? (
        <TrendingUp className="h-3.5 w-3.5" />
      ) : direction === "down" ? (
        <TrendingDown className="h-3.5 w-3.5" />
      ) : (
        <Minus className="h-3.5 w-3.5" />
      )}
      {label}
    </span>
  );
}

function Distribution({ distribution }: { distribution: GradebookStats["distribution"] }) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="eyebrow">Raspodela ocena</span>
        <span className="text-xs font-semibold text-muted">{total} ukupno</span>
      </div>

      <div className="flex h-4 gap-0 overflow-hidden border-2 border-line bg-surface-3" aria-hidden="true">
        {total === 0 ? (
          <div className="h-full w-full bg-line-strong" />
        ) : (
          ([1, 2, 3, 4, 5] as const).map((grade) => {
            const count = distribution[grade];
            if (!count) return null;
            return (
              <div
                key={grade}
                className="h-full transition-all duration-500"
                style={{
                  flexGrow: count,
                  backgroundColor: gradeColors[grade],
                }}
                title={`Ocena ${grade}: ${count}`}
              />
            );
          })
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
        {([1, 2, 3, 4, 5] as const).map((grade) => (
          <span key={grade} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: gradeColors[grade] }}
            />
            {grade} ({distribution[grade]})
          </span>
        ))}
      </div>
    </div>
  );
}

export function AverageHero({ stats, isGuest, isRefreshing }: AverageHeroProps) {
  const hasGrades = stats.totalGrades > 0;

  return (
    <section className="card relative overflow-hidden p-5 sm:p-6 lg:p-7">
      <div className="relative">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">Ukupan školski prosek</span>
              <span className="badge bg-surface-3 text-muted">
                {isGuest ? "Gost" : "Nalog"}
              </span>
              {isRefreshing ? (
                <span className="badge bg-accent-soft text-fg">Sinhronizacija…</span>
              ) : null}
            </div>

            <div className="mt-3 flex items-end gap-2.5">
              <span className="gradient-text text-6xl font-bold leading-[0.9] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                {hasGrades ? formatAverage(stats.overallAverage) : "—"}
              </span>
              <span className="mb-2 text-sm font-bold text-muted">/ 5,00</span>
            </div>

            <p className="mt-2 text-sm text-muted">
              {hasGrades
                ? `${stats.gradedSubjects} ${stats.gradedSubjects === 1 ? "predmet" : "predmeta"} sa ocenama • ${gradeCountLabel(stats.totalGrades)}`
                : "Još nema ocena — dodaj prvu i prosek se računa automatski."}
            </p>

            <div className="mt-3">
              <TrendBadge stats={stats} />
            </div>
          </div>

          <AverageRing average={hasGrades ? stats.overallAverage : 0} hasGrades={hasGrades} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="border-2 border-line bg-surface-2 p-3.5 shadow-[3px_3px_0_var(--shadow-color)]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              <TrendingUp className="h-3.5 w-3.5 text-accent-strong" />
              Najviša
            </div>
            <p className="mt-1.5 text-2xl font-extrabold text-accent-strong">
              {formatGrade(stats.bestGrade)}
            </p>
          </div>

          <div className="border-2 border-line bg-surface-2 p-3.5 shadow-[3px_3px_0_var(--shadow-color)]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              <TrendingDown className="h-3.5 w-3.5 text-danger" />
              Najniža
            </div>
            <p className="mt-1.5 text-2xl font-extrabold text-danger">
              {formatGrade(stats.worstGrade)}
            </p>
          </div>

          <div className="border-2 border-line bg-surface-2 p-3.5 shadow-[3px_3px_0_var(--shadow-color)]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              <ClipboardList className="h-3.5 w-3.5 text-info" />
              Ocena
            </div>
            <p className="mt-1.5 text-2xl font-extrabold">{stats.totalGrades}</p>
          </div>

          <div className="min-w-0 border-2 border-line bg-surface-2 p-3.5 shadow-[3px_3px_0_var(--shadow-color)]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              <Trophy className="h-3.5 w-3.5 text-warn" />
              Najbolji
            </div>
            <p className="mt-1.5 truncate text-sm font-extrabold" title={stats.bestSubjectName || undefined}>
              {stats.bestSubjectName || "—"}
            </p>
          </div>
        </div>

        <Distribution distribution={stats.distribution} />
      </div>
    </section>
  );
}
