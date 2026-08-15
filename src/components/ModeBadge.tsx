// ModeBadge (spec §6.5). "SURGE" orange / "SUSTAINMENT" blue.

import type { NeedMode } from '../types';

const STYLE: Record<NeedMode, { color: string; label: string }> = {
  surge: { color: '#D9642E', label: 'SURGE' },
  sustainment: { color: '#4C8DD9', label: 'SUSTAINMENT' },
};

export function ModeBadge({ mode }: { mode: NeedMode }) {
  const s = STYLE[mode];
  return (
    <span
      className="inline-block rounded-ops px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
      style={{ color: s.color, backgroundColor: `${s.color}22`, border: `1px solid ${s.color}55` }}
    >
      {s.label}
    </span>
  );
}
