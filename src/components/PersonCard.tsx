// PersonCard (spec §6.5). Initials avatar, name, squad, quals; optional ring.

import type { Equipment, Person } from '../types';
import { squads } from '../data/seed';
import { PAPER } from '../lib/paper';
import { Avatar } from './Avatar';
import { QualBadge } from './QualBadge';
import { MaterielChip } from './MaterielChip';
import { ShowRateRing } from './ShowRateRing';
import { Flyer } from './Flyer';

export function PersonCard({
  person,
  showRate,
  equipment,
}: {
  person: Person;
  showRate?: number;
  equipment?: Equipment[];
}) {
  const squad = squads.find((s) => s.id === person.squadId);
  return (
    <Flyer id={`person-${person.id}`} paper={PAPER.cream}>
      <div className="flex gap-3">
        <Avatar id={person.id} name={person.name} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-medium text-warm-ink">{person.name}</div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
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
          {equipment && equipment.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {equipment.map((e) => (
                <MaterielChip key={e.id} type={e.type} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Flyer>
  );
}
