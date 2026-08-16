// Rewards (moved off The Wall). Local merchant honors keyed to reliability.
// Eligibility is derived from the viewer's streak, recent surge turnout, and
// whether their squad has filed an AAR. Tags and record lines are Increment 4
// §3.2; no countdown, no "weeks to go."

import { useDemo } from '../state/DemoState';
import { aars, merchants, squads } from '../data/seed';
import { honorsFor, recentSurgeNeed, squadAar } from '../lib/derive';
import type { HonorTag } from '../types';
import { PAPER } from '../lib/paper';
import { Flyer } from '../components/Flyer';
import { Bulletin, Masthead } from '../components/Bulletin';

const TAG_LABEL: Record<HonorTag, string> = {
  available: 'AVAILABLE TO YOU',
  'not-yet': 'NOT YET',
  squad: 'SQUAD',
};

export default function Rewards() {
  const { role, people, needs, tasks } = useDemo();
  const nora = people.find((p) => p.id === 'p-beckett')!;
  const creekSide = squads.find((s) => s.id === 'creek-side')!;
  const viewingResident = role === 'resident';

  const honors = viewingResident
    ? honorsFor(nora, creekSide, merchants, needs, tasks, aars)
    : merchants.map((merchant) => ({
        merchant,
        tag: 'not-yet' as const,
        eligible: false,
        record: merchant.honoredFor,
      }));

  const surge = viewingResident ? recentSurgeNeed(nora.id, needs, tasks) : null;
  const aar = viewingResident ? squadAar(creekSide, aars) : null;

  return (
    <Bulletin>
      <Masthead
        title="Rewards"
        sub="Honored locally. Keyed to reliability, not volume."
      />

      {viewingResident ? (
        <section className="mt-10">
          <h2 className="mb-4 text-center font-display text-lg font-semibold uppercase tracking-[0.06em] text-[#f4efe4]">
            Your record
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Flyer id="reward-streak" paper={PAPER.cream}>
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-warm-ink-2">
                Unbroken streak
              </div>
              <div className="mt-1 font-mono text-4xl text-warm-ink">{nora.streakWeeks}</div>
              <div className="mt-1 font-mono text-xs text-warm-ink-2">weeks</div>
            </Flyer>
            <Flyer id="reward-surge" paper={PAPER.cream}>
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-warm-ink-2">
                Surge, last 30 days
              </div>
              <div className="mt-1 font-display text-xl font-semibold text-warm-ink">
                {surge ? surge.title : 'None'}
              </div>
            </Flyer>
            <Flyer id="reward-aar" paper={PAPER.cream}>
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-warm-ink-2">
                Squad AAR
              </div>
              <div className="mt-1 font-display text-xl font-semibold text-warm-ink">
                {aar ? 'Filed' : 'Not filed'}
              </div>
              <div className="mt-1 font-mono text-xs text-warm-ink-2">{creekSide.name}</div>
            </Flyer>
          </div>
        </section>
      ) : (
        <p className="mt-10 text-center text-sm text-[#f4efe4]/80">
          These honors apply to residents. Switch to Resident to see which currently apply to you.
        </p>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-center font-display text-lg font-semibold uppercase tracking-[0.06em] text-[#f4efe4]">
          Honored locally
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {honors.map((h) => (
            <Flyer
              key={h.merchant.id}
              id={`reward-merchant-${h.merchant.id}`}
              paper={PAPER.yellow}
              className={viewingResident && !h.eligible ? 'opacity-[0.45]' : ''}
            >
              {viewingResident ? (
                <div className="font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
                  {TAG_LABEL[h.tag]}
                </div>
              ) : null}
              <div className="mt-1 font-display text-base font-semibold uppercase tracking-[0.04em] text-warm-ink">
                {h.merchant.business}
              </div>
              <p className="mt-1.5 text-warm-ink">{h.merchant.offer}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
                {h.merchant.honoredFor}
              </p>
              {viewingResident ? (
                <p className="mt-3 text-sm text-warm-ink-2">{h.record}</p>
              ) : null}
            </Flyer>
          ))}
        </div>
        <p className="mt-3 text-center text-sm italic text-[#f4efe4]/80">
          Kept small and local on purpose. A coffee is not payment for your time — it is your town noticing.
        </p>
      </section>
    </Bulletin>
  );
}
