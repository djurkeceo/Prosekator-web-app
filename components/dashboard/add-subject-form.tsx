"use client";

import { BookPlus, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { COMMON_SUBJECTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type AddSubjectFormProps = {
  existingNames: string[];
  isAdding: boolean;
  onAdd: (name: string) => Promise<boolean>;
};

export function AddSubjectForm({ existingNames, isAdding, onAdd }: AddSubjectFormProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmed = name.trim();

    if (!trimmed) {
      setError("Unesi naziv predmeta.");
      inputRef.current?.focus();
      return;
    }

    if (trimmed.length > 60) {
      setError("Naziv može imati najviše 60 karaktera.");
      return;
    }

    if (existingNames.some((item) => item.trim().toLowerCase() === trimmed.toLowerCase())) {
      setError("Predmet sa tim nazivom već postoji.");
      return;
    }

    const success = await onAdd(trimmed);

    if (success) {
      setName("");
      setError("");
      inputRef.current?.focus();
    }
  };

  return (
    <section className="card p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
          <BookPlus className="h-4.5 w-4.5" />
        </span>
        <div>
          <h2 className="text-sm font-extrabold">Dodaj predmet</h2>
          <p className="text-xs text-muted">Predmet se odmah pojavljuje u listi ispod.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="min-w-0 flex-1">
          <label htmlFor="subject-name" className="sr-only">
            Naziv predmeta
          </label>
          <input
            ref={inputRef}
            id="subject-name"
            list="common-subjects"
            className="input"
            placeholder="Npr. Matematika"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError("");
            }}
            maxLength={60}
            autoComplete="off"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "subject-name-error" : undefined}
          />
          <datalist id="common-subjects">
            {COMMON_SUBJECTS.map((subject) => (
              <option key={subject} value={subject} />
            ))}
          </datalist>
          {error ? (
            <p id="subject-name-error" className="mt-1.5 text-xs font-semibold text-danger" role="alert">
              {error}
            </p>
          ) : (
            <p className="mt-1.5 hidden text-[11px] text-muted sm:block">
              Pritisni Enter za brzo dodavanje.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isAdding}
          className={cn("btn btn-primary shrink-0 sm:self-start", isAdding && "opacity-80")}
        >
          {isAdding ? <Spinner /> : <Plus className="h-4 w-4" />}
          {isAdding ? "Dodajem…" : "Dodaj predmet"}
        </button>
      </form>
    </section>
  );
}
