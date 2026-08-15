// StatusChip (spec §6.5). Dot + uppercase mono label, 11px, letterspaced.
// Handles both TaskStatus and NeedStatus.

import type { NeedStatus, TaskStatus } from '../types';

const COLORS: Record<TaskStatus | NeedStatus, string> = {
  // TaskStatus
  open: '#6E7C8C',
  claimed: '#4C8DD9',
  in_progress: '#E8A33D',
  verified: '#3FA66A',
  missed: '#C4544A',
  blocked: '#C4544A',
  // NeedStatus (open / in_progress shared above)
  staffing: '#4C8DD9',
  met: '#3FA66A',
  stalled: '#C4544A',
};

const LABELS: Partial<Record<TaskStatus | NeedStatus, string>> = {
  in_progress: 'IN PROGRESS',
};

function label(status: TaskStatus | NeedStatus): string {
  return LABELS[status] ?? status.toUpperCase();
}

export function StatusChip({ status }: { status: TaskStatus | NeedStatus }) {
  const color = COLORS[status];
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em]">
      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span style={{ color }}>{label(status)}</span>
    </span>
  );
}
