// Needs Board (spec §7.2). Filters, ordered cards, right rail. Real state.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Need } from '../types';
import { useDemo } from '../state/DemoState';
import { equipment, quals, squads } from '../data/seed';
import { DEMO_TODAY } from '../data/seed';
import { daysSince } from '../lib/format';
import { NeedCard } from '../components/NeedCard';
import { RepCard } from '../components/RepCard';
import { Ann } from '../components/Ann';

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

// surge first, then stalled, then by age descending (oldest first).
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
    <div>
      <header>
        <h1 className="text-3xl font-semibold text-ops-text">Needs Board</h1>
        <p className="mt-1 text-ops-text-2">
          Six needs. Five active, one met. One surge. One stalled.
        </p>
      </header>

      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider transition-colors ${
              filter === f
                ? 'border-ops-accent bg-ops-accent/15 text-ops-accent'
                : 'border-ops-border text-ops-text-2 hover:text-ops-text'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          {ordered.map((need) => (
            <div key={need.id} className="relative">
              {need.mode === 'surge' ? <Ann route="board" n={2} className="-left-6 top-4" /> : null}
              {need.status === 'stalled' ? <Ann route="board" n={1} className="-left-6 top-4" /> : null}
              <NeedCard need={need} />
            </div>
          ))}
          {ordered.length === 0 ? (
            <p className="font-mono text-sm text-ops-text-3">No needs match this filter.</p>
          ) : null}
        </div>

        <aside className="space-y-6 lg:col-span-4">
          {role === 'resident' ? (
            <div className="relative">
              <Ann route="board" n={3} className="-left-6 top-2" />
              <RepCard variant="compact" onAccept={acceptRep} onWaive={waiveRep} />
            </div>
          ) : null}

          <div className="rounded-ops border border-ops-border bg-ops-surface p-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">
              Town capacity
            </h2>
            <ul className="mt-3 space-y-1.5 font-mono text-sm text-ops-text">
              <li>{people.length} RESIDENTS REGISTERED</li>
              <li>{equipment.length} ASSETS REGISTERED</li>
              <li>{quals.length} QUALS IN CIRCULATION</li>
              <li>{squads.length} SQUADS</li>
            </ul>
            <Link to="/registry" className="mt-3 inline-block text-sm text-ops-accent hover:underline">
              View registry →
            </Link>
          </div>

          <div className="rounded-ops border border-ops-border bg-ops-surface p-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">
              This month on the wall
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm text-ops-text-2">
              {metNeeds.map((n) => (
                <li key={n.id}>{n.title}</li>
              ))}
            </ul>
            <Link to="/wall" className="mt-3 inline-block text-sm text-ops-accent hover:underline">
              See the wall →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
