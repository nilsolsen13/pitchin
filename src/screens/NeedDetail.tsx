// Need Detail (spec §7.4). Derived progress strip, grouped task list, and
// role-gated Claim / Verify actions with the exact tooltips (§3.1, AGENTS 3).

import { useParams } from 'react-router-dom';
import type { Equipment, Person, Task, TaskStatus } from '../types';
import { useDemo } from '../state/DemoState';
import { equipment as seedEquipment, orgs, quals, squads } from '../data/seed';
import { DEMO_TODAY } from '../data/seed';
import { daysBetween, daysSince, fmtShort } from '../lib/format';
import {
  capacityGaps, peopleCommitted, personHours, tasksForNeed, tasksVerified,
} from '../lib/derive';
import { ModeBadge } from '../components/ModeBadge';
import { StatusChip } from '../components/StatusChip';
import { StatCard } from '../components/StatCard';
import { TaskRow } from '../components/TaskRow';
import { Ann } from '../components/Ann';

const CLAIM_TOAST = 'COMMITMENT LOGGED · THU 12 MAR · COUNTS TOWARD YOUR SHOW-RATE';
const GROUP_ORDER: TaskStatus[] = ['blocked', 'open', 'claimed', 'in_progress', 'verified', 'missed'];

function fmtHours(h: number): string {
  return Number.isInteger(h) ? String(h) : h.toFixed(2).replace(/\.?0+$/, '');
}

function squadHasEquipment(
  person: Person,
  type: Equipment['type'],
  equipment: Equipment[],
): boolean {
  const squad = squads.find((s) => s.id === person.squadId);
  const memberIds = squad ? squad.memberIds : [];
  return equipment.some(
    (e) => e.type === type && e.ownerId !== null && (e.ownerId === person.id || memberIds.includes(e.ownerId)),
  );
}

function claimEval(person: Person, task: Task, equipment: Equipment[]) {
  const missingQual = task.requiredQuals.find((q) => !person.quals.includes(q));
  const missingEquip = task.requiredEquipment.find((t) => !squadHasEquipment(person, t, equipment));
  if (missingQual) {
    const qual = quals.find((q) => q.id === missingQual);
    return {
      can: false,
      tooltip: `Requires ${qual?.name ?? missingQual}. Earned by demonstration — see the registry.`,
    };
  }
  if (missingEquip) {
    return { can: false, tooltip: `Requires access to a registered ${missingEquip.replace('-', ' ')}.` };
  }
  return { can: true, tooltip: '' };
}

function ActionButton({ label, tooltip, enabled, onClick }: {
  label: string; tooltip?: string; enabled: boolean; onClick?: () => void;
}) {
  if (enabled) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="rounded-ops bg-ops-accent px-3 py-1.5 text-sm font-medium text-ops-bg hover:brightness-110"
      >
        {label}
      </button>
    );
  }
  return (
    <span title={tooltip} className="inline-block cursor-not-allowed">
      <button
        type="button"
        disabled
        className="rounded-ops border border-ops-border px-3 py-1.5 text-sm text-ops-text-3"
      >
        {label}
      </button>
    </span>
  );
}

export default function NeedDetail() {
  const { needId } = useParams();
  const { needs, tasks, people, role, claimTask, verifyTask } = useDemo();
  const need = needs.find((n) => n.id === needId);

  if (!need) {
    return <p className="font-mono text-sm text-ops-text-3">Need not found.</p>;
  }

  const org = orgs.find((o) => o.id === need.requesterOrgId);
  const nora = people.find((p) => p.id === 'p-beckett')!;
  const nTasks = tasksForNeed(need.id, tasks);
  const daysOpen = need.metAt ? daysBetween(need.submittedAt, need.metAt) : daysSince(need.submittedAt, DEMO_TODAY);

  const grouped = GROUP_ORDER
    .map((status) => ({ status, items: nTasks.filter((t) => t.status === status) }))
    .filter((g) => g.items.length > 0);

  function actionFor(task: Task) {
    if (task.status === 'open' && role === 'resident') {
      const ev = claimEval(nora, task, seedEquipment);
      return (
        <ActionButton
          label="Claim"
          enabled={ev.can}
          tooltip={ev.tooltip}
          onClick={() => claimTask(task.id, nora.id, CLAIM_TOAST)}
        />
      );
    }
    if (task.status === 'in_progress') {
      const canVerify = role === 'requester' && need!.requesterOrgId === 'org-pcem';
      return (
        <ActionButton
          label="Verify"
          enabled={canVerify}
          tooltip="Only the requester can verify a task."
          onClick={() => verifyTask(task.id)}
        />
      );
    }
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <ModeBadge mode={need.mode} />
        <StatusChip status={need.status} />
      </div>
      <h1 className="mt-2.5 text-3xl font-semibold text-ops-text">{need.title}</h1>
      <div className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-ops-text-3">
        REQUESTED BY {org?.name ?? need.requesterOrgId} · POSTED {fmtShort(need.submittedAt)} · {daysOpen} DAYS OPEN
      </div>

      <div className="relative mt-4 rounded-ops border border-l-[3px] border-ops-border border-l-ops-accent bg-ops-raised p-4">
        <Ann route="need" n={1} className="-left-6 top-3" />
        <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">
          AS SUBMITTED
        </div>
        <p className="italic text-ops-text-2">{need.rawText}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="TASKS VERIFIED" value={`${tasksVerified(need.id, tasks)}/${nTasks.length}`} />
        <StatCard label="PEOPLE COMMITTED" value={peopleCommitted(need.id, tasks)} />
        <StatCard label="PERSON-HOURS COMMITTED" value={fmtHours(personHours(need.id, tasks))} />
        <StatCard label="CAPACITY GAPS" value={capacityGaps(need.id, tasks)} accent={capacityGaps(need.id, tasks) > 0} />
      </div>

      <div className="mt-8 space-y-6">
        {grouped.map((g) => (
          <section key={g.status} className="relative">
            {g.status === 'in_progress' ? <Ann route="need" n={2} className="-left-6 top-0" /> : null}
            {g.status === 'blocked' ? <Ann route="need" n={3} className="-left-6 top-0" /> : null}
            <h2 className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">
              {(g.status === 'in_progress' ? 'IN PROGRESS' : g.status.toUpperCase())} · {g.items.length}
            </h2>
            <div className="space-y-3">
              {g.items.map((task) => (
                <TaskRow key={task.id} task={task} people={people} action={actionFor(task)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
