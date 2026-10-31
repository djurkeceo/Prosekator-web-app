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
  const percentage = hasGrades ? Math.max(0, Math.min(100, (average / 5) * 100)) : 0;

  return (
    <div
      className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full sm:h-32 sm:w-32"
      style={{
        background: `conic-gradient(var(--accent) ${percentage}%, var(--line) 0)`,
      }}
      aria-label={hasGrades ? `Prosek ${formatAverage(average)} od 5` : "Još nema ocena"}
    >
      <div className="absolute inset-[7px] flex flex-col items-center justify-center rounded-full border border-line bg-surface-solid">
        <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {hasGrades ? formatAverage(average) : "—"}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted">od 5,00</span>
      </div>
    </div>
  );
}

function TrendBadge({ stats }: { stats: GradebookStats }) {
  const { direction, label } = stats.trend;

  return (
    <span
      className={cn(
        "badge",
        direction === "up" && "bg-accent-soft text-accent-strong",
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

      <div className="flex h-2.5 gap-1 overflow-hidden rounded-full bg-surface-3" aria-hidden="true">
        {total === 0 ? (
          <div className="h-full w-full rounded-full bg-line-strong" />
        ) : (
          ([1, 2, 3, 4, 5] as const).map((grade) => {
            const count = distribution[grade];
            if (!count) return null;
            return (
              <div
                key={grade}
                className="h-full rounded-full transition-all duration-500"
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
      <div
        className="animate-float pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full opacity-70 blur-3xl"
        style={{ background: "var(--glow-1)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full opacity-60 blur-3xl"
        style={{ background: "var(--glow-2)" }}
        aria-hidden="true"
      />

      <div className="relative">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">Ukupan školski prosek</span>
              <span className="badge bg-surface-3 text-muted">
                {isGuest ? "Gost" : "Nalog"}
              </span>
              {isRefreshing ? (
                <span className="badge bg-accent-soft text-accent-strong">Sinhronizacija…</span>
              ) : null}
            </div>

            <div className="mt-2 flex items-end gap-2.5">
              <span className="gradient-text text-5xl font-extrabold leading-none tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                {hasGrades ? formatAverage(stats.overallAverage) : "—"}
              </span>
              <span className="mb-1.5 text-sm font-semibold text-muted">/ 5,00</span>
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
          <div className="rounded-2xl border border-line bg-surface-2 p-3.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              <TrendingUp className="h-3.5 w-3.5 text-accent-strong" />
              Najviša
            </div>
            <p className="mt-1.5 text-2xl font-extrabold text-accent-strong">
              {formatGrade(stats.bestGrade)}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface-2 p-3.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              <TrendingDown className="h-3.5 w-3.5 text-danger" />
              Najniža
            </div>
            <p className="mt-1.5 text-2xl font-extrabold text-danger">
              {formatGrade(stats.worstGrade)}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface-2 p-3.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              <ClipboardList className="h-3.5 w-3.5 text-info" />
              Ocena
            </div>
            <p className="mt-1.5 text-2xl font-extrabold">{stats.totalGrades}</p>
          </div>

          <div className="min-w-0 rounded-2xl border border-line bg-surface-2 p-3.5">
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
