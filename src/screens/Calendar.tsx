// Calendar (Increment 2 §2.4). Nora's service over time: signed-up, done,
// and open to her quals. Month grid is CSS grid + civil-date arithmetic —
// no Date(), no calendar library. Export buttons are honestly unwired.

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { CalendarEntry, CalendarEntryOutcome, QualId } from '../types';
import { useDemo } from '../state/DemoState';
import { equipment as seedEquipment } from '../data/seed';
import { DEMO_TODAY } from '../data/seed';
import {
  entriesInMonth, historyFor, opportunitiesFor, showRate, upcomingFor,
} from '../lib/derive';
import { dayNumber, fmtDuration, fmtMonthYearUpper, fmtPctInt, fmtShort, parseISODate } from '../lib/format';
import { PAPER } from '../lib/paper';
import { QualBadge } from '../components/QualBadge';
import { Ann } from '../components/Ann';
import { Flyer } from '../components/Flyer';
import { Bulletin, Masthead } from '../components/Bulletin';

const CLAIM_TOAST = 'COMMITMENT LOGGED · THU 12 MAR · COUNTS TOWARD YOUR SHOW-RATE';
const WEB_CAL = 'webcal://pitchin.town/south-park/nora-beckett.ics';
const EXPORTS = ['Google Calendar', 'Outlook', 'Apple Calendar', 'Download .ics'] as const;

const MIN_MONTH = { y: 2025, m: 12 };
const MAX_MONTH = { y: 2026, m: 4 };
const DEFAULT_MONTH = { y: 2026, m: 3 };

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const CHIP: Record<CalendarEntryOutcome, string> = {
  kept: 'bg-status-verified text-[#F4EFE4]',
  missed: 'bg-status-missed text-[#F4EFE4]',
  waived: 'bg-status-open text-[#F4EFE4]',
  pending: 'bg-ops-accent text-[#0E1116]',
  open: 'border border-dashed border-warm-rule bg-transparent text-warm-ink-2',
};

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function isoDate(y: number, m: number, d: number): string {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

function daysInMonth(y: number, m: number): number {
  if (m === 2) {
    const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
    return leap ? 29 : 28;
  }
  return [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

function addMonths(y: number, m: number, delta: number): { y: number; m: number } {
  const idx = y * 12 + (m - 1) + delta;
  return { y: Math.floor(idx / 12), m: (idx % 12) + 1 };
}

function monthCmp(a: { y: number; m: number }, b: { y: number; m: number }): number {
  return a.y !== b.y ? a.y - b.y : a.m - b.m;
}

// Sunday-first index. 1970-01-01 is Thursday; (dayNumber + 4) % 7 → Sun=0.
function sundayIndex(iso: string): number {
  return (((dayNumber(iso) + 4) % 7) + 7) % 7;
}

interface DayCell {
  iso: string;
  inMonth: boolean;
}

function monthCells(y: number, m: number): DayCell[] {
  const leading = sundayIndex(isoDate(y, m, 1));
  const dim = daysInMonth(y, m);
  const prev = addMonths(y, m, -1);
  const prevDim = daysInMonth(prev.y, prev.m);
  const cells: DayCell[] = [];
  for (let i = 0; i < leading; i++) {
    cells.push({ iso: isoDate(prev.y, prev.m, prevDim - leading + 1 + i), inMonth: false });
  }
  for (let d = 1; d <= dim; d++) {
    cells.push({ iso: isoDate(y, m, d), inMonth: true });
  }
  const next = addMonths(y, m, 1);
  let trail = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ iso: isoDate(next.y, next.m, trail), inMonth: false });
    trail += 1;
  }
  return cells;
}

function needHref(needId: string): string {
  return `/need/${needId.replace(/^need-/, '')}`;
}

