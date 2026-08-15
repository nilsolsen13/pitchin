// PersonCard (spec §6.5). Initials avatar, name, squad, quals; optional ring.

import type { Person } from '../types';
import { squads } from '../data/seed';
import { Avatar } from './Avatar';
import { QualBadge } from './QualBadge';
import { ShowRateRing } from './ShowRateRing';

export function PersonCard({ person, showRate }: { person: Person; showRate?: number }) {
  const squad = squads.find((s) => s.id === person.squadId);
  return (
    <div className="flex gap-3 rounded-ops border border-ops-border bg-ops-surface p-4">
      <Avatar id={person.id} name={person.name} size={40} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-medium text-ops-text">{person.name}</div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-ops-text-3">
              {squad?.name ?? person.squadId} · AGE {person.age}
            </div>
          </div>
          {showRate !== undefined ? <ShowRateRing value={showRate} size={48} /> : null}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {person.quals.map((q) => (
            <QualBadge key={q} qualId={q} size="sm" />
          ))}
        </div>
      </div>
    </div>
  );
}
