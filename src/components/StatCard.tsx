// StatCard (spec §6.5). Mono value at 2.375rem; optional unit and sub.

import type { ReactNode } from 'react';

export function StatCard({
  label,
  value,
  unit,
  sub,
  accent,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  sub?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="rounded-ops border border-ops-border bg-ops-surface p-4">
      <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className={`font-mono text-4xl ${accent ? 'text-ops-accent' : 'text-ops-text'}`}>{value}</span>
        {unit ? <span className="font-mono text-sm text-ops-text-2">{unit}</span> : null}
      </div>
      {sub ? <div className="mt-1 font-mono text-xs text-ops-text-3">{sub}</div> : null}
    </div>
  );
}
