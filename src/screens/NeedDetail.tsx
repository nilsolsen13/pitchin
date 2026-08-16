// Need Detail (spec §7.4). Derived progress strip, grouped task list, and
// role-gated Claim / Verify actions with the exact tooltips (§3.1, AGENTS 3).

import { useParams } from 'react-router-dom';
import type { Equipment, Person, Task, TaskStatus } from '../types';
import { useDemo } from '../state/DemoState';
import { equipment as seedEquipment, orgs, quals } from '../data/seed';
import { DEMO_TODAY } from '../data/seed';
import { daysBetween, daysSince, fmtShort } from '../lib/format';
import {
  capacityGaps, peopleCommitted, personHours, squadHasEquipment, tasksForNeed, tasksVerified,
} from '../lib/derive';
import { PAPER } from '../lib/paper';
import { ModeBadge } from '../components/ModeBadge';
import { StatusChip } from '../components/StatusChip';
import { StatCard } from '../components/StatCard';
import { TaskRow } from '../components/TaskRow';
import { Ann } from '../components/Ann';
import { Flyer } from '../components/Flyer';
import { Photo } from '../components/Photo';
import { Bulletin, Masthead } from '../components/Bulletin';
import { PHOTOS } from '../data/photos';

const CLAIM_TOAST = 'COMMITMENT LOGGED · THU 12 MAR · COUNTS TOWARD YOUR SHOW-RATE';
const GROUP_ORDER: TaskStatus[] = ['blocked', 'open', 'claimed', 'in_progress', 'verified', 'missed'];

function fmtHours(h: number): string {
  return Number.isInteger(h) ? String(h) : h.toFixed(2).replace(/\.?0+$/, '');
}

function claimEval(person: Person, task: Task, people: Person[], equipment: Equipment[]) {
  const missingQual = task.requiredQuals.find((q) => !person.quals.includes(q));
  const missingEquip = task.requiredEquipment.find((t) => !squadHasEquipment(person, t, people, equipment));
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
      <button type="button" onClick={onClick} className="paper-btn">
        {label}
      </button>
    );
  }
  return (
    <span title={tooltip} className="inline-block cursor-not-allowed">
      <button type="button" disabled className="paper-btn-ghost opacity-60">
        {label}
      </button>
    </span>
  );
}

export default function NeedDetail() {
  const { needId } = useParams();
  const { needs, tasks, people, role, claimTask, verifyTask } = useDemo();
  // Accept both the full seed id ("need-hansen-flood") and the spec's short
  // slug ("hansen-flood", used in §7.3 / §7.4 and Appendix C's refresh test).
  const need = needs.find((n) => n.id === needId || n.id.replace(/^need-/, '') === needId);

  if (!need) {
    return (
      <Bulletin>
        <p className="font-mono text-sm text-warm-ink-2">Need not found.</p>
      </Bulletin>
    );
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
      const ev = claimEval(nora, task, people, seedEquipment);
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
    <Bulletin>
      <Masthead
        title={need.title}
        sub={
          <div className="flex flex-wrap items-center justify-center gap-2">
            <ModeBadge mode={need.mode} />
            <StatusChip status={need.status} />
            <span className="font-mono text-[11px] uppercase tracking-wider">
              REQUESTED BY {org?.name ?? need.requesterOrgId} · POSTED {fmtShort(need.submittedAt)} · {daysOpen} DAYS OPEN
            </span>
          </div>
        }
      />

      <div className="relative mx-auto mt-8 max-w-3xl">
        <Ann route="need" n={1} className="-left-6 top-3" />
        <Flyer id="need-submitted" paper={PAPER.cream}>
          <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-warm-ink-2">
            AS SUBMITTED
          </div>
          <p className="italic text-warm-ink">{need.rawText}</p>
        </Flyer>
      </div>

      {need.id === 'need-hansen-flood' ? (
        <div className="mt-8">
          <div className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-[#f4efe4]/80">
            FILED WITH THE REQUEST
          </div>
          <div className="flex flex-wrap items-start justify-center gap-6">
            <Photo
              src={PHOTOS.floodInterior.src}
              alt={PHOTOS.floodInterior.alt}
              caption={PHOTOS.floodInterior.caption}
              width="md"
              tilt={-3}
            />
            <Photo
              src={PHOTOS.muckout.src}
              alt={PHOTOS.muckout.alt}
              caption={PHOTOS.muckout.caption}
              width="md"
              tilt={1}
            />
            <Photo
              src={PHOTOS.debrisHaul.src}
              alt={PHOTOS.debrisHaul.alt}
              caption={PHOTOS.debrisHaul.caption}
              width="md"
              tilt={-1}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <StatCard label="TASKS VERIFIED" value={`${tasksVerified(need.id, tasks)}/${nTasks.length}`} />
        <StatCard label="PEOPLE COMMITTED" value={peopleCommitted(need.id, tasks)} />
        <StatCard label="PERSON-HOURS COMMITTED" value={fmtHours(personHours(need.id, tasks))} />
        <StatCard label="CAPACITY GAPS" value={capacityGaps(need.id, tasks)} accent={capacityGaps(need.id, tasks) > 0} />
      </div>

      <div className="mt-10 space-y-8">
        {grouped.map((g) => (
          <section key={g.status} className="relative">
            {g.status === 'in_progress' ? <Ann route="need" n={2} className="-left-6 top-0" /> : null}
            {g.status === 'blocked' ? <Ann route="need" n={3} className="-left-6 top-0" /> : null}
            <h2 className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-[#f4efe4]/80">
              {(g.status === 'in_progress' ? 'IN PROGRESS' : g.status.toUpperCase())} · {g.items.length}
            </h2>
            <div className="space-y-5">
              {g.items.map((task) => (
                <TaskRow key={task.id} task={task} people={people} action={actionFor(task)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Bulletin>
  );
}
