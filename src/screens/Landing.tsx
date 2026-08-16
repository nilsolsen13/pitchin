// Landing (spec §7.0). Warm palette, no shell. The only screen that argues
// rather than demonstrates. All copy is verbatim.

import { Link, useNavigate } from 'react-router-dom';
import type { Role } from '../types';
import { useDemo } from '../state/DemoState';
import { Bulletin } from '../components/Bulletin';
import { Flyer } from '../components/Flyer';
import { Photo } from '../components/Photo';
import { PHOTOS } from '../data/photos';
import { PAPER } from '../lib/paper';
import { SiteFooter, TAGLINE } from '../components/Tagline';

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

const SCREENS: { name: string; href: string; description: string; role?: Role }[] = [
  {
    name: 'THE BOARD',
    href: '/board',
    description:
      'Six needs from the county, a church, a school, a ball club, and a neighbor. One of them is stuck, and the board says why.',
  },
  {
    name: 'POST A NEED',
    href: '/post',
    description:
      'Describe a flood in plain English and watch it become eleven staffable tasks with skill and equipment requirements.',
  },
  {
    name: 'A NEED, IN DEPTH',
    href: '/need/hansen-flood',
    description:
      'Who has turned out, what is still open, and the one task nobody in town is equipped to do.',
  },
  {
    name: 'THE WEEKLY REP',
    href: '/me',
    role: 'resident',
    description:
      'Twenty minutes, fixed time, named partner. Miss a week and the system shrinks the ask instead of guilting you.',
  },
  {
    name: 'REWARDS',
    href: '/rewards',
    role: 'resident',
    description:
      'What local businesses honor for showing up, and which of those currently apply to you.',
  },
  {
    name: 'THE CALENDAR',
    href: '/calendar',
    role: 'resident',
    description:
      'What you have signed up for, what you have already done, and what is open to someone with your quals.',
  },
  {
    name: 'A SQUAD',
    href: '/squad/creek-side',
    description:
      'Four to eight neighbors. Streaks belong to the squad, so a bad month gets carried instead of punished.',
  },
  {
    name: 'THE REGISTRY',
    href: '/registry',
    description:
      'What the town actually owns. Four generators, one bilingual paramedic, and three pumps with one qualified operator.',
  },
  {
    name: 'READINESS',
    href: '/readiness',
    role: 'admin',
    description:
      'What a county buys: show-rate, retention, time-to-met, and capacity gaps named specifically enough to fix.',
  },
  {
    name: 'THE WALL',
    href: '/wall',
    description:
      'The public board. What got met this month, who met it, and an after-action report that admits what went wrong.',
  },
];

export default function Landing() {
  return (
    <Bulletin full>
      <div className="grid items-start gap-8 lg:grid-cols-12">
        <Flyer id="landing-hero" paper={PAPER.masthead} className="!p-8 lg:col-span-7">
          <h1 className="wordmark text-6xl leading-tight text-warm-ink">
            PitchIn
          </h1>
          <div className="mt-4 h-[3px] w-[120px] bg-warm-stamp" />
          <p className="mt-5 max-w-[40rem] font-display text-xl font-semibold leading-snug tracking-[0.02em] text-warm-stamp">
            {TAGLINE}
          </p>
          <p className="mt-6 max-w-[46rem] text-xl leading-relaxed text-warm-ink">
            A town's unmet needs, matched to the capabilities its residents actually have — and a
            reward for the one thing civic life never measures: showing up when you said you would,
            week after week.
          </p>
        </Flyer>
        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <Photo
            src={PHOTOS.sandbagLine.src}
            alt={PHOTOS.sandbagLine.alt}
            caption={PHOTOS.sandbagLine.caption}
            width="lg"
            tilt={-2}
          />
        </div>
      </div>

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

      <div className="mt-10">
        <Flyer id="landing-index" paper={PAPER.cream} className="!p-8">
          <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.06em] text-warm-stamp">
            WHAT YOU'RE ABOUT TO SEE
          </h2>
          <p className="mt-3 max-w-[46rem] font-normal text-warm-ink-2">
            A working prototype of a town that already runs this way. Ten screens, seeded with one Colorado town's real-shaped data. Every number on every dashboard is derived from that data, not typed in.
          </p>
          <ol className="mt-8 grid grid-cols-1 gap-x-10 gap-y-5 min-[800px]:grid-cols-2">
            {SCREENS.map((s) => (
              <li key={s.href}>
                <IndexLink href={s.href} role={s.role}>
                  {s.name}
                </IndexLink>
                <p className="mt-1 text-warm-ink-2">{s.description}</p>
              </li>
            ))}
          </ol>
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
        <SiteFooter surface="warm" />
      </div>
    </Bulletin>
  );
}

function IndexLink({
  href,
  role,
  children,
}: {
  href: string;
  role?: Role;
  children: string;
}) {
  const { setRole } = useDemo();
  const navigate = useNavigate();

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        if (role) setRole(role);
        navigate(href);
      }}
      className="font-display font-semibold uppercase text-warm-ink hover:underline"
    >
      {children}
    </a>
  );
}
