"use client";

import { AlertCircle, ArrowRight, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { apiErrorMessage } from "@/lib/api-client";
import { isEmailValid } from "@/lib/validation";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Unesi email i lozinku.");
      return;
    }

    if (!isEmailValid(normalizedEmail)) {
      setError("Email adresa nije ispravna.");
      return;
    }

    setLoading(true);

    try {
      const user = await login(normalizedEmail, password);
      toast({
        title: `Dobrodošao nazad${user.name ? `, ${user.name.split(" ")[0]}` : ""}!`,
        description: "Tvoji podaci su učitani.",
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
        <label htmlFor="login-email" className="label">
          Email adresa
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            id="login-email"
            type="email"
            className="input pl-10"
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
      </div>

      <div>
        <label htmlFor="login-password" className="label">
          Lozinka
        </label>
        <PasswordInput
          id="login-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (error) setError("");
          }}
          placeholder="Unesi lozinku"
          autoComplete="current-password"
          aria-invalid={Boolean(error)}
        />
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
        {loading ? <Spinner /> : <LogIn className="h-4 w-4" />}
        {loading ? "Prijavljujem…" : "Prijavi se"}
      </button>

      <p className="pt-1 text-center text-sm text-muted">
        Nemaš nalog?{" "}
        <Link href="/signup" className="link">
          Napravi ga besplatno
        </Link>
      </p>

      <div className="hairline" />

      <Link
        href="/"
        className="flex items-center justify-center gap-1.5 text-xs font-semibold text-muted transition hover:text-fg"
      >
        Nastavi kao gost
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </form>
  );
}
