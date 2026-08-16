// The Wall (spec §7.9). Cork bulletin + letterpress flyers. Least interactive
// screen: paper on a wall. No individual show-rates anywhere.
// AAR text is verbatim (A.10). "Still open" lists Hansen, Vasquez, interpreter.

import { useDemo } from '../state/DemoState';
import { aars, merchants, orgs, squads } from '../data/seed';
import { DEMO_TODAY } from '../data/seed';
import {
  commitmentsForNeed, outcomeCount, peopleCommitted,
} from '../lib/derive';
import { daysBetween, daysSince, fmtLongNoYear, fmtMonthYearUpper } from '../lib/format';
import { PAPER } from '../lib/paper';
import { Ann } from '../components/Ann';
import { Flyer } from '../components/Flyer';
import { Photo } from '../components/Photo';
import { Bulletin, Masthead } from '../components/Bulletin';
import { PHOTOS } from '../data/photos';

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
    <Bulletin>
      <Masthead
        title="The Wall"
        sub={`SOUTH PARK, COLORADO · ${fmtMonthYearUpper(DEMO_TODAY)} · POSTED AT THE LIBRARY, TWEEK BROS., AND THE HARDWARE STORE`}
      />

      <section className="mt-10">
        <h2 className="mb-4 text-center font-display text-lg font-semibold uppercase tracking-[0.06em] text-[#f4efe4]">
          Met this month
        </h2>
        <div className="flex flex-wrap items-start gap-6">
          <Flyer id="wall-duthie" paper={PAPER.green} className="min-w-0 flex-1 !p-6">
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
          </Flyer>
          <Photo
            src={PHOTOS.rampFinished.src}
            alt={PHOTOS.rampFinished.alt}
            caption={PHOTOS.rampFinished.caption}
            width="lg"
            tilt={1}
          />
        </div>
      </section>

      <section className="relative mt-10">
        <Ann route="wall" n={1} className="-left-6 top-1" />
        <h2 className="mb-4 text-center font-display text-lg font-semibold uppercase tracking-[0.06em] text-[#f4efe4]">
          After-action report
        </h2>
        <Flyer id="wall-aar" paper={PAPER.cream} className="!p-6 space-y-5">
          {aarBlocks.map((b) => (
            <div key={b.label} className="relative">
              {b.label === "WHAT WE'D DO DIFFERENTLY" ? (
                <Ann route="wall" n={2} className="-left-6 top-0" />
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
        </Flyer>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-center font-display text-lg font-semibold uppercase tracking-[0.06em] text-[#f4efe4]">
          Still open
        </h2>
        <Flyer id="wall-open" paper={PAPER.cream} className="!p-0">
          <ul className="divide-y divide-warm-rule">
            <li className="flex flex-wrap items-start gap-4 px-5 py-3">
              <div className="relative shrink-0">
                <Ann route="wall" n={3} className="-left-5 top-1" />
                <Photo
                  src={PHOTOS.debrisCarry.src}
                  alt={PHOTOS.debrisCarry.alt}
                  caption={PHOTOS.debrisCarry.caption}
                  width="md"
                  tilt={-2}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-2 pt-2">
                <span className="text-warm-ink">{hansen.title}</span>
                <span className="font-mono text-sm text-warm-ink-2">{daysSince(hansen.submittedAt, DEMO_TODAY)} DAYS OPEN</span>
              </div>
            </li>
            <li className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3">
              <span className="text-warm-ink">{vasquez.title}</span>
              <span className="font-mono text-sm font-medium text-warm-stamp">
                {daysSince(vasquez.submittedAt, DEMO_TODAY)} DAYS · NEEDS A PLOW TRUCK ON THE TARRYALL SIDE
              </span>
            </li>
            <li className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3">
              <span className="text-warm-ink">{interpreter.title}</span>
              <span className="font-mono text-sm text-warm-ink-2">{daysSince(interpreter.submittedAt, DEMO_TODAY)} DAYS OPEN</span>
            </li>
          </ul>
        </Flyer>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-center font-display text-lg font-semibold uppercase tracking-[0.06em] text-[#f4efe4]">
          Squads
        </h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {squads.map((s) => (
            <Flyer key={s.id} id={`wall-squad-${s.id}`} paper={PAPER.green} className="text-center">
              <div className="font-display text-5xl font-bold text-warm-ink">{s.streakWeeks}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
                WEEKS · {s.name}
              </div>
            </Flyer>
          ))}
        </div>
        <p className="mt-3 text-center font-mono text-xs text-[#f4efe4]/80">Streaks are held by the squad.</p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-center font-display text-lg font-semibold uppercase tracking-[0.06em] text-[#f4efe4]">
          Honored locally
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {merchants.map((m) => (
            <Flyer key={m.id} id={`wall-merchant-${m.id}`} paper={PAPER.yellow}>
              <div className="font-display text-base font-semibold uppercase tracking-[0.04em] text-warm-ink">
                {m.business}
              </div>
              <p className="mt-1.5 text-warm-ink">{m.offer}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">{m.honoredFor}</p>
            </Flyer>
          ))}
        </div>
        <p className="mt-3 text-center text-sm italic text-[#f4efe4]/80">
          Kept small and local on purpose. The reward is recognition by your own town, not a gift-card economy.
        </p>
      </section>

      <footer className="mt-12 text-center font-mono text-sm text-[#f4efe4]/80">
        The digital system exists to feed this board.
      </footer>
    </Bulletin>
  );
}
