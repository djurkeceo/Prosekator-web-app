"use client";

import { CloudUpload, LogIn, Sparkles, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

export function GuestBanner() {
  return (
    <section className="animate-fade-up flex flex-col gap-4 rounded-[8px] border border-[color-mix(in_srgb,var(--yellow)_55%,var(--line))] bg-[var(--yellow-wash)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-[color-mix(in_srgb,var(--yellow)_55%,var(--line))] bg-accent-soft text-yellow-fg">
          <UserPlus className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[13px] font-medium">Trenutno si u gost režimu</p>
          <p className="mt-1 text-[11px] leading-5 text-muted">
            Podaci se čuvaju samo na ovom uređaju. Napravi nalog da ih sačuvaš u oblaku i
            nastaviš na bilo kom telefonu ili računaru.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <Link href="/login" className="btn btn-secondary flex-1 bg-surface sm:flex-none">
          <LogIn className="h-3.5 w-3.5" />
          Prijavi se
        </Link>
        <Link href="/signup" className="btn btn-primary flex-1 sm:flex-none">
          <Sparkles className="h-3.5 w-3.5" />
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
    <section className="animate-fade-up flex flex-col gap-4 rounded-[8px] border border-[color-mix(in_srgb,var(--blue)_25%,var(--line))] bg-[var(--blue-wash)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-[color-mix(in_srgb,var(--blue)_25%,var(--line))] bg-surface text-info">
          <CloudUpload className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[13px] font-medium">Našli smo lokalne podatke iz gost režima</p>
          <p className="mt-1 text-[11px] leading-5 text-muted">
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
          <X className="h-3.5 w-3.5" />
          Odbaci
        </button>
        <button
          type="button"
          onClick={() => void onImport()}
          className="btn btn-primary flex-1 sm:flex-none"
          disabled={isImporting}
        >
          {isImporting ? <Spinner /> : <CloudUpload className="h-3.5 w-3.5" />}
          {isImporting ? "Prenosim…" : "Prebaci na nalog"}
        </button>
      </div>
    </section>
  );
}
