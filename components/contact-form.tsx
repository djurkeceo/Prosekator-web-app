"use client";

import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { CONTACT_EMAIL } from "@/lib/constants";
import { isEmailValid } from "@/lib/validation";

export function ContactForm() {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSent(false);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2) {
      setError("Unesi svoje ime (bar 2 karaktera).");
      return;
    }

    if (!isEmailValid(trimmedEmail)) {
      setError("Unesi ispravnu email adresu da bismo mogli da odgovorimo.");
      return;
    }

    if (trimmedMessage.length < 10) {
      setError("Poruka treba da ima bar 10 karaktera.");
      return;
    }

    const subject = encodeURIComponent(`Prosekator — poruka od ${trimmedName}`);
    const body = encodeURIComponent(
      `Ime: ${trimmedName}\nEmail: ${trimmedEmail}\n\n${trimmedMessage}`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
    toast({
      title: "Otvara se email aplikacija",
      description: "Pošalji poruku iz svoje email aplikacije — sadržaj je već popunjen.",
      variant: "success",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="label">
            Ime i prezime
          </label>
          <input
            id="contact-name"
            className="input"
            placeholder="Tvoje ime"
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
          <label htmlFor="contact-email" className="label">
            Email adresa
          </label>
          <input
            id="contact-email"
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
      </div>

      <div>
        <label htmlFor="contact-message" className="label">
          Poruka
        </label>
        <textarea
          id="contact-message"
          className="input min-h-36 resize-y"
          placeholder="Pitanje, predlog ili prijava greške…"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            if (error) setError("");
          }}
          maxLength={2000}
          rows={6}
          aria-invalid={Boolean(error)}
        />
        <p className="mt-1.5 text-right text-[10px] text-muted">{message.length}/2000</p>
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

      {sent && !error ? (
        <p className="flex items-start gap-2 rounded-xl border border-accent/30 bg-accent-soft px-3 py-2.5 text-xs font-semibold leading-5 text-fg">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
          Ako se email aplikacija nije otvorila, pošalji poruku direktno na{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="link">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary w-full sm:w-auto">
        <Send className="h-4 w-4" />
        Pošalji poruku
      </button>

      <p className="text-[11px] leading-5 text-muted">
        Poruka se šalje iz tvoje email aplikacije. Ne čuvamo podatke iz ove forme na serveru.
      </p>
    </form>
  );
}
