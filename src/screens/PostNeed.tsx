// Post a Need (spec §7.3). Three stages on one route. The decomposition is
// purely setTimeout-driven — no network, and it can never fail live.

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NeedMode } from '../types';
import { needs, tasks as seedTasks } from '../data/seed';
import { fmtDuration } from '../lib/format';
import { QualBadge } from '../components/QualBadge';
import { MaterielChip } from '../components/MaterielChip';

type Stage = 'compose' | 'decomposing' | 'done';

const PLACEHOLDER =
  "e.g. The Middle Fork came up over the bank behind the Hansen place. Basement's flooded, there's mud through the ground floor, and they've got a seven-year-old.";

const hansen = needs.find((n) => n.id === 'need-hansen-flood')!;
const hansenTasks = seedTasks.filter((t) => t.needId === 'need-hansen-flood');

// Summary counts derive from the parsed tasks (not hardcoded).
const truckCount = hansenTasks.filter((t) => t.requiredEquipment.includes('truck-tow')).length;
const pumpCount = hansenTasks.filter((t) => t.requiredQuals.includes('pump-operator')).length;
const blockedCount = hansenTasks.filter((t) => t.status === 'blocked').length;
const SUMMARY = `${hansenTasks.length} TASKS · ${truckCount} REQUIRE A TRUCK · ${pumpCount} REQUIRES A PUMP OPERATOR · ${blockedCount} BLOCKED ON MATERIEL`;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function PostNeed() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [mode, setMode] = useState<NeedMode>('surge');
  const [stage, setStage] = useState<Stage>('compose');
  const [statusLine, setStatusLine] = useState('');
  const [revealed, setRevealed] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function schedule(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function decompose() {
    setStage('decomposing');
    setRevealed(0);
    setShowSummary(false);

    if (prefersReducedMotion()) {
      setStatusLine('11 TASKABLE UNITS IDENTIFIED');
      schedule(() => {
        setRevealed(hansenTasks.length);
        setShowSummary(true);
        setStage('done');
      }, 400);
      return;
    }

    schedule(() => setStatusLine('PARSING REQUIREMENTS…'), 300);
    schedule(() => setStatusLine('MATCHING AGAINST REGISTRY…'), 800);
    schedule(() => setStatusLine('11 TASKABLE UNITS IDENTIFIED'), 1300);
    hansenTasks.forEach((_, i) => {
      schedule(() => setRevealed(i + 1), 1500 + i * 90);
    });
    const end = 1500 + hansenTasks.length * 90;
    schedule(() => {
      setShowSummary(true);
      setStage('done');
    }, end);
  }

  function startOver() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage('compose');
    setStatusLine('');
    setRevealed(0);
    setShowSummary(false);
  }

  const locked = stage !== 'compose';

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold text-ops-text">Post a need</h1>
      <p className="mt-1 text-ops-text-2">
        Describe it the way you'd say it out loud. We'll break it into taskable units.
      </p>

      <div className="relative mt-5">
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          disabled={locked}
          className="w-full resize-none rounded-ops border border-ops-border bg-ops-surface p-3 font-mono text-[0.9375rem] text-ops-text placeholder:text-ops-text-3 focus:border-ops-accent focus:outline-none"
          style={{ opacity: locked ? 0.6 : 1 }}
        />
        {stage === 'decomposing' && !prefersReducedMotion() ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-ops">
            <div
              className="absolute left-0 right-0 h-0.5 bg-ops-accent"
              style={{ animation: 'scanline 600ms ease-out forwards' }}
            />
          </div>
        ) : null}
      </div>

      {stage === 'compose' ? (
        <div className="mt-4 flex flex-wrap items-end gap-6">
          <label className="flex flex-col">
            <span className="mb-1 font-mono text-[11px] uppercase tracking-wider text-ops-text-3">Requester</span>
            <select
              className="rounded-ops border border-ops-border bg-ops-surface px-3 py-2 text-sm text-ops-text focus:border-ops-accent focus:outline-none"
              defaultValue="org-pcem"
            >
              <option value="org-pcem">Park County Emergency Management</option>
            </select>
          </label>

          <fieldset className="flex flex-col">
            <span className="mb-1 font-mono text-[11px] uppercase tracking-wider text-ops-text-3">Mode</span>
            <div className="flex gap-4">
              {(['sustainment', 'surge'] as NeedMode[]).map((m) => (
                <label key={m} className="flex items-center gap-1.5 text-sm text-ops-text-2">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === m}
                    onChange={() => setMode(m)}
                    className="accent-ops-accent"
                  />
                  {m === 'surge' ? 'Surge' : 'Sustainment'}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={() => setText(hansen.rawText)}
            className="rounded-ops border border-ops-border px-3 py-2 text-sm text-ops-text-2 hover:border-ops-text-3 hover:text-ops-text"
          >
            Use the Hansen flood
          </button>

          <button
            type="button"
            onClick={decompose}
            className="ml-auto rounded-ops bg-ops-accent px-4 py-2 text-sm font-medium text-ops-bg hover:brightness-110"
          >
            Decompose
          </button>
        </div>
      ) : null}

      {stage !== 'compose' ? (
        <div className="mt-4 font-mono text-sm uppercase tracking-wider text-ops-accent">{statusLine}</div>
      ) : null}

      {revealed > 0 ? (
        <div className="mt-4 space-y-2">
          {hansenTasks.slice(0, revealed).map((t) => (
            <div
              key={t.id}
              className="animate-task-reveal flex items-start justify-between gap-4 rounded-ops border border-ops-border bg-ops-surface p-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-ops-text">{t.title}</h3>
                  <button
                    type="button"
                    title="Edit title"
                    className="text-ops-text-3 hover:text-ops-text"
                    onClick={(e) => (e.currentTarget.closest('div')?.querySelector('h3') as HTMLElement | null)?.focus()}
                    aria-label="Edit title"
                  >
                    ✎
                  </button>
                </div>
                {(t.requiredQuals.length > 0 || t.requiredEquipment.length > 0) && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {t.requiredQuals.map((q) => (
                      <QualBadge key={q} qualId={q} size="sm" />
                    ))}
                    {t.requiredEquipment.map((eq) => (
                      <MaterielChip key={eq} type={eq} />
                    ))}
                  </div>
                )}
              </div>
              <div className="shrink-0 text-right font-mono text-[11px] uppercase tracking-wider text-ops-text-3">
                {fmtDuration(t.durationMin)} · {t.peopleNeeded} NEEDED
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {showSummary ? (
        <div className="mt-4 rounded-ops border border-ops-border bg-ops-raised p-3 font-mono text-sm text-ops-text">
          {SUMMARY}
        </div>
      ) : null}

      {stage === 'done' ? (
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/need/hansen-flood')}
            className="rounded-ops bg-ops-accent px-4 py-2 text-sm font-medium text-ops-bg hover:brightness-110"
          >
            Post to the board
          </button>
          <button
            type="button"
            onClick={startOver}
            className="rounded-ops border border-ops-border px-4 py-2 text-sm text-ops-text-2 hover:border-ops-text-3 hover:text-ops-text"
          >
            Start over
          </button>
        </div>
      ) : null}
    </div>
  );
}
