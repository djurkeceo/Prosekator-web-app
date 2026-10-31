import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  ChartPie,
  CloudCheck,
  Download,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";

export const metadata: Metadata = {
  title: "O aplikaciji",
  description:
    "Prosekator je besplatna aplikacija za praćenje školskog proseka i ocena. Automatski prosek, statistika, simulator cilja, gost režim i rad offline.",
  alternates: { canonical: "/about" },
};

const features = [
  {
    icon: Calculator,
    title: "Prosek u sekundi",
    text: "Prosek svakog predmeta i ukupan školski prosek računaju se automatski pri svakoj izmeni.",
  },
  {
    icon: BookOpenCheck,
    title: "Predmeti i ocene",
    text: "Dodaj predmete, unosi ocene sa opisom i datumom, menjaj ih ili briši u par klikova.",
  },
  {
    icon: ChartPie,
    title: "Statistika i trend",
    text: "Raspodela ocena, najbolji predmet i trend napretka — jasno, bez tabela i formula.",
  },
  {
    icon: Target,
    title: "Simulator cilja",
    text: "Izaberi željeni prosek i saznaj koja ocena ti treba na preostalim predmetima.",
  },
  {
    icon: UserRound,
    title: "Gost režim",
    text: "Probaj sve bez registracije. Podaci ostaju na uređaju, a kasnije ih prebaciš na nalog.",
  },
  {
    icon: CloudCheck,
    title: "Nalog u oblaku",
    text: "Prijavi se i pristupi istim predmetima i ocenama sa telefona, tableta i računara.",
  },
];

const steps = [
  {
    title: "Dodaj predmete",
    text: "Unesi predmete koje pohađaš. Možeš koristiti predloge ili dodati svoje nazive.",
  },
  {
    title: "Unesi ocene",
    text: "Klikni na plus pored predmeta i dodaj ocenu. Opis i datum pomažu da znaš odakle dolazi.",
  },
  {
    title: "Prati prosek",
    text: "Prosek, statistika i simulator cilja ažuriraju se odmah — na svakom uređaju.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="flex-1 px-3 py-6 sm:px-4 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <section className="card relative overflow-hidden p-6 sm:p-10">
          <div
            className="animate-float pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full opacity-70 blur-3xl"
            style={{ background: "var(--glow-1)" }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full opacity-60 blur-3xl"
            style={{ background: "var(--glow-2)" }}
            aria-hidden="true"
          />

          <div className="relative max-w-3xl">
            <span className="badge bg-accent-soft text-accent-strong">
              <Sparkles className="h-3.5 w-3.5" />
              O aplikaciji
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Manje računanja.
              <br />
              <span className="gradient-text">Više kontrole nad uspehom.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              Prosekator je napravljen da zameni digitron, svesku i ručno sabiranje. Na jednom
              mestu vidiš sve predmete, sve ocene i tačan prosek — a ako želiš, i šta ti treba do
              kraja polugodišta.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link href="/" className="btn btn-primary">
                Otvori prosek
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/signup" className="btn btn-secondary">
                Napravi besplatan nalog
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="features-heading">
          <div className="mb-3 flex items-end justify-between gap-3 px-1">
            <div>
              <p className="eyebrow">Šta sve možeš</p>
              <h2 id="features-heading" className="mt-1 text-xl font-extrabold sm:text-2xl">
                Sve što ti treba za školski prosek
              </h2>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="card p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-extrabold">{feature.title}</h3>
                <p className="mt-1.5 text-xs leading-6 text-muted">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow">Kako radi</p>
              <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">Tri koraka do jasnog proseka</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                Ne treba ti tutorijal. Aplikacija je napravljena da je razumeš odmah, i na telefonu
                i na računaru.
              </p>

              <div className="mt-5 space-y-3">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex gap-3 rounded-2xl border border-line bg-surface-2 p-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-extrabold text-accent-fg">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold">{step.title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-muted">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-surface-2 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Primer</p>
                  <p className="mt-1 text-sm font-bold">Ukupan prosek</p>
                </div>
                <span className="badge bg-accent-soft text-accent-strong">automatski</span>
              </div>

              <div className="mt-4 flex items-end gap-2">
                <span className="gradient-text text-6xl font-extrabold leading-none tracking-tighter">
                  4,67
                </span>
                <span className="mb-2 text-sm font-semibold text-muted">/ 5,00</span>
              </div>

              <div className="mt-5 space-y-2">
                {[
                  { name: "Matematika", grade: "5", value: 94 },
                  { name: "Srpski jezik", grade: "4", value: 76 },
                  { name: "Engleski jezik", grade: "5", value: 88 },
                ].map((subject) => (
                  <div key={subject.name} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 truncate text-xs font-semibold text-muted">
                      {subject.name}
                    </span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
                      <span
                        className="block h-full rounded-full bg-accent"
                        style={{ width: `${subject.value}%` }}
                      />
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-xs font-extrabold text-accent-strong">
                      {subject.grade}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[11px] leading-5 text-muted">
                Ukupan prosek je prosek proseka predmeta sa ocenama. Predmeti bez ocena ne ulaze u
                trenutni prosek.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-3 lg:grid-cols-2">
          <section className="card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h2 className="mt-3 text-lg font-extrabold">Tvoji podaci, tvoja kontrola</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Nema reklama i nema prodaje podataka. Lozinke se čuvaju heširane, a nalog i sve
              ocene možeš trajno obrisati iz podešavanja naloga u svakom trenutku.
            </p>
          </section>

          <section className="card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--info)_16%,transparent)] text-info">
              <Download className="h-5 w-5" />
            </span>
            <h2 className="mt-3 text-lg font-extrabold">Radi i bez interneta</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Prosekator se može dodati na početni ekran telefona kao aplikacija. Gost režim i
              poslednji učitani podaci ostaju dostupni i kada nema veze.
            </p>
          </section>
        </div>

        <section className="card flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">Spreman da vidiš svoj prosek?</h2>
            <p className="mt-1.5 text-sm text-muted">
              Počni odmah kao gost ili napravi nalog da sačuvaš podatke u oblaku.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
            <Link href="/login" className="btn btn-secondary">
              Prijavi se
            </Link>
            <Link href="/" className="btn btn-primary">
              Otvori prosek
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
