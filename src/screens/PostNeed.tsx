// Post a Need (spec §7.3). Three stages on one route. The decomposition is
// purely setTimeout-driven — no network, and it can never fail live.

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NeedMode } from '../types';
import { needs, tasks as seedTasks } from '../data/seed';
import { fmtDuration } from '../lib/format';
import { PAPER } from '../lib/paper';
import { QualBadge } from '../components/QualBadge';
import { MaterielChip } from '../components/MaterielChip';
import { Ann } from '../components/Ann';
import { Flyer } from '../components/Flyer';
import { Bulletin, Masthead } from '../components/Bulletin';

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
    <Bulletin>
      <Masthead
        title="Post a need"
        sub="Describe it the way you'd say it out loud. We'll break it into taskable units."
      />

      <div className="relative mx-auto mt-8 max-w-3xl">
        <Flyer id="post-compose" paper={PAPER.cream} className="!p-5">
          <div className="relative">
            <textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDER}
              disabled={locked}
              className="paper-input resize-none font-mono text-[0.9375rem]"
              style={{ opacity: locked ? 0.6 : 1 }}
            />
            {stage === 'decomposing' && !prefersReducedMotion() ? (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                  className="absolute left-0 right-0 h-0.5 bg-warm-stamp"
                  style={{ animation: 'scanline 600ms ease-out forwards' }}
                />
              </div>
            ) : null}
          </div>

          {stage === 'compose' ? (
            <div className="mt-4 flex flex-wrap items-end gap-6">
              <label className="flex flex-col">
                <span className="mb-1 font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">Requester</span>
                <select className="paper-select" defaultValue="org-pcem">
                  <option value="org-pcem">Park County Emergency Management</option>
                </select>
              </label>

              <fieldset className="flex flex-col">
                <span className="mb-1 font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">Mode</span>
                <div className="flex gap-4">
                  {(['sustainment', 'surge'] as NeedMode[]).map((m) => (
                    <label key={m} className="flex items-center gap-1.5 text-sm text-warm-ink">
                      <input
                        type="radio"
                        name="mode"
                        checked={mode === m}
                        onChange={() => setMode(m)}
                        className="accent-warm-stamp"
                      />
                      {m === 'surge' ? 'Surge' : 'Sustainment'}
                    </label>
                  ))}
                </div>
              </fieldset>

              <button type="button" onClick={() => setText(hansen.rawText)} className="paper-btn-ghost">
                Use the Hansen flood
              </button>

              <button type="button" onClick={decompose} className="paper-btn ml-auto">
                Decompose
              </button>
            </div>
          ) : null}
        </Flyer>
      </div>

      {stage !== 'compose' ? (
        <div className="relative mx-auto mt-6 max-w-3xl">
          <Ann route="post" n={1} className="-left-6 top-0" />
          <div className="text-center font-mono text-sm uppercase tracking-wider text-[#f4efe4]">
            {statusLine}
          </div>
        </div>
      ) : null}

      {revealed > 0 ? (
        <div className="mx-auto mt-6 max-w-3xl space-y-4">
          {hansenTasks.slice(0, revealed).map((t) => (
            <Flyer
              key={t.id}
              id={t.id}
              paper={t.status === 'blocked' ? PAPER.rose : PAPER.cream}
              className={`animate-task-reveal ${t.status === 'blocked' ? 'board-flyer-stalled' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-warm-ink">{t.title}</h3>
                    <button
                      type="button"
                      title="Edit title"
                      className="text-warm-ink-2 hover:text-warm-ink"
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
                <div className="shrink-0 text-right font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
                  {fmtDuration(t.durationMin)} · {t.peopleNeeded} NEEDED
                </div>
              </div>
            </Flyer>
          ))}
        </div>
      ) : null}

      {showSummary ? (
        <div className="relative mx-auto mt-6 max-w-3xl">
          <Ann route="post" n={2} className="-left-6 top-2" />
          <Flyer id="post-summary" paper={PAPER.yellow}>
            <div className="font-mono text-sm text-warm-ink">{SUMMARY}</div>
          </Flyer>
        </div>
      ) : null}

      {stage === 'done' ? (
        <div className="mx-auto mt-6 flex max-w-3xl gap-3">
          <button type="button" onClick={() => navigate('/need/hansen-flood')} className="paper-btn">
            Post to the board
          </button>
          <button type="button" onClick={startOver} className="paper-btn-ghost">
            Start over
          </button>
        </div>
      ) : null}
    </Bulletin>
  );
}
