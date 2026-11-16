import Link from "next/link";
import { Github, Mail } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { CONTACT_EMAIL, GITHUB_URL } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-14 border-t-[3px] border-line bg-[var(--header-bg)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <BrandMark />
            <p className="mt-3 text-sm leading-6 text-muted">
              Tvoj prosek, ocene i napredak na jednom mestu. Bez digitrona i bez ručnog sabiranja.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
            <div className="space-y-2">
              <p className="eyebrow">Aplikacija</p>
              <Link href="/" className="block font-semibold text-muted transition hover:text-fg hover:underline">
                Prosek
              </Link>
              <Link href="/about" className="block font-semibold text-muted transition hover:text-fg hover:underline">
                O aplikaciji
              </Link>
              <Link href="/contact" className="block font-semibold text-muted transition hover:text-fg hover:underline">
                Kontakt
              </Link>
            </div>
            <div className="space-y-2">
              <p className="eyebrow">Nalog</p>
              <Link href="/login" className="block font-semibold text-muted transition hover:text-fg hover:underline">
                Prijava
              </Link>
              <Link href="/signup" className="block font-semibold text-muted transition hover:text-fg hover:underline">
                Registracija
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-1.5 font-semibold text-muted transition hover:text-fg hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t-2 border-line pt-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Prosekator. Sva prava zadržana.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>Napravljeno za učenike, bez digitrona.</span>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold transition hover:text-fg hover:underline"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