export default function Calendar() {
  const { people, tasks, needs, commitments, claimTask } = useDemo();
  const navigate = useNavigate();
  const nora = people.find((p) => p.id === 'p-beckett')!;
  const [month, setMonth] = useState(DEFAULT_MONTH);
  const [exportOpen, setExportOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const upcoming = upcomingFor(nora.id, commitments, tasks, needs, people);
  const history = historyFor(nora.id, commitments, tasks, needs, people);
  const opps = opportunitiesFor(nora.id, tasks, needs, people, seedEquipment);
  const byDay = entriesInMonth(month.y, month.m, [...upcoming, ...history, ...opps]);
  const cells = monthCells(month.y, month.m);
  const atMin = monthCmp(month, MIN_MONTH) <= 0;
  const atMax = monthCmp(month, MAX_MONTH) >= 0;
  const kept = nora.keptCount;
  const missed = nora.missedCount;
  const rate = fmtPctInt(showRate(nora));

  function closeExport() {
    setExportOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!exportOpen) return;
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setExportOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [exportOpen]);

  function openExport(btn: HTMLButtonElement) {
    triggerRef.current = btn;
    setExportOpen(true);
  }

  function go(delta: number) {
    const next = addMonths(month.y, month.m, delta);
    if (monthCmp(next, MIN_MONTH) < 0 || monthCmp(next, MAX_MONTH) > 0) return;
    setMonth(next);
  }

  function openNeed(needId: string) {
    navigate(needHref(needId));
  }

  return (
    <Bulletin>
      <div className="relative">
        <Masthead
          title="Calendar"
          sub="Your reps, your commitments, and what's open to you."
        />
        <div className="pointer-events-none absolute right-0 top-0 hidden font-mono text-xs uppercase tracking-wider text-[#f4efe4]/90 sm:block">
          NORA BECKETT · CREEK SIDE
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-xs uppercase tracking-wider text-[#f4efe4]/90 sm:hidden">
        NORA BECKETT · CREEK SIDE
      </p>

      <div className="relative mt-8">
        <Ann route="calendar" n={1} className="-left-6 top-3" />
        <Flyer id="cal-export" paper={PAPER.cream}>
          <div className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-warm-ink-2">
            ADD TO YOUR OWN CALENDAR
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {EXPORTS.map((label) => (
              <button
                key={label}
                type="button"
                className="paper-btn-ghost"
                onClick={(e) => openExport(e.currentTarget)}
              >
                {label}
              </button>
            ))}
          </div>
        </Flyer>
      </div>

      <Flyer id="cal-grid" paper={PAPER.cream} className="mt-8 !p-5">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            aria-label="Previous month"
            disabled={atMin}
            onClick={() => go(-1)}
            className="paper-btn-ghost px-3 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </button>
          <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.06em] text-warm-ink">
            {fmtMonthYearUpper(isoDate(month.y, month.m, 1))}
          </h2>
          <button
            type="button"
            aria-label="Next month"
            disabled={atMax}
            onClick={() => go(1)}
            className="paper-btn-ghost px-3 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ›
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-px bg-warm-rule">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="bg-warm-paper py-1.5 text-center font-mono text-[0.6875rem] uppercase tracking-wider text-warm-ink-2"
            >
              {d}
            </div>
          ))}
          {cells.map((cell) => {
            const dayEntries = cell.inMonth ? (byDay.get(cell.iso) ?? []) : [];
            const shown = dayEntries.slice(0, 3);
            const extra = dayEntries.length - shown.length;
            const today = cell.iso === DEMO_TODAY;
            const { d } = parseISODate(cell.iso);
            return (
              <div
                key={cell.iso}
                className={`min-h-[6.5rem] bg-warm-paper p-1.5 ${
                  cell.inMonth ? '' : 'opacity-[0.35]'
                } ${today ? 'border-2 border-warm-stamp' : ''}`}
              >
                <div
                  className={`font-mono text-xs ${
                    today ? 'text-warm-stamp' : 'text-warm-ink-2'
                  }`}
                >
                  {d}
                </div>
                {cell.inMonth ? (
                  <div className="mt-1 space-y-0.5">
                    {shown.map((e) => (
                      <DayChip key={e.id} entry={e} onOpenNeed={openNeed} />
                    ))}
                    {extra > 0 ? (
                      <div className="font-mono text-[0.625rem] text-warm-ink-2">+{extra}</div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-wider text-warm-ink-2">
          <LegendSwatch className="bg-status-verified" label="KEPT" />
          <LegendSwatch className="bg-status-missed" label="MISSED" />
          <LegendSwatch className="bg-status-open" label="WAIVED" />
          <LegendSwatch className="bg-ops-accent" label="COMMITTED" />
          <LegendSwatch className="border border-dashed border-warm-rule bg-transparent" label="OPEN TO YOU" />
        </ul>
      </Flyer>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-[#f4efe4]">
          UPCOMING — WHAT YOU'VE SIGNED UP FOR{' '}
          <span className="font-mono text-sm font-normal tracking-wider">
            {upcoming.length}
          </span>
        </h2>
        <Flyer id="cal-upcoming" paper={PAPER.cream} className="mt-3 !p-0">
          {upcoming.length === 0 ? (
            <p className="px-5 py-4 text-warm-ink-2">
              Nothing on the books. Your rep is the standing one.
            </p>
          ) : (
            <ul className="divide-y divide-warm-rule">
              {upcoming.map((e) => (
                <li key={e.id}>
                  <EntryRow entry={e} />
                </li>
              ))}
            </ul>
          )}
        </Flyer>
      </section>

      <section className="relative mt-10">
        <Ann route="calendar" n={2} className="-left-6 top-0" />
        <h2 className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-[#f4efe4]">
          OPEN TO YOU{' '}
          <span className="font-mono text-sm font-normal tracking-wider">{opps.length}</span>
        </h2>
        <p className="mt-1 text-warm-ink-2">
          You see these because you hold the quals they require. Quals are earned by demonstration, not requested.
        </p>
        <Flyer id="cal-opps" paper={PAPER.cream} className="mt-3 !p-0">
          {opps.length === 0 ? (
            <p className="px-5 py-4 text-warm-ink-2">Nothing open matches your quals right now.</p>
          ) : (
            <ul className="divide-y divide-warm-rule">
              {opps.map((e) => {
                const task = tasks.find((t) => t.id === e.id);
                const quals = (task?.requiredQuals ?? []) as QualId[];
                return (
                  <li key={e.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <EntryRow entry={e} unscheduled={e.date === null} nested />
                      {quals.length > 0 ? (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {quals.map((q) => (
                            <QualBadge key={q} qualId={q} size="sm" />
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="paper-btn shrink-0"
                      onClick={() => claimTask(e.id, nora.id, CLAIM_TOAST)}
                    >
                      Claim
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Flyer>
      </section>

      <section className="relative mt-10">
        <Ann route="calendar" n={3} className="-left-6 top-0" />
        <h2 className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-[#f4efe4]">
          COMPLETED — YOUR RECORD{' '}
          <span className="font-mono text-sm font-normal tracking-wider">{history.length}</span>
        </h2>
        <p className="mt-1 font-mono text-sm text-[#f4efe4]/90">
          {kept} KEPT · {missed} MISSED · SHOW-RATE {rate}
        </p>
        <p className="mt-1 text-warm-ink-2">
          A waived commitment counts against nobody. It is neither kept nor missed.
        </p>
        <Flyer id="cal-history" paper={PAPER.cream} className="mt-3 !p-0">
          {history.length === 0 ? (
            <p className="px-5 py-4 text-warm-ink-2">No completed commitments on record yet.</p>
          ) : (
            <ul className="divide-y divide-warm-rule">
              {history.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <EntryRow entry={e} nested />
                  <OutcomeChip outcome={e.outcome} />
                </li>
              ))}
            </ul>
          )}
        </Flyer>
      </section>

      {exportOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a1a0c]/50 p-4"
          onClick={closeExport}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cal-export-title"
            className="relative w-full max-w-[30rem] rounded-warm bg-warm-paper p-6 text-warm-ink shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="cal-export-title"
              className="font-display text-xl font-semibold uppercase tracking-[0.06em] text-warm-stamp"
            >
              NOT WIRED IN THIS PROTOTYPE
            </h2>
            <p className="mt-3 leading-relaxed">
              In production, PitchIn publishes a personal subscription feed. Your weekly rep, anything you've claimed, and any surge callout appear in your own calendar automatically — and update themselves when the schedule changes, so nobody re-imports anything.
            </p>
            <p className="mt-4 select-all border border-warm-rule bg-[#fbf6ea] px-3 py-2 font-mono text-sm text-warm-ink-2">
              {WEB_CAL}
            </p>
            <button
              ref={closeRef}
              type="button"
              className="paper-btn mt-5"
              onClick={closeExport}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </Bulletin>
  );
}

function DayChip({
  entry,
  onOpenNeed,
}: {
  entry: CalendarEntry;
  onOpenNeed: (needId: string) => void;
}) {
  const cls = `block w-full truncate rounded-[2px] px-1 py-0.5 text-left font-mono text-[10px] leading-tight ${CHIP[entry.outcome]}`;
  if (entry.needId) {
    return (
      <button
        type="button"
        title={entry.title}
        className={cls}
        onClick={() => onOpenNeed(entry.needId!)}
      >
        {entry.title}
      </button>
    );
  }
  return (
    <span title={entry.title} className={cls}>
      {entry.title}
    </span>
  );
}

function EntryRow({
  entry,
  unscheduled = false,
  nested = false,
}: {
  entry: CalendarEntry;
  unscheduled?: boolean;
  nested?: boolean;
}) {
  const pad = nested ? '' : 'px-5 py-3';
  return (
    <div className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 ${pad}`}>
      <span className="w-28 shrink-0 font-mono text-sm text-warm-ink-2">
        {unscheduled || entry.date === null ? '—' : fmtShort(entry.date)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-warm-ink">{entry.title}</div>
        {entry.needId && entry.needTitle ? (
          <Link to={needHref(entry.needId)} className="text-sm text-warm-stamp hover:underline">
            {entry.needTitle}
          </Link>
        ) : null}
        {entry.partnerName ? (
          <div className="text-sm text-warm-ink-2">with {entry.partnerName}</div>
        ) : null}
        {entry.recurrenceNote ? (
          <div className="font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
            {entry.recurrenceNote}
          </div>
        ) : null}
        {unscheduled ? (
          <div className="font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
            NOT YET SCHEDULED
          </div>
        ) : null}
      </div>
      <span className="font-mono text-sm text-warm-ink-2">{fmtDuration(entry.durationMin)}</span>
    </div>
  );
}

function OutcomeChip({ outcome }: { outcome: CalendarEntryOutcome }) {
  const label =
    outcome === 'kept' ? 'KEPT' : outcome === 'missed' ? 'MISSED' : outcome === 'waived' ? 'WAIVED' : outcome.toUpperCase();
  const cls = CHIP[outcome] ?? CHIP.pending;
  return (
    <span className={`rounded-[2px] px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider ${cls}`}>
      {label}
    </span>
  );
}

function LegendSwatch({ className, label }: { className: string; label: string }) {
  return (
    <li className="inline-flex items-center gap-2">
      <span className={`inline-block h-2.5 w-2.5 ${className}`} aria-hidden />
      {label}
    </li>
  );
}
