"use client";

import { CloudUpload, LogIn, Sparkles, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

export function GuestBanner() {
  return (
    <section className="card animate-fade-up flex flex-col gap-4 border-accent/30 bg-accent-soft/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-fg">
          <UserPlus className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold">Trenutno si u gost režimu</p>
          <p className="mt-0.5 text-xs leading-5 text-muted">
            Podaci se čuvaju samo na ovom uređaju. Napravi nalog da ih sačuvaš u oblaku i
            nastaviš na bilo kom telefonu ili računaru.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <Link href="/login" className="btn btn-secondary flex-1 sm:flex-none">
          <LogIn className="h-4 w-4" />
          Prijavi se
        </Link>
        <Link href="/signup" className="btn btn-primary flex-1 sm:flex-none">
          <Sparkles className="h-4 w-4" />
          Napravi nalog
        </Link>
      </div>
    </section>
  );
}

type GuestDataBannerProps = {
  isImporting: boolean;
  onImport: () => Promise<boolean>;
  onDiscard: () => void;
};

export function GuestDataBanner({ isImporting, onImport, onDiscard }: GuestDataBannerProps) {
  return (
    <section className="card animate-fade-up flex flex-col gap-4 border-info/30 bg-[color-mix(in_srgb,var(--info)_8%,transparent)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--info)_18%,transparent)] text-info">
          <CloudUpload className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold">Našli smo lokalne podatke iz gost režima</p>
          <p className="mt-0.5 text-xs leading-5 text-muted">
            Prebaci predmete i ocene na svoj nalog da budu sačuvani u oblaku. Postojeći podaci na
            nalogu neće biti obrisani.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onDiscard}
          className="btn btn-ghost flex-1 sm:flex-none"
          disabled={isImporting}
        >
          <X className="h-4 w-4" />
          Odbaci
        </button>
        <button
          type="button"
          onClick={() => void onImport()}
          className="btn btn-primary flex-1 sm:flex-none"
          disabled={isImporting}
        >
          {isImporting ? <Spinner /> : <CloudUpload className="h-4 w-4" />}
          {isImporting ? "Prenosim…" : "Prebaci na nalog"}
        </button>
      </div>
    </section>
  );
}
