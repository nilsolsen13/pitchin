// TaskRow (spec §6.5, §7.4). Title + detail, window/duration/peopleNeeded,
// qual + materiel chips, assignee avatars, and a role-dependent action slot.
// Blocked tasks show their blockReason in an inset panel.

import type { ReactNode } from 'react';
import type { Person, Task } from '../types';
import { fmtDuration } from '../lib/format';
import { StatusChip } from './StatusChip';
import { QualBadge } from './QualBadge';
import { MaterielChip } from './MaterielChip';
import { Avatar } from './Avatar';

export function TaskRow({
  task,
  people,
  action,
}: {
  task: Task;
  people: Person[];
  action?: ReactNode;
}) {
  const assignees = task.assigneeIds
    .map((id) => people.find((p) => p.id === id))
    .filter((p): p is Person => Boolean(p));
  const showFill =
    task.peopleNeeded > 1 &&
    task.assigneeIds.length > 0 &&
    task.assigneeIds.length < task.peopleNeeded;
  const blocked = task.status === 'blocked';

  return (
    <div
      className="rounded-ops border bg-ops-surface p-4"
      style={blocked ? { borderColor: '#C4544A' } : { borderColor: '#2A3441' }}
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <StatusChip status={task.status} />
            {showFill ? (
              <span className="font-mono text-[11px] uppercase tracking-wider text-ops-text-3">
                {task.assigneeIds.length} OF {task.peopleNeeded} FILLED
              </span>
            ) : null}
          </div>
          <h3 className="mt-1.5 text-base font-medium text-ops-text">{task.title}</h3>
          <p className="mt-0.5 text-sm text-ops-text-2">{task.detail}</p>

          {(task.requiredQuals.length > 0 || task.requiredEquipment.length > 0) && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {task.requiredQuals.map((q) => (
                <QualBadge key={q} qualId={q} size="sm" />
              ))}
              {task.requiredEquipment.map((e) => (
                <MaterielChip key={e} type={e} />
              ))}
            </div>
          )}

          {assignees.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {assignees.map((p) => (
                  <Avatar key={p.id} id={p.id} name={p.name} size={24} />
                ))}
              </div>
              <span className="font-mono text-[11px] text-ops-text-3">
                {assignees.map((p) => p.name).join(', ')}
              </span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2 text-right">
          <div className="font-mono text-[11px] uppercase tracking-wider text-ops-text-3">
            {task.window}
          </div>
          <div className="font-mono text-xs text-ops-text-2">
            {fmtDuration(task.durationMin)} · {task.peopleNeeded} NEEDED
          </div>
          {action}
        </div>
      </div>

      {blocked && task.blockReason ? (
        <div className="mt-3 rounded-ops border border-l-[3px] border-ops-border border-l-status-blocked bg-ops-raised p-3 font-mono text-xs leading-relaxed text-ops-text-2">
          {task.blockReason}
        </div>
      ) : null}
    </div>
  );
}
