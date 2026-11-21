"use client";

import { BookOpenCheck, Plus, Sparkles } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { COMMON_SUBJECTS } from "@/lib/constants";

type EmptyStateProps = {
  existingNames: string[];
  isAdding: boolean;
  onAdd: (name: string) => Promise<boolean>;
};

const quickSubjects = COMMON_SUBJECTS.slice(0, 4);

export function EmptyState({ existingNames, isAdding, onAdd }: EmptyStateProps) {
  const normalized = new Set(existingNames.map((name) => name.trim().toLowerCase()));

  return (
    <section className="fig">
      <div className="fig-bar">
        <span className="fig-label">fig. 00 — prazan gradebook</span>
        <span className="font-mono text-[10px]">0 predmeta</span>
      </div>

      <div className="fig-well fig-grid p-6 text-center sm:p-10">
        <div className="relative mx-auto max-w-lg">
          <span className="animate-float mx-auto flex h-14 w-14 items-center justify-center rounded-[4px] border border-line bg-surface text-fg">
            <BookOpenCheck className="h-6 w-6" />
          </span>

          <h2 className="mt-5 font-mono text-2xl tracking-[-0.04em] sm:text-3xl">
            Počni prvim predmetom.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[12px] leading-6 text-muted">
            Unesi predmet, zatim klikni na <span className="font-medium text-fg">+</span> pored
            njega i dodaj ocenu. Prosek se računa automatski.
          </p>

          <div className="mt-6">
            <p className="eyebrow">brzi početak</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {quickSubjects.map((name) => {
                const exists = normalized.has(name.toLowerCase());
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => void onAdd(name)}
                    disabled={isAdding || exists}
                    className="chip min-h-8 px-2.5 disabled:opacity-45"
                  >
                    {isAdding ? <Spinner className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    {name}
                    {exists ? " ✓" : ""}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7 grid gap-2 text-left sm:grid-cols-3">
            {[
              { step: "01", text: "Dodaj predmete koje pohađaš." },
              { step: "02", text: "Unosi ocene čim ih dobiješ." },
              { step: "03", text: "Prati prosek i napredak." },
            ].map((item) => (
              <div key={item.step} className="border border-line bg-surface p-3">
                <span className="font-mono text-[9px] text-muted">[{item.step}]</span>
                <p className="mt-1.5 text-[10.5px] leading-5 text-muted">{item.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 inline-flex items-center gap-1.5 font-mono text-[9.5px] text-muted">
            <Sparkles className="h-3 w-3 text-accent-strong" />
            gost režim radi odmah — bez naloga
          </p>
        </div>
      </div>
    </section>
  );
}
