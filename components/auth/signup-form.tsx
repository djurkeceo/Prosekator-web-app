"use client";

import { AlertCircle, Check, Sparkles, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { apiErrorMessage } from "@/lib/api-client";
import {
  PASSWORD_REQUIREMENTS,
  getPasswordIssues,
  getPasswordScore,
  isEmailValid,
  isValidPersonName,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

const strengthLabels = ["Preslaba", "Slaba", "Dobra", "Vrlo dobra", "Odlična"];

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const score = getPasswordScore(password);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!isValidPersonName(name)) {
      setError("Ime mora imati između 2 i 60 karaktera.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isEmailValid(normalizedEmail)) {
      setError("Email adresa nije ispravna.");
      return;
    }

    const issues = getPasswordIssues(password);

    if (issues.length) {
      setError(`Lozinka još nije dovoljno jaka: ${issues.join(", ").toLowerCase()}.`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Lozinke se ne poklapaju.");
      return;
    }

    setLoading(true);

    try {
      const user = await signup(name.trim(), normalizedEmail, password);
      toast({
        title: `Dobrodošao, ${user.name.split(" ")[0]}!`,
        description: "Nalog je napravljen. Dodaj prvi predmet i počni da pratiš prosek.",
        variant: "success",
      });
      router.replace("/");
      router.refresh();
    } catch (submitError) {
      setError(apiErrorMessage(submitError));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="signup-name" className="label">
          Ime i prezime
        </label>
        <input
          id="signup-name"
          className="input"
          placeholder="Npr. Ana Petrović"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) setError("");
          }}
          autoComplete="name"
          maxLength={60}
          aria-invalid={Boolean(error)}
        />
      </div>

      <div>
        <label htmlFor="signup-email" className="label">
          Email adresa
        </label>
        <input
          id="signup-email"
          type="email"
          className="input"
          placeholder="ime@primer.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError("");
          }}
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={Boolean(error)}
        />
      </div>

      <div>
        <label htmlFor="signup-password" className="label">
          Lozinka
        </label>
        <PasswordInput
          id="signup-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (error) setError("");
          }}
          placeholder="Najmanje 8 karaktera"
          autoComplete="new-password"
        />

        <div className="mt-2">
          <div className="flex gap-1" aria-hidden="true">
            {[0, 1, 2, 3].map((segment) => (
              <span
                key={segment}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition",
                  score > segment
                    ? score >= 3
                      ? "bg-accent"
                      : score === 2
                        ? "bg-warn"
                        : "bg-danger"
                    : "bg-surface-3"
                )}
              />
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                !password && "text-muted",
                password && score >= 3 && "text-accent-strong",
                password && score === 2 && "text-warn",
                password && score < 2 && "text-danger"
              )}
            >
              {password ? strengthLabels[score] : "Jačina lozinke"}
            </span>
            <span className="text-[10px] text-muted">{password.length}/8</span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
          {PASSWORD_REQUIREMENTS.map((requirement) => {
            const passed = requirement.test(password);
            return (
              <span
                key={requirement.id}
                className={cn(
                  "inline-flex items-center gap-1.5 text-[11px] font-semibold",
                  passed ? "text-accent-strong" : "text-muted"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border",
                    passed ? "border-accent bg-accent-soft" : "border-line"
                  )}
                >
                  {passed ? <Check className="h-2.5 w-2.5" /> : null}
                </span>
                {requirement.label}
              </span>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="signup-confirm-password" className="label">
          Potvrdi lozinku
        </label>
        <PasswordInput
          id="signup-confirm-password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            if (error) setError("");
          }}
          placeholder="Ponovi lozinku"
          autoComplete="new-password"
          aria-invalid={Boolean(confirmPassword && password !== confirmPassword)}
        />
        {confirmPassword && password !== confirmPassword ? (
          <p className="mt-1.5 text-[11px] font-semibold text-danger">Lozinke se ne poklapaju.</p>
        ) : null}
      </div>

      {error ? (
        <p
          className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger-soft px-3 py-2.5 text-xs font-semibold leading-5 text-danger"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? <Spinner /> : <UserPlus className="h-4 w-4" />}
        {loading ? "Pravim nalog…" : "Napravi nalog"}
      </button>

      <p className="text-center text-[11px] leading-5 text-muted">
        Podaci se čuvaju bezbedno i koriste se isključivo za tvoj prosek. Nalog možeš obrisati u
        svakom trenutku.
      </p>

      <div className="hairline" />

      <p className="text-center text-sm text-muted">
        Već imaš nalog?{" "}
        <Link href="/login" className="link">
          Prijavi se
        </Link>
      </p>

      <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted">
        <Sparkles className="h-3.5 w-3.5 text-accent-strong" />
        Gost režim i dalje radi bez naloga
      </p>
    </form>
  );
}
