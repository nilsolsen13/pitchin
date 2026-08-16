// Squad Detail (spec §7.6). Individual show-rates are visible here because you
// are a squadmate. QUALS HELD / ASSETS are derived (13 / 13 for Creek Side),
// and coverage gaps are computed — never the spec's generic example (NOTES #5).

import type { QualId } from '../types';
import { useDemo } from '../state/DemoState';
import { useParams } from 'react-router-dom';
import { equipment as seedEquipment, quals, squads, aars } from '../data/seed';
import { fmtPct1, fmtShort } from '../lib/format';
import { showRate, squadAssets, squadQualsHeld, squadShowRate, ribbonsFor, standingFor } from '../lib/derive';
import { PAPER } from '../lib/paper';
import { SquadStreakBar } from '../components/SquadStreakBar';
import { StatCard } from '../components/StatCard';
import { PersonCard } from '../components/PersonCard';
import { Ann } from '../components/Ann';
import { Flyer } from '../components/Flyer';
import { Photo } from '../components/Photo';
import { Bulletin, Masthead } from '../components/Bulletin';
import { PHOTOS } from '../data/photos';

export default function SquadDetail() {
  const { squadId } = useParams();
  const { people, needs, tasks, commitments } = useDemo();
  const squad = squads.find((s) => s.id === squadId);

  if (!squad) {
    return (
      <Bulletin>
        <p className="font-mono text-sm text-warm-ink-2">Squad not found.</p>
      </Bulletin>
    );
  }

  const members = people.filter((p) => p.squadId === squad.id);
  const held = squadQualsHeld(squad, people);
  const gaps = quals.filter((q) => !held.includes(q.id as QualId));
  const assets = squadAssets(squad, seedEquipment);

  return (
    <Bulletin>
      <Masthead
        title={squad.name}
        sub={`${members.length} MEMBERS · FORMED ${fmtShort(squad.formedDate)} · STANDING: ${squad.standing.toUpperCase()}`}
      />

      <div className="relative mx-auto mt-8 max-w-xl">
        <Ann route="squad" n={1} className="-left-6 top-0" />
        <Flyer id="squad-streak" paper={PAPER.green}>
          <SquadStreakBar squad={squad} />
        </Flyer>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <StatCard label="SQUAD SHOW-RATE" value={fmtPct1(squadShowRate(squad, people))} />
        <StatCard label="MEMBERS" value={members.length} />
        <StatCard label="QUALS HELD" value={held.length} />
        <StatCard label="ASSETS" value={assets.length} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-[#f4efe4]/80">
            Members
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {members.map((p) => (
              <PersonCard
                key={p.id}
                person={p}
                showRate={showRate(p) * 100}
                equipment={seedEquipment.filter((e) => e.ownerId === p.id)}
                ribbons={ribbonsFor(p, needs, tasks, commitments, aars)}
                standingLabel={standingFor(p)}
              />
            ))}
          </div>
        </div>

        <aside className="space-y-6 lg:col-span-4">
          {squad.id === 'creek-side' ? (
            <Photo
              src={PHOTOS.sandbagLine.src}
              alt={PHOTOS.sandbagLine.alt}
              caption={PHOTOS.sandbagLine.caption}
              width="md"
              tilt={2}
            />
          ) : null}
          <Flyer id="squad-coverage" paper={PAPER.rose}>
            <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-warm-ink-2">Coverage</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {gaps.length === 0 ? (
                <span className="font-mono text-xs text-warm-ink">Full coverage across all quals.</span>
              ) : (
                gaps.map((q) => (
                  <span
                    key={q.id}
                    className="rounded-warm border px-2 py-1 font-mono text-[11px] uppercase tracking-wider"
                    style={{ color: '#C4544A', borderColor: '#C4544A55' }}
                  >
                    NO {q.name}
                  </span>
                ))
              )}
            </div>
          </Flyer>

          <Flyer id="squad-privacy" paper={PAPER.masthead}>
            <p className="font-mono text-[11px] leading-relaxed text-warm-ink-2">
              You can see individual show-rates because you're a squadmate. The town cannot. Public
              rankings are squad-level only.
            </p>
          </Flyer>
        </aside>
      </div>
    </Bulletin>
  );
}
