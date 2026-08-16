// QualBadge (spec §6.5). Name + category color; tooltip is the demonstration.

import type { QualId } from '../types';
import { quals } from '../data/seed';

const CATEGORY_COLOR: Record<string, string> = {
  Response: '#D9642E',
  Care: '#3FA66A',
  Logistics: '#4C8DD9',
  Civic: '#E8A33D',
};

export function QualBadge({ qualId, size = 'md' }: { qualId: QualId; size?: 'sm' | 'md' }) {
  const q = quals.find((x) => x.id === qualId);
  if (!q) return null;
  const color = CATEGORY_COLOR[q.category];
  const pad = size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-xs';
  return (
    <span
      title={q.demonstration}
      className={`inline-flex items-center gap-1.5 rounded-ops ${pad} font-medium`}
      style={{ color, backgroundColor: `${color}1A`, border: `1px solid ${color}44` }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {q.name}
    </span>
  );
}
