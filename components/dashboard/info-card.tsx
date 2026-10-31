import { Calculator, CloudCheck, WifiOff } from "lucide-react";

export function InfoCard() {
  return (
    <section className="card p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-3 text-accent-strong">
          <Calculator className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-extrabold">Kako se računa prosek?</h2>
          <p className="text-xs text-muted">Bez digitrona i ručnog sabiranja.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3 text-[11px] leading-5 text-muted">
        <div className="flex gap-2.5 rounded-xl border border-line bg-surface-2 p-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-extrabold text-accent-strong">
            1
          </span>
          <p>
            Prosek predmeta je zbir svih ocena podeljen brojem ocena tog predmeta.
          </p>
        </div>
        <div className="flex gap-2.5 rounded-xl border border-line bg-surface-2 p-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-extrabold text-accent-strong">
            2
          </span>
          <p>
            Ukupan prosek je <span className="font-bold text-fg">prosek proseka</span> svih
            predmeta koji imaju bar jednu ocenu. Predmeti bez ocena ne obaraju prosek.
          </p>
        </div>
        <div className="flex gap-2.5 rounded-xl border border-line bg-surface-2 p-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-extrabold text-accent-strong">
            3
          </span>
          <p>
            U simulatoru cilja predmeti bez ocena ulaze u račun, jer tek treba da dobiju ocenu.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <p className="flex items-start gap-2 rounded-xl border border-line bg-surface-2 p-3 text-[11px] leading-5 text-muted">
          <CloudCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-strong" />
          Sa nalogom se sve automatski čuva u oblaku, na svim uređajima.
        </p>
        <p className="flex items-start gap-2 rounded-xl border border-line bg-surface-2 p-3 text-[11px] leading-5 text-muted">
          <WifiOff className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" />
          Gost režim i poslednji učitani podaci rade i bez internet veze.
        </p>
      </div>
    </section>
  );
}
