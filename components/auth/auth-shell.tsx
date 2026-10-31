import { ArrowLeft, BookOpenCheck, CloudCheck, ShieldCheck, Target } from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    icon: BookOpenCheck,
    title: "Prosek bez digitrona",
    text: "Ocene po predmetima, prosek predmeta i ukupan prosek — sve automatski.",
  },
  {
    icon: Target,
    title: "Simulator cilja",
    text: "Vidi koja ocena ti treba na preostalim predmetima za željeni prosek.",
  },
  {
    icon: CloudCheck,
    title: "Sačuvano u oblaku",
    text: "Prijavi se na bilo kom uređaju i nastavi tačno tamo gde si stao.",
  },
];

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main-content" className="flex-1 px-3 py-6 sm:px-4 sm:py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <aside className="card relative hidden overflow-hidden p-8 lg:flex lg:flex-col">
          <div
            className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full opacity-70 blur-3xl"
            style={{ background: "var(--glow-1)" }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full opacity-60 blur-3xl"
            style={{ background: "var(--glow-2)" }}
            aria-hidden="true"
          />

          <div className="relative">
            <span className="badge bg-accent-soft text-accent-strong">
              <ShieldCheck className="h-3.5 w-3.5" />
              Sigurno i besplatno
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight">
              Tvoj prosek,
              <br />
              <span className="gradient-text">uvek pod kontrolom.</span>
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
              Napravi nalog da sačuvaš predmete i ocene u oblaku. Tvoji podaci ostaju samo tvoji.
            </p>
          </div>

          <ul className="relative mt-10 space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit.title} className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-accent-strong">
                  <benefit.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold">{benefit.title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted">{benefit.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="relative mt-auto rounded-2xl border border-line bg-surface-2 p-4">
            <p className="text-[11px] leading-5 text-muted">
              Već imaš podatke iz gost režima? Nakon prijave možeš ih prebaciti na nalog jednim
              klikom.
            </p>
          </div>
        </aside>

        <section className="card p-5 sm:p-7 lg:p-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition hover:text-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Nazad na prosek
          </Link>

          <p className="eyebrow mt-5">{eyebrow}</p>
          <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>

          <div className="mt-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
