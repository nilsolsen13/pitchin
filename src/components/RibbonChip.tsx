// RibbonChip (final spec D.4). CSS only — 28px / 40px paper face, mono monogram.
// full-year and backstop take a stamp-red ring. Never a count.

import type { Ribbon } from '../types';
import { RIBBON_MONOGRAM } from '../data/ribbons';

export function RibbonChip({
  ribbon,
  earned = true,
  size = 'md',
}: {
  ribbon: Ribbon;
  earned?: boolean;
  size?: 'sm' | 'md';
}) {
  const stamp = ribbon.id === 'full-year' || ribbon.id === 'backstop';
  const label = earned
    ? `${ribbon.name} — ${ribbon.criterion}`
    : `${ribbon.name} — ${ribbon.criterion} not yet earned`;
  return (
    <span
      className={`ribbon-chip ribbon-chip-${size}${stamp ? ' ribbon-chip-stamp' : ''}${earned ? '' : ' ribbon-chip-unearned'}`}
      aria-label={label}
      title={earned ? ribbon.note : ribbon.criterion}
    >
      {RIBBON_MONOGRAM[ribbon.id]}
    </span>
  );
}
