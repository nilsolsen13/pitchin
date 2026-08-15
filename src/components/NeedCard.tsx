// NeedCard (spec §6.5, §7.2). Board card: mode, status, title, requester,
// progress bar, unfilled-requirement chips. Stalled cards get a blocked border
// and the capacity-gap diagnosis. Do not soften the stalled card (AGENTS rule 2).

import { Link } from 'react-router-dom';
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

// §7.2 board diagnosis for the stalled Vasquez need (literal copy).
const STALLED_DIAGNOSIS =
  'CAPACITY GAP — both plow-equipped trucks registered to Kenosha Pass, 22 min from Tarryall Rd.';

export function NeedCard({ need }: { need: Need }) {
  const { tasks } = useDemo();
  const org = orgs.find((o) => o.id === need.requesterOrgId);
  const nTasks = tasksForNeed(need.id, tasks);
  const verified = tasksVerified(need.id, tasks);
  const total = nTasks.length;
  const pct = total === 0 ? 0 : (verified / total) * 100;
  const days = daysSince(need.submittedAt, DEMO_TODAY);
  const stalled = need.status === 'stalled';

  // Unfilled requirements across not-yet-verified tasks.
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
    <Link
      to={`/need/${need.id}`}
      className="block rounded-ops border bg-ops-surface p-4 transition-colors hover:bg-ops-raised"
      style={
        stalled
          ? { borderColor: '#2A3441', borderLeft: '3px solid #C4544A' }
          : { borderColor: '#2A3441' }
      }
    >
      <div className="flex items-start justify-between gap-3">
        <ModeBadge mode={need.mode} />
        <StatusChip status={need.status} />
      </div>

      <h3 className="mt-2.5 text-lg font-semibold text-ops-text">{need.title}</h3>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ops-text-3">
        {org?.name ?? need.requesterOrgId} · posted {days} day{days === 1 ? '' : 's'} ago
      </div>

      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ops-raised">
          <div className="h-full rounded-full bg-status-verified" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ops-text-3">
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
            <span className="font-mono text-[11px] text-ops-text-3">+{more} more</span>
          ) : null}
        </div>
      )}

      {stalled ? (
        <div className="mt-3 font-mono text-[11px] leading-relaxed text-status-blocked">
          {STALLED_DIAGNOSIS}
        </div>
      ) : null}
    </Link>
  );
}
