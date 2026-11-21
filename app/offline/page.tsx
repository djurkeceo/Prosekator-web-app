import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Nema veze sa internetom",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main id="main-content" className="premium-page-enter flex flex-1 items-center justify-center px-4 py-16 sm:py-20">
      <div className="premium-enter-soft fig w-full max-w-lg">
        <div className="fig-bar">
          <span className="fig-label">fig. 00 — offline</span>
          <span className="font-mono text-[10px]">no signal</span>
        </div>
        <div className="fig-well fig-grid p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[4px] border border-line bg-accent-soft text-yellow-fg">
            <WifiOff className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-mono text-3xl tracking-[-0.05em]">Trenutno si offline.</h1>
          <p className="mx-auto mt-3 max-w-sm text-[12px] leading-6 text-muted">
            Prosekator radi i bez interneta kada je već učitan. Gost režim i poslednji podaci
            ostaju sačuvani na ovom uređaju.
          </p>
          <Link href="/" className="btn btn-primary mt-6 w-full">
            Pokušaj ponovo
          </Link>
          <p className="mt-4 font-mono text-[9px] text-muted">[ lokalni podaci ostaju dostupni ]</p>
        </div>
      </div>
    </main>
  );
}
