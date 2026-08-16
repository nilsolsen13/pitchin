// Landing (spec §7.0). Warm palette, no shell. The only screen that argues
// rather than demonstrates. All copy is verbatim.

import { Link } from 'react-router-dom';
import { Bulletin } from '../components/Bulletin';
import { Flyer } from '../components/Flyer';
import { PAPER } from '../lib/paper';

const FAILURES: { label: string; body: string }[] = [
  {
    label: 'SUPPLY CHAIN',
    body: "Demand is unstructured. Capacity is invisible. Nobody knows who owns a welder, a truck, or fluent Spanish, so matching happens on whoever's group text.",
  },
  {
    label: 'LOOP CLOSURE',
    body: "Nobody reports the outcome, so effort disappears into a void and people don't come back.",
  },
  {
    label: 'CADENCE',
    body: 'Service is treated as episodic and heroic. We have excellent technology for building physical habits and essentially none for civic ones.',
  },
];

const TARGETS: string[] = [
  "Show-rate can't be farmed — commitments are capped at one rep a week.",
  'Tasks are verified by the requester, not self-reported.',
  'Rankings are squad-level, so individual glory-seeking has nowhere to go.',
  'Rewards stay symbolic and local, so no one has a financial reason to game them.',
];

export default function Landing() {
  return (
    <Bulletin full>
      <Flyer id="landing-hero" paper={PAPER.masthead} className="!p-8">
        <h1 className="wordmark text-6xl leading-tight text-warm-ink">
          PitchIn
        </h1>
        <div className="mt-4 h-[3px] w-[120px] bg-warm-stamp" />
        <p className="mt-6 max-w-[46rem] text-xl leading-relaxed text-warm-ink">
          A town's unmet needs, matched to the capabilities its residents actually have — and a
          reward for the one thing civic life never measures: showing up when you said you would,
          week after week.
        </p>
      </Flyer>

      <h2 className="mt-12 text-center font-display text-2xl font-semibold uppercase tracking-[0.04em] text-warm-ink">
        Civic volunteering does not fail on goodwill.
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {FAILURES.map((f) => (
          <Flyer key={f.label} id={`fail-${f.label}`} paper={PAPER.cream}>
            <div className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-warm-stamp">
              {f.label}
            </div>
            <p className="mt-2 leading-relaxed text-warm-ink-2">{f.body}</p>
          </Flyer>
        ))}
      </div>

      <div className="mt-10">
        <Flyer id="landing-claim" paper={PAPER.yellow} className="!p-8">
          <p className="text-center text-3xl leading-snug text-warm-ink">
            Volunteering forty hours once and then vanishing is worth less than twenty minutes a week
            for two years. PitchIn is the first system that says so out loud.
          </p>
        </Flyer>
      </div>

      <div className="mt-10">
        <Flyer id="landing-targets" paper={PAPER.cream} className="!p-8">
          <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.04em] text-warm-ink">
            Any metric becomes a target.
          </h2>
          <ul className="mt-8 space-y-4">
            {TARGETS.map((t) => (
              <li key={t} className="flex items-start gap-3 text-lg text-warm-ink">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 bg-warm-stamp" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[46rem] text-lg italic text-warm-ink-2">
            If we get this wrong, we crowd out the intrinsic motive and the whole thing dies. So the
            reward layer stays deliberately thin.
          </p>
        </Flyer>
      </div>

      <div className="mt-10 pb-8">
        <Flyer id="landing-cta" paper={PAPER.masthead} className="text-center">
          <Link
            to="/board"
            className="inline-block rounded-warm bg-warm-stamp px-6 py-3 font-display text-lg font-semibold uppercase tracking-[0.06em] text-warm-paper hover:brightness-110"
          >
            Enter South Park
          </Link>
          <p className="mt-4 font-mono text-sm text-warm-ink-2">
            Working prototype · South Park, Park County, Colorado · Pop. 4,187 · Thursday, March 12, 2026
          </p>
        </Flyer>
      </div>
    </Bulletin>
  );
}
