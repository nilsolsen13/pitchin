// StatCard (spec §6.5). Mono value at 2.375rem; optional unit and sub.

import type { ReactNode } from 'react';
import { Flyer } from './Flyer';
import { PAPER } from '../lib/paper';

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
    <Flyer id={`stat-${label}`} paper={PAPER.cream}>
      <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-warm-ink-2">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className={`font-mono text-4xl ${accent ? 'text-warm-stamp' : 'text-warm-ink'}`}>{value}</span>
        {unit ? <span className="font-mono text-sm text-warm-ink-2">{unit}</span> : null}
      </div>
      {sub ? <div className="mt-1 font-mono text-xs text-warm-ink-2">{sub}</div> : null}
    </Flyer>
  );
}
