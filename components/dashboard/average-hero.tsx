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
  1: "#D64545",
  2: "#E08A3C",
  3: "#C9A227",
  4: "#1F9D6B",
  5: "#2B2BFF",
} as const;

function TrendBadge({ stats }: { stats: GradebookStats }) {
  const { direction, label } = stats.trend;

  return (
    <span
      className={cn(
        "badge",
        direction === "up" && "badge-green",
        direction === "down" && "badge-danger",
        (direction === "flat" || direction === "none") && "bg-surface-3 text-muted"
      )}
    >
      {direction === "up" ? (
        <TrendingUp className="h-3 w-3" />
      ) : direction === "down" ? (
        <TrendingDown className="h-3 w-3" />
      ) : (
        <Minus className="h-3 w-3" />
      )}
      {label}
    </span>
  );
}

function DistributionChart({
  distribution,
}: {
  distribution: GradebookStats["distribution"];
}) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  const max = Math.max(1, ...Object.values(distribution));

  return (
    <div className="border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">raspodela ocena</span>
        <span className="font-mono text-[10px] text-muted">{total} ukupno</span>
      </div>

      <div className="mt-4 flex h-32 items-end gap-2" aria-hidden="true">
        {([1, 2, 3, 4, 5] as const).map((grade) => {
          const count = distribution[grade];
          const height = total ? Math.max(4, Math.round((count / max) * 100)) : 4;
          return (
            <div key={grade} className="flex h-full min-w-0 flex-1 flex-col items-center gap-1.5">
              <span className="font-mono text-[9px] leading-none text-muted">{count}</span>
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full transition-all duration-500"
                  style={{
                    height: `${height}%`,
                    backgroundColor: gradeColors[grade],
                    opacity: count ? 1 : 0.16,
                  }}
                  title={`Ocena ${grade}: ${count}`}
                />
              </div>
              <span className="font-mono text-[9px] leading-none text-muted">{grade}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-line pt-2 font-mono text-[9px] text-muted">
        <span>min 1</span>
        <span>max 5</span>
      </div>
    </div>
  );
}

export function AverageHero({ stats, isGuest, isRefreshing }: AverageHeroProps) {
  const hasGrades = stats.totalGrades > 0;

  const statItems = [
    {
      label: "najviša",
      value: formatGrade(stats.bestGrade),
      icon: TrendingUp,
      tone: "text-green",
    },
    {
      label: "najniža",
      value: formatGrade(stats.worstGrade),
      icon: TrendingDown,
      tone: "text-danger",
    },
    {
      label: "ocena",
      value: String(stats.totalGrades),
      icon: ClipboardList,
      tone: "text-info",
    },
    {
      label: "najbolji",
      value: stats.bestSubjectName || "—",
      icon: Trophy,
      tone: "text-warn",
    },
  ];

  return (
    <section className="fig relative">
      <div className="fig-bar">
        <span className="fig-label whitespace-nowrap">fig. 01 — ukupan prosek</span>
        <span className="flex shrink-0 items-center gap-2 whitespace-nowrap font-mono text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden="true" />
          {isGuest ? "lokalno" : "live"}
          <span className="hidden text-line-strong sm:inline">/</span>
          <span className="hidden sm:inline">5 × 5</span>
        </span>
      </div>

      <div className="fig-well fig-grid">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">prosečna ocena</span>
              <span className="badge">{isGuest ? "gost" : "nalog"}</span>
              {isRefreshing ? <span className="badge badge-blue">sinhronizacija…</span> : null}
            </div>

            <div className="mt-4 flex items-end gap-2.5">
              <span
                className={cn(
                  "font-mono leading-[0.8] tracking-[-0.07em]",
                  hasGrades
                    ? "text-[4.75rem] text-fg sm:text-[6.25rem]"
                    : "text-[2.75rem] text-line-strong sm:text-[3.5rem]"
                )}
              >
                {hasGrades ? formatAverage(stats.overallAverage) : "—"}
              </span>
              <span className="mb-2 font-mono text-xs text-muted sm:mb-3 sm:text-sm">/ 5,00</span>
            </div>

            <p className="mt-4 max-w-md text-[13px] leading-6 text-muted">
              {hasGrades
                ? `${stats.gradedSubjects} ${stats.gradedSubjects === 1 ? "predmet" : "predmeta"} sa ocenama · ${gradeCountLabel(stats.totalGrades)}`
                : "Još nema ocena — dodaj prvu i prosek se računa automatski."}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <TrendBadge stats={stats} />
              <span className="badge">{stats.totalGrades} ocena</span>
              <span className="badge">{stats.gradedSubjects} predmeta</span>
            </div>
          </div>

          <DistributionChart distribution={stats.distribution} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {statItems.map((item) => (
            <div key={item.label} className="border border-line bg-surface p-3">
              <div className="flex items-center gap-1.5 font-mono text-[9.5px] text-muted">
                <item.icon className={cn("h-3 w-3", item.tone)} />
                {item.label}
              </div>
              <p
                className={cn(
                  "mt-2 truncate font-mono text-xl leading-none tracking-[-0.04em]",
                  item.value === "—" ? "text-muted" : "text-fg",
                  item.label === "najbolji" && "text-[13px] leading-5 tracking-normal"
                )}
                title={item.label === "najbolji" ? stats.bestSubjectName || undefined : undefined}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
