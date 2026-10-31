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
    <section className="card p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
          <Target className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-extrabold">Simulator cilja</h2>
          <p className="mt-0.5 text-xs leading-5 text-muted">
            Izaberi željeni prosek i vidi šta ti treba do kraja.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-surface-2 p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Ciljni prosek</p>
            <p className="gradient-text text-3xl font-extrabold tracking-tight">
              {formatAverage(target)}
            </p>
          </div>
          <div className="flex gap-1.5">
            {[4, 4.5, 5].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTarget(preset)}
                className={cn(
                  "rounded-full border px-2 py-1 text-[10px] font-bold transition",
                  Math.abs(target - preset) < 0.001
                    ? "border-accent bg-accent-soft text-accent-strong"
                    : "border-line bg-surface-2 text-muted hover:border-line-strong hover:text-fg"
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
          className="mt-3 w-full cursor-pointer"
          style={{ accentColor: "var(--accent)" }}
          aria-label="Ciljni prosek"
        />
        <div className="flex justify-between text-[10px] font-semibold text-muted">
          <span>1,00</span>
          <span>5,00</span>
        </div>
      </div>

      {plan.ungradedSubjects === 0 && plan.gradedSubjects > 0 ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface-2 p-3">
          <div>
            <p className="text-xs font-bold">Dodatnih predmeta</p>
            <p className="text-[10px] text-muted">Simuliraj buduće predmete</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExtraSubjects((value) => Math.max(1, value - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition hover:bg-surface-3 hover:text-fg"
              aria-label="Manje dodatnih predmeta"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-extrabold">{extraSubjects}</span>
            <button
              type="button"
              onClick={() => setExtraSubjects((value) => Math.min(10, value + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition hover:bg-surface-3 hover:text-fg"
              aria-label="Više dodatnih predmeta"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : plan.ungradedSubjects > 0 ? (
        <div className="mt-3 rounded-2xl border border-line bg-surface-2 p-3">
          <p className="text-xs font-bold">
            {plan.ungradedSubjects} {plan.ungradedSubjects === 1 ? "predmet bez ocena" : "predmeta bez ocena"}
          </p>
          <p className="text-[10px] text-muted">Automatski ulaze u proračun cilja.</p>
        </div>
      ) : null}

      <div className="mt-3 rounded-2xl border border-line bg-surface-2 p-4">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">{result.title}</p>
            <p
              className={cn(
                "mt-1 text-3xl font-extrabold tracking-tight",
                result.tone === "accent" && "gradient-text",
                result.tone === "danger" && "text-danger",
                result.tone === "muted" && "text-muted"
              )}
            >
              {result.value}
            </p>
          </div>
          <span className="text-[10px] font-semibold text-muted">
            trenutno {formatAverage(plan.currentAverage)}
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-muted">{result.text}</p>
      </div>

      <details className="group mt-3">
        <summary className="cursor-pointer list-none text-[11px] font-semibold text-muted transition hover:text-fg">
          Kako se računa?
        </summary>
        <p className="mt-2 rounded-xl border border-line bg-surface-2 p-3 text-[11px] leading-5 text-muted">
          Ukupan prosek je prosek proseka svih predmeta sa ocenama. Predmeti bez ocena ne ulaze
          u trenutni prosek, ali ulaze u simulaciju cilja.
        </p>
      </details>
    </section>
  );
}
