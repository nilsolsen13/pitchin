// Squad Detail (spec §7.6). Individual show-rates are visible here because you
// are a squadmate. QUALS HELD / ASSETS are derived (13 / 13 for Creek Side),
// and coverage gaps are computed — never the spec's generic example (NOTES #5).

import type { QualId } from '../types';
import { useDemo } from '../state/DemoState';
import { useParams } from 'react-router-dom';
import { equipment as seedEquipment, quals, squads } from '../data/seed';
import { fmtPct1, fmtShort } from '../lib/format';
import { showRate, squadAssets, squadQualsHeld, squadShowRate } from '../lib/derive';
import { SquadStreakBar } from '../components/SquadStreakBar';
import { StatCard } from '../components/StatCard';
import { PersonCard } from '../components/PersonCard';
import { Ann } from '../components/Ann';

export default function SquadDetail() {
  const { squadId } = useParams();
  const { people } = useDemo();
  const squad = squads.find((s) => s.id === squadId);

  if (!squad) {
    return <p className="font-mono text-sm text-ops-text-3">Squad not found.</p>;
  }

  const members = people.filter((p) => p.squadId === squad.id);
  const held = squadQualsHeld(squad, people);
  const gaps = quals.filter((q) => !held.includes(q.id as QualId));
  const assets = squadAssets(squad, seedEquipment);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-ops-text">{squad.name}</h1>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ops-text-3">
        {members.length} MEMBERS · FORMED {fmtShort(squad.formedDate)} · STANDING: {squad.standing.toUpperCase()}
      </div>

      <div className="relative mt-5">
        <Ann route="squad" n={1} className="-left-6 top-0" />
        <SquadStreakBar squad={squad} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="SQUAD SHOW-RATE" value={fmtPct1(squadShowRate(squad, people))} />
        <StatCard label="MEMBERS" value={members.length} />
        <StatCard label="QUALS HELD" value={held.length} />
        <StatCard label="ASSETS" value={assets.length} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">Members</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {members.map((p) => (
              <PersonCard
                key={p.id}
                person={p}
                showRate={showRate(p) * 100}
                equipment={seedEquipment.filter((e) => e.ownerId === p.id)}
              />
            ))}
          </div>
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <div className="rounded-ops border border-ops-border bg-ops-surface p-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">Coverage</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {gaps.length === 0 ? (
                <span className="font-mono text-xs text-ops-text-2">Full coverage across all quals.</span>
              ) : (
                gaps.map((q) => (
                  <span
                    key={q.id}
                    className="rounded-ops border px-2 py-1 font-mono text-[11px] uppercase tracking-wider"
                    style={{ color: '#C4544A', borderColor: '#C4544A55' }}
                  >
                    NO {q.name}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="rounded-ops border border-ops-border bg-ops-raised p-4">
            <p className="font-mono text-[11px] leading-relaxed text-ops-text-3">
              You can see individual show-rates because you're a squadmate. The town cannot. Public
              rankings are squad-level only.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
