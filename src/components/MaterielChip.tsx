// MaterielChip (spec §6.5). Icon + label, e.g. "TRUCK · TOW".

import type { EquipmentType } from '../types';

const LABELS: Record<EquipmentType, string> = {
  'truck-tow': 'TRUCK · TOW',
  'truck-plow': 'TRUCK · PLOW',
  'trailer-stock': 'TRAILER · STOCK',
  generator: 'GENERATOR',
  'trash-pump': 'TRASH PUMP',
  chainsaw: 'CHAINSAW',
  'ham-base': 'HAM · BASE',
  dehumidifier: 'DEHUMIDIFIER',
};

export function MaterielChip({ type }: { type: EquipmentType }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-ops border border-rule bg-raised px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-secondary">
      <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
        <rect x="0.5" y="2.5" width="11" height="7" rx="1" fill="none" stroke="currentColor" />
        <line x1="0.5" y1="5.5" x2="11.5" y2="5.5" stroke="currentColor" />
      </svg>
      {LABELS[type]}
    </span>
  );
}
