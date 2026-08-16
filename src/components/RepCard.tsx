// RepCard (spec §6.5, §7.5). The weekly rep, three active states + waived/
// accepted. The shrinking-ask copy is prescribed and must not be softened,
// guilted, or reworded (AGENTS rule 4).

import { Link } from 'react-router-dom';
import type { RepState } from '../types';
import { useDemo } from '../state/DemoState';

interface RepContent {
  headline: string;
  meta: string;
  body: string;
}

const EYEBROW = 'YOUR REP · THURSDAY 12 MARCH · 6:00 PM';

const CONTENT: Record<'STANDARD' | 'SCOPED_DOWN' | 'KEEP_THE_CHAIN', RepContent> = {
  STANDARD: {
    headline: 'Walk the Tarryall Road culverts and photograph any blockage.',
    meta: '20 MINUTES · WITH JUNIE SPARKS',
    body: 'Same time, same partner, every week. Nothing to decide.',
  },
  SCOPED_DOWN: {
    headline: "Check the Stark's Pond warming hut is stocked.",
    meta: '10 MINUTES · WITH JUNIE SPARKS',
    body: "You missed last week, so this one's smaller. No need to make it up.",
  },
  KEEP_THE_CHAIN: {
    headline: "Call Alma Duthie and confirm she's got groceries through the weekend.",
    meta: '5 MINUTES · WITH JUNIE SPARKS · CREEK SIDE',
    body: "You've missed the last two. That happens. This one is five minutes — enough to keep the chain alive.",
  },
};

export function RepCard({
  variant = 'large',
  state,
  onAccept,
  onWaive,
}: {
  variant?: 'large' | 'compact';
  state?: RepState;
  onAccept?: () => void;
  onWaive?: () => void;
}) {
  const ctx = useDemo();
  const repState = state ?? ctx.repState;

  if (repState === 'WAIVED') {
    return (
      <div className="rounded-ops border border-ops-border bg-ops-surface p-5">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">{EYEBROW}</div>
        <p className="mt-2 text-lg text-ops-text">Noted. Nothing counts against you. Junie's covering the call.</p>
      </div>
    );
  }

  if (repState === 'ACCEPTED') {
    return (
      <div className="rounded-ops border border-ops-border bg-ops-surface p-5">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-status-verified">REP ACCEPTED</div>
        <p className="mt-2 text-lg text-ops-text">You're on it. Thursday at 6:00 PM with Junie.</p>
      </div>
    );
  }

  const c = CONTENT[repState];

  if (variant === 'compact') {
    return (
      <Link
        to="/me"
        className="block rounded-ops border border-ops-border bg-ops-surface p-4 transition-colors hover:bg-ops-raised"
      >
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">
          YOUR REP THIS WEEK
        </div>
        <p className="mt-1.5 text-sm font-medium text-ops-text">{c.headline}</p>
        <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-ops-accent">{c.meta}</div>
      </Link>
    );
  }

  return (
    <div className="rounded-ops border border-ops-border bg-ops-surface p-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">{EYEBROW}</div>
      <h2 className="mt-3 text-2xl font-semibold leading-snug text-ops-text">{c.headline}</h2>
      <div className="mt-3 font-mono text-xs uppercase tracking-wider text-ops-accent">{c.meta}</div>
      <p className="mt-3 text-ops-text-2">{c.body}</p>
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={onAccept}
          className="rounded-ops bg-ops-accent px-4 py-2 text-sm font-medium text-ops-bg hover:brightness-110"
        >
          I'm on it
        </button>
        <button
          type="button"
          onClick={onWaive}
          className="rounded-ops border border-ops-border px-4 py-2 text-sm text-ops-text-2 hover:border-ops-text-3 hover:text-ops-text"
        >
          Can't this week
        </button>
      </div>
    </div>
  );
}
