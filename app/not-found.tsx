import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Home, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Stranica nije pronađena",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-16 sm:py-20">
      <div className="fig w-full max-w-lg">
        <div className="fig-bar">
          <span className="fig-label">fig. 404 — nema stranice</span>
          <span className="font-mono text-[10px]">not found</span>
        </div>
        <div className="fig-well fig-grid p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[4px] border border-line bg-accent-soft text-yellow-fg">
            <Compass className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-mono text-3xl tracking-[-0.05em]">
            Ova stranica ne postoji.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[12px] leading-6 text-muted">
            Možda je link zastareo ili je stranica premeštena. Vrati se na prosek ili nam pošalji
            poruku ako misliš da je greška.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href="/" className="btn btn-primary w-full sm:w-auto">
              <Home className="h-3.5 w-3.5" />
              Nazad na prosek
            </Link>
            <Link href="/contact" className="btn btn-secondary w-full sm:w-auto">
              <Mail className="h-3.5 w-3.5" />
              Kontakt
            </Link>
          </div>
          <p className="mt-4 font-mono text-[9px] text-muted">[ 404 · stranica nije pronađena ]</p>
        </div>
      </div>
    </main>
  );
}
