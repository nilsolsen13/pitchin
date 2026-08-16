// NeedCard (spec §6.5, §7.2). Board flyer: mode, status, title, requester,
// progress bar, unfilled-requirement chips. Stalled cards get a blocked border
// and the capacity-gap diagnosis. Do not soften the stalled card (AGENTS rule 2).

import type { EquipmentType, Need, QualId } from '../types';
import { useDemo } from '../state/DemoState';
import { orgs } from '../data/seed';
import { DEMO_TODAY } from '../data/seed';
import { daysSince } from '../lib/format';
import { tasksForNeed, tasksVerified } from '../lib/derive';
import { ModeBadge } from './ModeBadge';
import { StatusChip } from './StatusChip';
import { QualBadge } from './QualBadge';
import { MaterielChip } from './MaterielChip';
import { PAPER } from '../lib/paper';
import { Flyer } from './Flyer';

// §7.2 board diagnosis for the stalled Vasquez need (literal copy).
const STALLED_DIAGNOSIS =
  'CAPACITY GAP — both plow-equipped trucks registered to Kenosha Pass, 22 min from Tarryall Rd.';

function paperFor(need: Need): string {
  if (need.status === 'stalled') return PAPER.rose;
  if (need.status === 'met') return PAPER.green;
  if (need.mode === 'surge') return PAPER.yellow;
  return PAPER.cream;
}

export function NeedCard({ need }: { need: Need }) {
  const { tasks } = useDemo();
  const org = orgs.find((o) => o.id === need.requesterOrgId);
  const nTasks = tasksForNeed(need.id, tasks);
  const verified = tasksVerified(need.id, tasks);
  const total = nTasks.length;
  const pct = total === 0 ? 0 : (verified / total) * 100;
  const days = daysSince(need.submittedAt, DEMO_TODAY);
  const stalled = need.status === 'stalled';

  const quals = new Set<QualId>();
  const materiel = new Set<EquipmentType>();
  for (const t of nTasks) {
    if (t.status === 'verified') continue;
    t.requiredQuals.forEach((q) => quals.add(q));
    t.requiredEquipment.forEach((e) => materiel.add(e));
  }
  const chips: { kind: 'qual' | 'materiel'; id: string }[] = [
    ...[...quals].map((q) => ({ kind: 'qual' as const, id: q })),
    ...[...materiel].map((m) => ({ kind: 'materiel' as const, id: m })),
  ];
  const shown = chips.slice(0, 4);
  const more = chips.length - shown.length;

  return (
    <Flyer
      id={need.id}
      paper={paperFor(need)}
      tape={need.mode === 'surge'}
      to={`/need/${need.id.replace(/^need-/, '')}`}
      className={`text-warm-ink${stalled ? ' board-flyer-stalled' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <ModeBadge mode={need.mode} />
        <StatusChip status={need.status} />
      </div>

      <h3 className="mt-2.5 text-lg font-semibold leading-snug text-warm-ink">{need.title}</h3>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
        {org?.name ?? need.requesterOrgId} · posted {days} day{days === 1 ? '' : 's'} ago
      </div>

      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden bg-[#d9cbb3]">
          <div className="h-full bg-status-verified" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
          {verified}/{total} TASKS VERIFIED
        </div>
      </div>

      {shown.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {shown.map((c) =>
            c.kind === 'qual' ? (
              <QualBadge key={`q-${c.id}`} qualId={c.id as QualId} size="sm" />
            ) : (
              <MaterielChip key={`m-${c.id}`} type={c.id as EquipmentType} />
            ),
          )}
          {more > 0 ? (
            <span className="font-mono text-[11px] text-warm-ink-2">+{more} more</span>
          ) : null}
        </div>
      )}

      {stalled ? (
        <div className="mt-3 font-mono text-[11px] leading-relaxed text-status-blocked">
          {STALLED_DIAGNOSIS}
        </div>
      ) : null}
    </Flyer>
  );
}
