import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Nema veze sa internetom",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="card w-full max-w-md p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-accent-soft text-accent-strong">
          <WifiOff className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold">Trenutno si offline</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Prosekator radi i bez interneta kada je već učitan. Gost režim i poslednji podaci
          ostaju sačuvani na ovom uređaju.
        </p>
        <Link href="/" className="btn btn-primary mt-6 w-full">
          Pokušaj ponovo
        </Link>
      </div>
    </main>
  );
}
