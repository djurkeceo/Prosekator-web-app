import { Calculator, CloudCheck, WifiOff } from "lucide-react";

const steps = [
  "Prosek predmeta je zbir svih ocena podeljen brojem ocena tog predmeta.",
  "Zaključna ocena je prosek predmeta zaokružen na ceo broj (3,50 → 4, 3,40 → 3). Ukupan prosek je prosek zaključnih ocena svih predmeta sa ocenama.",
  "U simulatoru cilja predmeti bez ocena ulaze u račun, jer tek treba da dobiju ocenu.",
];

export function InfoCard() {
  return (
    <section className="fig">
      <div className="fig-bar">
        <span className="fig-label">fig. 04 — metodologija</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px]">
          <Calculator className="h-3 w-3" />
          3 koraka
        </span>
      </div>

      <div className="p-4">
        <h2 className="font-mono text-[13px] font-medium">Kako se računa prosek?</h2>
        <p className="mt-1 text-[11px] leading-5 text-muted">Bez digitrona i ručnog sabiranja.</p>

        <div className="mt-4 space-y-2">
          {steps.map((text, index) => (
            <div key={text} className="flex gap-2.5 border border-line bg-surface p-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] border border-[color-mix(in_srgb,var(--yellow)_55%,var(--line))] bg-accent-soft font-mono text-[9px] text-yellow-fg">
                {index + 1}
              </span>
              <p className="text-[10.5px] leading-5 text-muted">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-2">
          <p className="flex items-start gap-2 border border-line bg-surface p-3 text-[10px] leading-5 text-muted">
            <CloudCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" />
            Sa nalogom se sve automatski čuva u oblaku, na svim uređajima.
          </p>
          <p className="flex items-start gap-2 border border-line bg-surface p-3 text-[10px] leading-5 text-muted">
            <WifiOff className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" />
            Gost režim i poslednji učitani podaci rade i bez internet veze.
          </p>
        </div>
      </div>
    </section>
  );
}
