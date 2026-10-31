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
    <section className="card relative overflow-hidden p-6 text-center sm:p-8">
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full opacity-60 blur-3xl"
        style={{ background: "var(--glow-1)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-md">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-accent-soft text-accent-strong">
          <BookOpenCheck className="h-7 w-7" />
        </span>

        <h2 className="mt-4 text-xl font-extrabold tracking-tight sm:text-2xl">
          Počni tako što ćeš dodati prvi predmet
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
          Unesi predmet, zatim klikni na <span className="font-semibold text-fg">+</span> pored
          njega i dodaj ocenu. Prosek se računa automatski.
        </p>

        <div className="mt-5">
          <p className="eyebrow">Brzi početak</p>
          <div className="mt-2.5 flex flex-wrap justify-center gap-2">
            {quickSubjects.map((name) => {
              const exists = normalized.has(name.toLowerCase());
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => void onAdd(name)}
                  disabled={isAdding || exists}
                  className="chip min-h-9 px-3 transition hover:border-accent/50 hover:text-fg disabled:opacity-45"
                >
                  {isAdding ? <Spinner className="h-3 w-3" /> : <Plus className="h-3.5 w-3.5" />}
                  {name}
                  {exists ? " ✓" : ""}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-2 text-left sm:grid-cols-3">
          {[
            { step: "1", text: "Dodaj predmete koje pohađaš." },
            { step: "2", text: "Unosi ocene čim ih dobiješ." },
            { step: "3", text: "Prati prosek i napredak." },
          ].map((item) => (
            <div key={item.step} className="rounded-2xl border border-line bg-surface-2 p-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-[11px] font-extrabold text-accent-strong">
                {item.step}
              </span>
              <p className="mt-2 text-[11px] font-medium leading-5 text-muted">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted">
          <Sparkles className="h-3.5 w-3.5 text-accent-strong" />
          Ne treba ti nalog da bi probao — gost režim radi odmah.
        </p>
      </div>
    </section>
  );
}
