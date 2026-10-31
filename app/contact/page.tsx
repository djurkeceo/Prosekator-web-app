import type { Metadata } from "next";
import { Github, Mail, MessageSquareText, Clock3, Lightbulb } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { CONTACT_EMAIL, GITHUB_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Imaš pitanje, predlog ili prijavu greške? Kontaktiraj Prosekator tim — tu smo da pomognemo.",
  alternates: { canonical: "/contact" },
};

const faqs = [
  {
    question: "Da li je Prosekator besplatan?",
    answer:
      "Da. Aplikacija je potpuno besplatna, bez reklama i bez skrivenih pretplata. Nalog služi samo da sačuvaš podatke u oblaku.",
  },
  {
    question: "Mogu li da koristim aplikaciju bez naloga?",
    answer:
      "Možeš. Gost režim čuva predmete i ocene na tvom uređaju. Kada napraviš nalog, lokalne podatke možeš prebaciti jednim klikom.",
  },
  {
    question: "Kako se računa ukupan prosek?",
    answer:
      "Ukupan prosek je prosek proseka svih predmeta koji imaju bar jednu ocenu. Predmeti bez ocena ne ulaze u trenutni prosek, ali ulaze u simulator cilja.",
  },
  {
    question: "Kako da obrišem nalog?",
    answer:
      "Prijavi se, otvori podešavanja naloga iz menija i izaberi „Obriši nalog“. Time se trajno uklanjaju nalog, predmeti i sve ocene.",
  },
];

export default function ContactPage() {
  return (
    <main id="main-content" className="flex-1 px-3 py-6 sm:px-4 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <section className="card relative overflow-hidden p-6 sm:p-8">
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full opacity-60 blur-3xl"
            style={{ background: "var(--glow-1)" }}
            aria-hidden="true"
          />

          <div className="relative max-w-2xl">
            <span className="badge bg-accent-soft text-accent-strong">
              <MessageSquareText className="h-3.5 w-3.5" />
              Kontakt
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Imaš pitanje ili predlog?
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Tu smo da pomognemo. Pošalji poruku, prijavi grešku ili predloži funkciju koja bi ti
              olakšala praćenje ocena.
            </p>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <section className="card p-5 sm:p-7">
            <h2 className="text-lg font-extrabold">Pošalji poruku</h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              Popuni formu i otvoriće se tvoja email aplikacija sa već popunjenom porukom.
            </p>
            <div className="mt-5">
              <ContactForm />
            </div>
          </section>

          <div className="space-y-3">
            <section className="card p-5">
              <h2 className="text-sm font-extrabold">Direktan kontakt</h2>
              <div className="mt-3 space-y-2">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2 p-3 transition hover:border-line-strong hover:bg-surface-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Email</p>
                    <p className="truncate text-xs font-bold">{CONTACT_EMAIL}</p>
                  </div>
                </a>

                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2 p-3 transition hover:border-line-strong hover:bg-surface-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-3 text-fg">
                    <Github className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted">GitHub</p>
                    <p className="truncate text-xs font-bold">Prosekator repozitorijum</p>
                  </div>
                </a>
              </div>

              <div className="mt-3 flex items-start gap-2 rounded-xl border border-line bg-surface-2 p-3">
                <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" />
                <p className="text-[11px] leading-5 text-muted">
                  Trudimo se da odgovorimo u roku od 1–2 radna dana.
                </p>
              </div>

              <div className="mt-2 flex items-start gap-2 rounded-xl border border-line bg-surface-2 p-3">
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" />
                <p className="text-[11px] leading-5 text-muted">
                  Predlog za novu funkciju? Napiši nam kako bi ti pomogla u svakodnevnom praćenju
                  ocena.
                </p>
              </div>
            </section>

            <section className="card p-5">
              <h2 className="text-sm font-extrabold">Česta pitanja</h2>
              <div className="mt-2 divide-y divide-line">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-bold transition hover:text-accent-strong">
                      {faq.question}
                      <span className="text-muted transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-2 text-[11px] leading-5 text-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
