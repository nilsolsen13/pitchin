// My Rep (spec §7.5). Nora Beckett, KEEP_THE_CHAIN. The shrinking-ask copy is
// prescribed; the demo control reaches all three states + waived.

import { Link } from 'react-router-dom';
import type { Commitment, RepState } from '../types';
import { useDemo } from '../state/DemoState';
import { squads } from '../data/seed';
import { showRate } from '../lib/derive';
import { PAPER } from '../lib/paper';
import { RepCard } from '../components/RepCard';
import { QualBadge } from '../components/QualBadge';
import { ShowRateRing } from '../components/ShowRateRing';
import { Ann } from '../components/Ann';
import { Flyer } from '../components/Flyer';
import { Bulletin, Masthead, PaperTab } from '../components/Bulletin';

const STRIP_COLOR: Record<Commitment['outcome'], string> = {
  kept: '#3FA66A',
  missed: '#C4544A',
  waived: '#5E6B7D',
  pending: '#2A3441',
};

const DEMO_OPTIONS: { state: RepState; label: string }[] = [
  { state: 'STANDARD', label: 'STANDARD' },
  { state: 'SCOPED_DOWN', label: 'SCOPED DOWN' },
  { state: 'KEEP_THE_CHAIN', label: 'KEEP THE CHAIN' },
];

export default function MyRep() {
  const { people, commitments, repState, setRepState, acceptRep, waiveRep } = useDemo();
  const nora = people.find((p) => p.id === 'p-beckett')!;
  const creekSide = squads.find((s) => s.id === 'creek-side')!;

  // The 12-week strip: Nora's completed weekly reps in date order.
  const strip = commitments
    .filter((c) => c.personId === 'p-beckett' && c.isWeeklyRep && c.outcome !== 'pending')
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
    .slice(-12);

  return (
    <Bulletin>
      <Masthead title="My Rep" />

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="relative lg:col-span-8">
          <Ann route="me" n={1} className="-left-6 top-1" />
          <RepCard variant="large" onAccept={acceptRep} onWaive={waiveRep} />

          {/* Demo control — reach all three shrinking-ask states. */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#f4efe4]/80">
              DEMO: REP STATE
            </span>
            <div className="flex flex-wrap gap-2">
              {DEMO_OPTIONS.map((o) => (
                <PaperTab
                  key={o.state}
                  active={repState === o.state}
                  onClick={() => setRepState(o.state)}
                >
                  {o.label}
                </PaperTab>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Flyer id="me-strip" paper={PAPER.cream}>
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-warm-ink-2">
                YOUR LAST 12 WEEKS
              </div>
              <div className="mt-2 flex gap-1.5">
                {strip.map((c) => (
                  <span
                    key={c.id}
                    title={`${c.dueAt.slice(0, 10)} · ${c.outcome}`}
                    className="h-6 w-6 rounded-[2px]"
                    style={{ backgroundColor: STRIP_COLOR[c.outcome] }}
                  />
                ))}
              </div>
              <div className="mt-2 flex gap-4 font-mono text-[11px] text-warm-ink-2">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: STRIP_COLOR.kept }} /> KEPT</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: STRIP_COLOR.missed }} /> MISSED</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: STRIP_COLOR.waived }} /> WAIVED</span>
              </div>
            </Flyer>
          </div>
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <div className="relative">
            <Ann route="me" n={2} className="-left-6 top-2" />
            <Flyer id="me-rate" paper={PAPER.cream} className="flex flex-col items-center">
              <ShowRateRing value={showRate(nora) * 100} size={112} />
              <div className="mt-3 font-mono text-xs uppercase tracking-wider text-warm-ink">
                {nora.keptCount} KEPT · {nora.missedCount} MISSED
              </div>
              <p className="mt-2 text-center text-xs text-warm-ink-2">
                Show-rate is commitments kept over commitments made. Not hours. Not tasks.
              </p>
            </Flyer>
          </div>

          <div className="relative">
            <Ann route="me" n={3} className="-left-6 top-2" />
            <Flyer id="me-squad" paper={PAPER.green}>
              <div className="font-mono text-sm uppercase tracking-wider text-warm-ink">
                {creekSide.name} · {creekSide.streakWeeks} weeks
              </div>
              <p className="mt-2 text-sm text-warm-ink-2">
                Creek Side held the line while you were out. Streaks belong to the squad.
              </p>
              <Link to="/squad/creek-side" className="mt-2 inline-block text-sm text-warm-stamp hover:underline">
                See your squad →
              </Link>
            </Flyer>
          </div>

          <Flyer id="me-quals" paper={PAPER.cream}>
            <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-warm-ink-2">Your quals</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {nora.quals.map((q) => (
                <QualBadge key={q} qualId={q} size="sm" />
              ))}
            </div>
            <p className="mt-2 text-xs text-warm-ink-2">
              Quals are earned by demonstration and determine what you get called for in a surge.
            </p>
          </Flyer>

          <Flyer id="me-cap" paper={PAPER.yellow}>
            <div className="font-mono text-sm uppercase tracking-wider text-warm-stamp">
              1 REP / WEEK · CAP ENFORCED
            </div>
            <p className="mt-2 text-sm text-warm-ink-2">
              You can't take a second rep. Volume isn't the metric.
            </p>
          </Flyer>
        </aside>
      </div>
    </Bulletin>
  );
}
