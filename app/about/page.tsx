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

const exampleSubjects = [
  { name: "Matematika", grade: "5", value: 94, color: "#2B2BFF" },
  { name: "Srpski jezik", grade: "4", value: 76, color: "#1F9D6B" },
  { name: "Engleski jezik", grade: "5", value: 88, color: "#7C5CFF" },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="premium-page-enter flex-1 px-4 py-10 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[1280px] space-y-16">
        <section className="premium-section-enter hero-fade relative overflow-hidden">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="fig-label">o aplikaciji</p>
              <h1 className="mt-5 font-mono text-4xl leading-[1.02] tracking-[-0.05em] text-fg sm:text-5xl lg:text-6xl">
                Manje računanja.
                <br />
                <span className="text-info">Više kontrole.</span>
              </h1>
              <p className="mt-5 max-w-xl text-[13px] leading-7 text-muted sm:text-sm">
                Prosekator je napravljen da zameni digitron, svesku i ručno sabiranje. Na jednom
                mestu vidiš sve predmete, sve ocene i tačan prosek — a ako želiš, i šta ti treba do
                kraja polugodišta.
              </p>

              <div className="mt-7 flex flex-col gap-2 sm:flex-row">
                <Link href="/" className="btn btn-primary">
                  Otvori prosek
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/signup" className="btn btn-secondary">
                  Napravi besplatan nalog
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="badge">besplatno</span>
                <span className="badge">bez reklama</span>
                <span className="badge">offline</span>
                <span className="badge">gost režim</span>
              </div>
            </div>

            <div className="fig">
              <div className="fig-bar">
                <span className="fig-label">fig. 01 — primer proseka</span>
                <span className="font-mono text-[10px]">5 × 5 · live</span>
              </div>
              <div className="fig-well fig-grid p-5 sm:p-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow">ukupan prosek</p>
                    <p className="mt-2 font-mono text-6xl leading-none tracking-[-0.06em]">
                      4,67
                      <span className="ml-2 font-mono text-sm text-muted">/ 5,00</span>
                    </p>
                  </div>
                  <span className="badge badge-green">+0,12</span>
                </div>

                <div className="mt-6 space-y-3">
                  {exampleSubjects.map((subject) => (
                    <div key={subject.name}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-medium">{subject.name}</span>
                        <span className="font-mono text-[9px] text-muted">{subject.grade}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 bg-surface-3">
                        <div
                          className="h-full"
                          style={{ width: `${subject.value}%`, backgroundColor: subject.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-line pt-3 font-mono text-[9px] text-muted">
                  <span>[ prosek zaključnih ocena ]</span>
                  <span>auto</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="fig-label">mogućnosti</p>
              <h2 className="mt-3 font-mono text-3xl tracking-[-0.04em] sm:text-4xl">
                Sve što ti treba za prosek.
              </h2>
            </div>
            <p className="max-w-sm text-[12px] leading-6 text-muted">
              Bez tabela, formula i ručnog sabiranja. Sve što uneseš odmah utiče na prosek i
              statistiku.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="premium-card card p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-line bg-accent-soft text-yellow-fg">
                    <feature.icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[9px] text-muted">
                    [{String(index + 1).padStart(2, "0")}]
                  </span>
                </div>
                <h3 className="mt-4 font-mono text-[15px] font-medium">{feature.title}</h3>
                <p className="mt-2 text-[11px] leading-6 text-muted">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="fig-label">kako radi</p>
            <h2 className="mt-3 font-mono text-3xl tracking-[-0.04em] sm:text-4xl">
              Tri koraka do jasnog proseka.
            </h2>
            <p className="mt-3 max-w-md text-[12px] leading-6 text-muted">
              Ne treba ti tutorijal. Aplikacija je napravljena da je razumeš odmah, i na telefonu
              i na računaru.
            </p>

            <div className="mt-6 space-y-2">
              {steps.map((step, index) => (
                <div key={step.title} className="premium-interactive flex gap-3 border border-line bg-surface p-4">
                  <span className="font-mono text-[9px] text-muted">
                    [{String(index + 1).padStart(2, "0")}]
                  </span>
                  <div>
                    <p className="font-mono text-[12px] font-medium">{step.title}</p>
                    <p className="mt-1 text-[10.5px] leading-5 text-muted">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="fig">
            <div className="fig-bar">
              <span className="fig-label">fig. 02 — obračun</span>
              <span className="font-mono text-[10px]">auto</span>
            </div>
            <div className="fig-well fig-grid p-5 sm:p-6">
              <div className="border border-line bg-surface p-4 font-mono text-[10.5px] leading-6">
                <p className="text-muted">// prosekator ~ obračun</p>
                <p className="mt-2">
                  <span className="text-info">matematika</span>{" "}
                  <span className="text-muted">→</span> 5, 5, 4{" "}
                  <span className="text-muted">→</span> <span className="text-green">4,67</span>
                </p>
                <p>
                  <span className="text-info">srpski</span>{" "}
                  <span className="text-muted">→</span> 4, 5, 4{" "}
                  <span className="text-muted">→</span> <span className="text-green">4,33</span>
                </p>
                <p>
                  <span className="text-info">engleski</span>{" "}
                  <span className="text-muted">→</span> 5, 5, 5{" "}
                  <span className="text-muted">→</span> <span className="text-green">5,00</span>
                </p>
                <div className="mt-3 border-t border-line pt-3">
                  <span className="text-muted">ukupno</span>{" "}
                  <span className="text-fg">4,67</span>{" "}
                  <span className="text-muted">/ 5,00</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: "predmeta", value: "3" },
                  { label: "ocena", value: "9" },
                  { label: "trend", value: "+0,12" },
                ].map((item) => (
                  <div key={item.label} className="border border-line bg-surface p-3">
                    <p className="font-mono text-[9px] text-muted">{item.label}</p>
                    <p className="mt-1 font-mono text-lg leading-none">{item.value}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[10px] leading-5 text-muted">
                Ukupan prosek je prosek zaključnih ocena predmeta sa ocenama, gde je zaključna
                ocena prosek predmeta zaokružen na ceo broj. Predmeti bez ocena ne ulaze u
                trenutni prosek.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-2">
          <div className="premium-card card p-6">
            <p className="fig-label">privatnost</p>
            <span className="mt-4 flex h-9 w-9 items-center justify-center rounded-[4px] border border-line bg-accent-soft text-yellow-fg">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <h2 className="mt-4 font-mono text-2xl tracking-[-0.04em]">
              Tvoji podaci, tvoja kontrola.
            </h2>
            <p className="mt-2 text-[12px] leading-6 text-muted">
              Nema reklama i nema prodaje podataka. Lozinke se čuvaju heširane, a nalog i sve
              ocene možeš trajno obrisati iz podešavanja naloga u svakom trenutku.
            </p>
          </div>

          <div className="premium-card card p-6">
            <p className="fig-label">offline</p>
            <span className="mt-4 flex h-9 w-9 items-center justify-center rounded-[4px] border border-line bg-blue-wash text-info">
              <Download className="h-4 w-4" />
            </span>
            <h2 className="mt-4 font-mono text-2xl tracking-[-0.04em]">Radi i bez interneta.</h2>
            <p className="mt-2 text-[12px] leading-6 text-muted">
              Prosekator se može dodati na početni ekran telefona kao aplikacija. Gost režim i
              poslednji učitani podaci ostaju dostupni i kada nema veze.
            </p>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[8px] border border-fg bg-fg p-6 text-canvas sm:p-10">
          <div className="fig-grid absolute inset-0 opacity-10" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[9.5px] text-canvas/60">[ spreman? ]</p>
              <h2 className="mt-2 font-mono text-3xl tracking-[-0.04em] sm:text-4xl">
                Spreman da vidiš svoj prosek?
              </h2>
              <p className="mt-2 text-[12px] text-canvas/70">
                Počni odmah kao gost ili napravi nalog da sačuvaš podatke u oblaku.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Link href="/" className="btn btn-accent">
                Otvori prosek
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/login" className="btn btn-on-dark">
                Prijavi se
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
