// Needs Board (spec §7.2). Filters, ordered cards, right rail. Real state.
// Visual: dorm cork bulletin. Spec copy, order, filters, and stalled
// diagnosis are unchanged.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Need } from '../types';
import { useDemo } from '../state/DemoState';
import { equipment, quals, squads } from '../data/seed';
import { DEMO_TODAY } from '../data/seed';
import { daysSince } from '../lib/format';
import { PAPER } from '../lib/paper';
import { NeedCard } from '../components/NeedCard';
import { RepCard } from '../components/RepCard';
import { Ann } from '../components/Ann';
import { Flyer } from '../components/Flyer';
import { Bulletin, Masthead, PaperTab } from '../components/Bulletin';

type Filter = 'ALL' | 'SURGE' | 'SUSTAINMENT' | 'STALLED' | 'MET';
const FILTERS: Filter[] = ['ALL', 'SURGE', 'SUSTAINMENT', 'STALLED', 'MET'];

function matches(need: Need, filter: Filter): boolean {
  switch (filter) {
    case 'ALL': return true;
    case 'SURGE': return need.mode === 'surge';
    case 'SUSTAINMENT': return need.mode === 'sustainment';
    case 'STALLED': return need.status === 'stalled';
    case 'MET': return need.status === 'met';
    default: return true;
  }
}

function priority(need: Need): number {
  if (need.mode === 'surge') return 0;
  if (need.status === 'stalled') return 1;
  return 2;
}

export default function Board() {
  const { needs, people, role, acceptRep, waiveRep } = useDemo();
  const [filter, setFilter] = useState<Filter>('ALL');

  const ordered = [...needs]
    .filter((n) => matches(n, filter))
    .sort((a, b) => {
      const pa = priority(a);
      const pb = priority(b);
      if (pa !== pb) return pa - pb;
      return daysSince(b.submittedAt, DEMO_TODAY) - daysSince(a.submittedAt, DEMO_TODAY);
    });

  const metNeeds = needs.filter((n) => n.status === 'met');

  return (
    <Bulletin>
      <Masthead
        title="Needs Board"
        sub="Six needs. Five active, one met. One surge. One stalled."
      />

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {FILTERS.map((f) => (
          <PaperTab
            key={f}
            active={filter === f}
            onClick={() => setFilter(f)}
            tilt={f === 'ALL' ? '-0.6deg' : f === 'MET' ? '0.8deg' : '0.3deg'}
          >
            {f}
          </PaperTab>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-8 lg:gap-x-8 lg:gap-y-10">
          {ordered.map((need) => (
            <div key={need.id} className="relative">
              {need.mode === 'surge' ? <Ann route="board" n={2} className="-left-5 top-3" warm /> : null}
              {need.status === 'stalled' ? <Ann route="board" n={1} className="-left-5 top-3" warm /> : null}
              <NeedCard need={need} />
            </div>
          ))}
          {ordered.length === 0 ? (
            <p className="font-mono text-sm text-warm-ink-2 sm:col-span-2">
              No needs match this filter.
            </p>
          ) : null}
        </div>

        <aside className="space-y-8 lg:col-span-4">
          {role === 'resident' ? (
            <div className="relative">
              <Ann route="board" n={3} className="-left-5 top-2" warm />
              <Flyer id="board-rep" paper={PAPER.masthead}>
                <RepCard
                  variant="compact"
                  onAccept={acceptRep}
                  onWaive={waiveRep}
                  className="rounded-none border-0 bg-transparent p-0 hover:bg-transparent"
                />
              </Flyer>
            </div>
          ) : null}

          <Flyer id="board-capacity" paper={PAPER.cream}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-warm-ink-2">
              Town capacity
            </h2>
            <ul className="mt-3 space-y-1.5 font-mono text-sm text-warm-ink">
              <li>{people.length} RESIDENTS REGISTERED</li>
              <li>{equipment.length} ASSETS REGISTERED</li>
              <li>{quals.length} QUALS IN CIRCULATION</li>
              <li>{squads.length} SQUADS</li>
            </ul>
            <Link to="/registry" className="mt-3 inline-block text-sm text-warm-stamp hover:underline">
              View registry →
            </Link>
          </Flyer>

          <Flyer id="board-wall" paper={PAPER.green}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-warm-ink-2">
              This month on the wall
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm text-warm-ink">
              {metNeeds.map((n) => (
                <li key={n.id}>{n.title}</li>
              ))}
            </ul>
            <Link to="/wall" className="mt-3 inline-block text-sm text-warm-stamp hover:underline">
              See the wall →
            </Link>
          </Flyer>
        </aside>
      </div>
    </Bulletin>
  );
}
