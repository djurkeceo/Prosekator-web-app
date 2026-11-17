"use client";

import { Minus, Plus, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { formatAverage, getGoalPlan } from "@/lib/calculations";
import type { Subject } from "@/lib/types";
import { cn } from "@/lib/utils";

export function GoalSimulator({ subjects }: { subjects: Subject[] }) {
  const [target, setTarget] = useState(4.5);
  const [extraSubjects, setExtraSubjects] = useState(1);

  const plan = useMemo(
    () => getGoalPlan(subjects, target, extraSubjects),
    [extraSubjects, subjects, target]
  );

  const required = plan.requiredAverage;

  const result = (() => {
    if (plan.status === "empty") {
      return {
        value: "—",
        title: "Dodaj predmete",
        text: "Simulator radi kada u listi imaš bar jedan predmet.",
        tone: "muted" as const,
      };
    }

    if (plan.status === "no-grades") {
      return {
        value: formatAverage(plan.target),
        title: "Potreban prosek na svim predmetima",
        text: "Još nema unetih ocena, pa je cilj isti na svakom predmetu.",
        tone: "accent" as const,
      };
    }

    if (plan.status === "impossible") {
      return {
        value: formatAverage(plan.maxPossibleAverage),
        title: "Cilj trenutno nije dostižan",
        text: "Čak i sve petice na preostalim predmetima daju najviše ovaj prosek.",
        tone: "danger" as const,
      };
    }

    if (plan.status === "secured") {
      return {
        value: "✓",
        title: "Cilj je već osiguran",
        text: "Trenutni prosek je dovoljno visok za izabrani cilj.",
        tone: "accent" as const,
      };
    }

    if (plan.currentAverage >= plan.target) {
      return {
        value: formatAverage(required),
        title: "Već si iznad cilja",
        text: "Ovo je prosečna ocena koja ti treba na preostalim predmetima da ostaneš iznad cilja.",
        tone: "accent" as const,
      };
    }

    return {
      value: formatAverage(required),
      title: "Potreban prosek na preostalim predmetima",
      text: `${plan.remainingSubjects} ${plan.remainingSubjects === 1 ? "predmet" : "predmeta"} još utiče na ukupan prosek.`,
      tone: "accent" as const,
    };
  })();

  return (
    <section className="fig">
      <div className="fig-bar">
        <span className="fig-label">fig. 02 — simulator cilja</span>
        <span className="font-mono text-[10px]">target</span>
      </div>

      <div className="p-4">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">ciljni prosek</p>
            <p className="mt-1.5 font-mono text-3xl leading-none tracking-[-0.04em] text-fg">
              {formatAverage(target)}
            </p>
          </div>
          <div className="flex shrink-0 gap-1.5">
            {[4, 4.5, 5].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTarget(preset)}
                className={cn(
                  "rounded-[2px] border px-2 py-1 font-mono text-[9.5px] transition",
                  Math.abs(target - preset) < 0.001
                    ? "border-fg bg-fg text-canvas"
                    : "border-line bg-surface text-muted hover:border-fg hover:text-fg"
                )}
              >
                {formatAverage(preset)}
              </button>
            ))}
          </div>
        </div>

        <input
          type="range"
          min={1}
          max={5}
          step={0.05}
          value={target}
          onChange={(event) => setTarget(Number(event.target.value))}
          className="mt-4 w-full"
          aria-label="Ciljni prosek"
        />
        <div className="flex justify-between font-mono text-[9px] text-muted">
          <span>1,00</span>
          <span>5,00</span>
        </div>

        {plan.ungradedSubjects === 0 && plan.gradedSubjects > 0 ? (
          <div className="mt-4 flex items-center justify-between gap-3 border border-line bg-surface p-3">
            <div>
              <p className="eyebrow">dodatnih predmeta</p>
              <p className="mt-0.5 font-mono text-[9px] text-muted">simuliraj buduće predmete</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExtraSubjects((value) => Math.max(1, value - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-line bg-surface text-fg transition hover:border-fg hover:bg-surface-2"
                aria-label="Manje dodatnih predmeta"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-5 text-center font-mono text-[12px]">{extraSubjects}</span>
              <button
                type="button"
                onClick={() => setExtraSubjects((value) => Math.min(10, value + 1))}
                className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-line bg-surface text-fg transition hover:border-fg hover:bg-surface-2"
                aria-label="Više dodatnih predmeta"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        ) : plan.ungradedSubjects > 0 ? (
          <div className="mt-4 border border-line bg-surface p-3">
            <p className="eyebrow">
              {plan.ungradedSubjects} {plan.ungradedSubjects === 1 ? "predmet bez ocena" : "predmeta bez ocena"}
            </p>
            <p className="mt-1 font-mono text-[9px] text-muted">automatski ulaze u proračun cilja</p>
          </div>
        ) : null}

        <div className="mt-4 border border-line bg-surface p-4">
          <p className="eyebrow">{result.title}</p>
          <p
            className={cn(
              "mt-1.5 font-mono text-3xl leading-none tracking-[-0.04em]",
              result.tone === "accent" && "text-accent-strong",
              result.tone === "danger" && "text-danger",
              result.tone === "muted" && "text-muted"
            )}
          >
            {result.value}
          </p>
          <p className="mt-2.5 text-[11px] leading-5 text-muted">{result.text}</p>
          <div className="mt-3 flex items-center justify-between border-t border-line pt-2 font-mono text-[9px] text-muted">
            <span>trenutno {formatAverage(plan.currentAverage)}</span>
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3 text-accent-strong" />
              cilj {formatAverage(plan.target)}
            </span>
          </div>
        </div>

        <details className="group mt-3">
          <summary className="cursor-pointer list-none font-mono text-[9.5px] text-muted transition hover:text-fg">
            [ kako se računa? ]
          </summary>
          <p className="mt-2 border border-line bg-surface p-3 text-[10.5px] leading-5 text-muted">
            Ukupan prosek je prosek zaključnih ocena svih predmeta sa ocenama, gde je zaključna
            ocena prosek predmeta zaokružen na ceo broj. Predmeti bez ocena ne ulaze u trenutni
            prosek, ali ulaze u simulaciju cilja.
          </p>
        </details>
      </div>
    </section>
  );
}
