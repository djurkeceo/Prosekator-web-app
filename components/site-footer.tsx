import Link from "next/link";
import { Github, Mail } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { CONTACT_EMAIL, GITHUB_URL } from "@/lib/constants";

const footerColumns = [
  {
    title: "Aplikacija",
    links: [
      { href: "/", label: "Prosek" },
      { href: "/about", label: "O aplikaciji" },
      { href: "/contact", label: "Kontakt" },
    ],
  },
  {
    title: "Nalog",
    links: [
      { href: "/login", label: "Prijava" },
      { href: "/signup", label: "Registracija" },
      { href: "/contact#faq", label: "Česta pitanja" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-[var(--header-bg)]">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_0.7fr_0.7fr_1fr]">
          <div className="max-w-sm">
            <BrandMark />
            <p className="mt-4 text-[13px] leading-6 text-muted">
              Tvoj prosek, ocene i napredak na jednom mestu. Bez digitrona i bez ručnog
              sabiranja.
            </p>
            <p className="mt-5 font-mono text-[9.5px] text-muted">
              [ napravljeno za učenike · sr_RS ]
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-[10px] text-muted">{column.title}</p>
              <div className="mt-3 grid gap-2">
                {column.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="w-fit text-[13px] text-muted transition-colors hover:text-fg"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <p className="font-mono text-[10px] text-muted">Resursi</p>
            <div className="mt-3 grid gap-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex w-fit items-center gap-2 text-[13px] text-muted transition-colors hover:text-fg"
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="flex w-fit items-center gap-2 text-[13px] text-muted transition-colors hover:text-fg"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
              <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-[4px] border border-line bg-surface-2 px-2 py-1 font-mono text-[9px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden="true" />
                sve radi lokalno
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-5 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Prosekator. Sva prava zadržana.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[9.5px]">
            <span>bez reklama</span>
            <span className="text-line-strong">/</span>
            <span>bez digitrona</span>
            <span className="text-line-strong">/</span>
            <span>v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
