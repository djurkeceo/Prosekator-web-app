import type { Metadata } from "next";
import { Clock3, Github, Lightbulb, Mail, MessageSquareText } from "lucide-react";
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
      "Ukupan prosek je prosek zaključnih ocena svih predmeta koji imaju bar jednu ocenu. Zaključna ocena je prosek predmeta zaokružen na ceo broj (npr. 3,50 → 4, 3,40 → 3). Predmeti bez ocena ne ulaze u trenutni prosek, ali ulaze u simulator cilja.",
  },
  {
    question: "Kako da obrišem nalog?",
    answer:
      "Prijavi se, otvori podešavanja naloga iz menija i izaberi „Obriši nalog“. Time se trajno uklanjaju nalog, predmeti i sve ocene.",
  },
];

export default function ContactPage() {
  return (
    <main id="main-content" className="flex-1 px-4 py-10 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[1280px] space-y-10">
        <section className="hero-fade relative overflow-hidden">
          <p className="fig-label">kontakt</p>
          <h1 className="mt-5 font-mono text-4xl leading-[1.02] tracking-[-0.05em] text-fg sm:text-5xl lg:text-6xl">
            Imaš pitanje
            <br />
            <span className="text-info">ili predlog?</span>
          </h1>
          <p className="mt-5 max-w-xl text-[13px] leading-7 text-muted sm:text-sm">
            Tu smo da pomognemo. Pošalji poruku, prijavi grešku ili predloži funkciju koja bi ti
            olakšala praćenje ocena.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="badge badge-yellow">
              <MessageSquareText className="h-3 w-3" />
              email
            </span>
            <span className="badge">github</span>
            <span className="badge">1–2 radna dana</span>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <section className="fig">
            <div className="fig-bar">
              <span className="fig-label">fig. 01 — poruka</span>
              <span className="font-mono text-[10px]">mailto</span>
            </div>
            <div className="fig-well p-5 sm:p-6">
              <h2 className="font-mono text-2xl tracking-[-0.04em]">Pošalji poruku.</h2>
              <p className="mt-2 text-[12px] leading-6 text-muted">
                Popuni formu i otvoriće se tvoja email aplikacija sa već popunjenom porukom.
              </p>
              <div className="mt-5">
                <ContactForm />
              </div>
            </div>
          </section>

          <div className="space-y-3">
            <section className="fig">
              <div className="fig-bar">
                <span className="fig-label">direktan kontakt</span>
                <span className="font-mono text-[10px]">2</span>
              </div>
              <div className="space-y-2 p-4">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 border border-line bg-surface p-3 transition-colors hover:border-line-strong hover:bg-surface-2"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-line bg-accent-soft text-yellow-fg">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] text-muted">email</p>
                    <p className="truncate text-[12px] font-medium">{CONTACT_EMAIL}</p>
                  </div>
                </a>

                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 border border-line bg-surface p-3 transition-colors hover:border-line-strong hover:bg-surface-2"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-line bg-blue-wash text-info">
                    <Github className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] text-muted">github</p>
                    <p className="truncate text-[12px] font-medium">Prosekator repozitorijum</p>
                  </div>
                </a>

                <div className="flex items-start gap-2 border border-line bg-surface p-3">
                  <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" />
                  <p className="text-[10.5px] leading-5 text-muted">
                    Trudimo se da odgovorimo u roku od 1–2 radna dana.
                  </p>
                </div>

                <div className="flex items-start gap-2 border border-line bg-surface p-3">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" />
                  <p className="text-[10.5px] leading-5 text-muted">
                    Predlog za novu funkciju? Napiši nam kako bi ti pomogla u svakodnevnom praćenju
                    ocena.
                  </p>
                </div>
              </div>
            </section>

            <section id="faq" className="fig scroll-mt-24">
              <div className="fig-bar">
                <span className="fig-label">faq</span>
                <span className="font-mono text-[10px]">{faqs.length}</span>
              </div>
              <div className="divide-y divide-line px-4">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[12px] font-medium transition-colors hover:text-accent-strong">
                      {faq.question}
                      <span className="font-mono text-muted transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-2 text-[10.5px] leading-5 text-muted">{faq.answer}</p>
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
