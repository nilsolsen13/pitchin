// SquadStreakBar (spec §6.5). Weeks + a 12-cell recent-weeks strip.
// The strip reflects the squad's unbroken streak: full weeks are green.

import type { Squad } from '../types';

export function SquadStreakBar({ squad }: { squad: Squad }) {
  const cells = 12;
  const filled = Math.min(cells, squad.streakWeeks);
  return (
    <div>
      <div className="font-mono text-sm uppercase tracking-wider text-warm-ink">
        {squad.streakWeeks} WEEKS UNBROKEN
      </div>
      <div className="mt-2 flex gap-1">
        {Array.from({ length: cells }, (_, i) => (
          <span
            key={i}
            className="h-4 w-4 rounded-[2px]"
            style={{ backgroundColor: i < filled ? '#3FA66A' : '#C9BFA9' }}
          />
        ))}
      </div>
    </div>
  );
}
