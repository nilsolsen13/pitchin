// The Wall (spec §7.9). Warm palette content inside the retained ops shell.
// Least interactive screen: paper on a wall. No individual show-rates anywhere.
// AAR text is verbatim (A.10). "Still open" lists Hansen, Vasquez, interpreter.

import { useDemo } from '../state/DemoState';
import { aars, merchants, orgs, squads } from '../data/seed';
import { DEMO_TODAY } from '../data/seed';
import {
  commitmentsForNeed, outcomeCount, peopleCommitted,
} from '../lib/derive';
import { daysBetween, daysSince, fmtLongNoYear, fmtMonthYearUpper } from '../lib/format';
import { Ann } from '../components/Ann';

function needById(needs: ReturnType<typeof useDemo>['needs'], id: string) {
  return needs.find((n) => n.id === id)!;
}

export default function Wall() {
  const { needs, tasks, commitments } = useDemo();
  const duthie = needById(needs, 'need-duthie-ramp');
  const hansen = needById(needs, 'need-hansen-flood');
  const vasquez = needById(needs, 'need-vasquez-plow');
  const interpreter = needById(needs, 'need-interpreter-desk');
  const aar = aars[0];

  const duthieResidents = peopleCommitted('need-duthie-ramp', tasks);
  const duthieCommits = commitmentsForNeed('need-duthie-ramp', commitments, tasks);
  const duthieKept = outcomeCount(duthieCommits, 'kept');
  const duthieWaived = outcomeCount(duthieCommits, 'waived');
  const metInDays = duthie.metAt ? daysBetween(duthie.submittedAt, duthie.metAt) : 0;
  const church = orgs.find((o) => o.id === duthie.requesterOrgId);

  const aarBlocks: { label: string; body: string }[] = [
    { label: 'WHAT WAS NEEDED', body: aar.whatWasNeeded },
    { label: 'WHO TURNED OUT', body: aar.whoTurnedOut },
    { label: 'WHAT IT TOOK', body: aar.whatItTook },
    { label: "WHAT WE'D DO DIFFERENTLY", body: aar.whatWeDoDifferently },
  ];

  return (
    <div data-surface="warm" className="-mx-8 -my-8 min-h-[calc(100vh-100px)] bg-canvas px-8 py-12 text-warm-ink">
      <div className="mx-auto max-w-content">
        {/* Masthead */}
        <header>
          <h1 className="font-display text-5xl font-bold uppercase tracking-[0.08em] text-warm-ink">
            The Wall
          </h1>
          <div className="mt-2 h-[3px] w-40 bg-warm-stamp" />
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-warm-ink-2">
            SOUTH PARK, COLORADO · {fmtMonthYearUpper(DEMO_TODAY)} · POSTED AT THE LIBRARY, TWEEK BROS., AND THE HARDWARE STORE
          </p>
        </header>

        {/* Section 1 — MET THIS MONTH */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-warm-stamp">
            Met this month
          </h2>
          <div className="mt-3 rounded-warm border border-warm-rule bg-warm-paper-deep p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-semibold text-warm-ink">{duthie.title}</h3>
              <span
                className="shrink-0 border-2 border-warm-green px-3 py-1 font-display text-sm font-bold uppercase tracking-[0.08em] text-warm-green"
                style={{ transform: 'rotate(-6deg)' }}
              >
                MET · {fmtLongNoYear(duthie.metAt ?? DEMO_TODAY).toUpperCase()}
              </span>
            </div>
            <p className="mt-3 text-warm-ink-2">
              Requested by {church?.name ?? 'the parish'}. Posted {fmtLongNoYear(duthie.submittedAt)}. Met in {metInDays} days.
            </p>
            <p className="mt-2 font-mono text-sm text-warm-ink">
              Turned out: {duthieResidents} residents · {duthieCommits.length} commitments · {duthieKept} kept, {duthieWaived} waived
            </p>
          </div>
        </section>

        {/* Section 2 — AFTER-ACTION REPORT */}
        <section className="relative mt-10">
          <Ann route="wall" n={1} className="-left-6 top-1" warm />
          <h2 className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-warm-stamp">
            After-action report
          </h2>
          <div className="mt-3 space-y-5 rounded-warm border border-warm-rule bg-warm-paper-deep p-6">
            {aarBlocks.map((b) => (
              <div key={b.label} className="relative">
                {b.label === "WHAT WE'D DO DIFFERENTLY" ? (
                  <Ann route="wall" n={2} className="-left-6 top-0" warm />
                ) : null}
                <div className="font-display text-sm font-semibold uppercase tracking-[0.06em] text-warm-stamp">
                  {b.label}
                </div>
                <p className="mt-1 leading-relaxed text-warm-ink">{b.body}</p>
              </div>
            ))}
            <p className="pt-2 font-mono text-sm text-warm-ink-2">
              — Filed by Priya Raghavan, Creek Side · 5 March 2026
            </p>
          </div>
        </section>

        {/* Section 3 — STILL OPEN */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-warm-stamp">
            Still open
          </h2>
          <ul className="mt-3 divide-y divide-warm-rule border-y border-warm-rule">
            <li className="flex flex-wrap items-baseline justify-between gap-2 py-3">
              <span className="text-warm-ink">{hansen.title}</span>
              <span className="font-mono text-sm text-warm-ink-2">{daysSince(hansen.submittedAt, DEMO_TODAY)} DAYS OPEN</span>
            </li>
            <li className="flex flex-wrap items-baseline justify-between gap-2 py-3">
              <span className="text-warm-ink">{vasquez.title}</span>
              <span className="font-mono text-sm font-medium text-warm-stamp">
                {daysSince(vasquez.submittedAt, DEMO_TODAY)} DAYS · NEEDS A PLOW TRUCK ON THE TARRYALL SIDE
              </span>
            </li>
            <li className="flex flex-wrap items-baseline justify-between gap-2 py-3">
              <span className="text-warm-ink">{interpreter.title}</span>
              <span className="font-mono text-sm text-warm-ink-2">{daysSince(interpreter.submittedAt, DEMO_TODAY)} DAYS OPEN</span>
            </li>
          </ul>
        </section>

        {/* Section 4 — SQUADS */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-warm-stamp">
            Squads
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {squads.map((s) => (
              <div key={s.id} className="rounded-warm border border-warm-rule bg-warm-paper-deep p-4 text-center">
                <div className="font-display text-5xl font-bold text-warm-ink">{s.streakWeeks}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
                  WEEKS · {s.name}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-xs text-warm-ink-2">Streaks are held by the squad.</p>
        </section>

        {/* Section 5 — HONORED LOCALLY */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-warm-stamp">
            Honored locally
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {merchants.map((m) => (
              <div key={m.id} className="rounded-warm border border-warm-rule bg-warm-paper-deep p-4">
                <div className="font-display text-base font-semibold uppercase tracking-[0.04em] text-warm-ink">
                  {m.business}
                </div>
                <p className="mt-1.5 text-warm-ink">{m.offer}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">{m.honoredFor}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm italic text-warm-ink-2">
            Kept small and local on purpose. The reward is recognition by your own town, not a gift-card economy.
          </p>
        </section>

        <footer className="mt-12 border-t border-warm-rule pt-4 font-mono text-sm text-warm-ink-2">
          The digital system exists to feed this board.
        </footer>
      </div>
    </div>
  );
}
