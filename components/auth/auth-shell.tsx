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
    <main id="main-content" className="flex-1 px-4 py-10 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
        <aside className="relative hidden overflow-hidden rounded-[8px] border border-[color-mix(in_srgb,var(--yellow)_55%,var(--line))] bg-[var(--yellow-wash)] p-8 lg:flex lg:flex-col">
          <div className="fig-grid absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative">
            <span className="badge border-[color-mix(in_srgb,var(--yellow)_55%,var(--line))] bg-surface text-fg">
              <ShieldCheck className="h-3 w-3" />
              sigurno i besplatno
            </span>
            <h2 className="mt-6 font-mono text-4xl leading-[1.02] tracking-[-0.05em]">
              Tvoj prosek,
              <br />
              <span className="text-info">uvek pod kontrolom.</span>
            </h2>
            <p className="mt-4 max-w-sm text-[12px] leading-6 text-muted">
              Napravi nalog da sačuvaš predmete i ocene u oblaku. Tvoji podaci ostaju samo tvoji.
            </p>
          </div>

          <ul className="relative mt-10 space-y-4">
            {benefits.map((benefit, index) => (
              <li key={benefit.title} className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-line bg-surface text-fg">
                  <benefit.icon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="flex items-center gap-2 font-mono text-[9px] text-muted">
                    [{String(index + 1).padStart(2, "0")}]
                    <span className="text-[11px] font-medium text-fg">{benefit.title}</span>
                  </p>
                  <p className="mt-1 text-[10.5px] leading-5 text-muted">{benefit.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="relative mt-auto border border-line bg-surface p-4">
            <p className="fig-label">gost podaci</p>
            <p className="mt-2 text-[10.5px] leading-5 text-muted">
              Već imaš podatke iz gost režima? Nakon prijave možeš ih prebaciti na nalog jednim
              klikom.
            </p>
          </div>
        </aside>

        <section className="card flex flex-col p-6 sm:p-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[9.5px] text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-3 w-3" />
            nazad na prosek
          </Link>

          <p className="fig-label mt-7">{eyebrow}</p>
          <h1 className="mt-3 font-mono text-3xl tracking-[-0.05em] sm:text-4xl">{title}</h1>
          <p className="mt-2 text-[12px] leading-6 text-muted">{subtitle}</p>

          <div className="mt-7">{children}</div>

          <div className="mt-auto pt-8">
            <p className="border-t border-line pt-3 font-mono text-[9px] leading-5 text-muted">
              [ bez reklama · bez skrivenih troškova · tvoji podaci ostaju tvoji ]
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
