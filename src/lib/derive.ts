// Derived values (spec §4.1). Every dashboard number comes from here.
// Nothing in this file is hardcoded from the expected-values table; the values
// are computed from the seed and must reconcile with it.

import type {
  CalendarEntry, Commitment, Equipment, EquipmentType, ISODate, Need, Person, QualId, Squad, Task,
} from '../types';
import { DEMO_TODAY } from '../data/seed';
import { dayNumber } from './format';

const UTIL_WINDOW_DAYS = 90;

// ─── §4.1 core ────────────────────────────────────────────────────────────────

export function showRate(p: Person): number {
  const total = p.keptCount + p.missedCount;
  return total === 0 ? 0 : p.keptCount / total;
}

export function squadShowRate(s: Squad, people: Person[]): number {
  const members = people.filter((p) => s.memberIds.includes(p.id));
  const kept = members.reduce((a, p) => a + p.keptCount, 0);
  const missed = members.reduce((a, p) => a + p.missedCount, 0);
  const total = kept + missed;
  return total === 0 ? 0 : kept / total;
}

export function townShowRate(people: Person[]): number {
  const kept = people.reduce((a, p) => a + p.keptCount, 0);
  const missed = people.reduce((a, p) => a + p.missedCount, 0);
  const total = kept + missed;
  return total === 0 ? 0 : kept / total;
}

export function medianStreak(people: Person[]): number {
  const xs = people.map((p) => p.streakWeeks).sort((a, b) => a - b);
  const n = xs.length;
  if (n === 0) return 0;
  const mid = Math.floor(n / 2);
  return n % 2 === 0 ? (xs[mid - 1] + xs[mid]) / 2 : xs[mid];
}

export function qualHolders(qualId: QualId, people: Person[]): Person[] {
  return people.filter((p) => p.quals.includes(qualId));
}

export function equipmentCount(type: EquipmentType, equipment: Equipment[]): number {
  return equipment.filter((e) => e.type === type).length;
}

export function equipmentUtilization(equipment: Equipment[]): number {
  if (equipment.length === 0) return 0;
  const cutoff = dayNumber(DEMO_TODAY) - UTIL_WINDOW_DAYS;
  const used = equipment.filter(
    (e) => e.lastUsed !== null && dayNumber(e.lastUsed) >= cutoff,
  ).length;
  return used / equipment.length;
}

export function equipmentUsedCount(equipment: Equipment[]): number {
  const cutoff = dayNumber(DEMO_TODAY) - UTIL_WINDOW_DAYS;
  return equipment.filter(
    (e) => e.lastUsed !== null && dayNumber(e.lastUsed) >= cutoff,
  ).length;
}

// ─── Registry headline helpers ────────────────────────────────────────────────

// "1 bilingual paramedic" = holds spanish-interpreter AND wfr (Marisol Vega).
export function bilingualParamedics(people: Person[]): Person[] {
  return people.filter((p) => p.quals.includes('spanish-interpreter') && p.quals.includes('wfr'));
}

// ─── Need-level derivations (spec §7.4) ───────────────────────────────────────

export function tasksForNeed(needId: string, tasks: Task[]): Task[] {
  return tasks.filter((t) => t.needId === needId);
}

// PEOPLE COMMITTED = distinct assignees across the need's tasks.
export function peopleCommitted(needId: string, tasks: Task[]): number {
  const set = new Set<string>();
  for (const t of tasksForNeed(needId, tasks)) {
    for (const a of t.assigneeIds) set.add(a);
  }
  return set.size;
}

// PERSON-HOURS COMMITTED = Σ durationMin × assignees.length / 60.
export function personHours(needId: string, tasks: Task[]): number {
  const min = tasksForNeed(needId, tasks).reduce(
    (a, t) => a + t.durationMin * t.assigneeIds.length,
    0,
  );
  return min / 60;
}

export function tasksVerified(needId: string, tasks: Task[]): number {
  return tasksForNeed(needId, tasks).filter((t) => t.status === 'verified').length;
}

// CAPACITY GAPS = tasks with status blocked.
export function capacityGaps(needId: string, tasks: Task[]): number {
  return tasksForNeed(needId, tasks).filter((t) => t.status === 'blocked').length;
}

// ─── Commitment-level derivations ─────────────────────────────────────────────

// Commitments whose task belongs to a given need (via the task's needId).
export function commitmentsForNeed(
  needId: string,
  commitments: Commitment[],
  tasks: Task[],
): Commitment[] {
  const taskIds = new Set(tasksForNeed(needId, tasks).map((t) => t.id));
  return commitments.filter((c) => taskIds.has(c.taskId));
}

export function outcomeCount(
  commitments: Commitment[],
  outcome: Commitment['outcome'],
): number {
  return commitments.filter((c) => c.outcome === outcome).length;
}

// ─── Squad-level derivations (spec §7.6) ──────────────────────────────────────

export function squadQualsHeld(s: Squad, people: Person[]): QualId[] {
  const held = new Set<QualId>();
  for (const p of people.filter((x) => s.memberIds.includes(x.id))) {
    for (const q of p.quals) held.add(q);
  }
  return [...held];
}

export function squadAssets(s: Squad, equipment: Equipment[]): Equipment[] {
  return equipment.filter((e) => e.ownerId !== null && s.memberIds.includes(e.ownerId));
}

// ─── Claim eligibility (shared by Need Detail and Calendar opportunities) ────

export function squadHasEquipment(
  person: Person,
  type: EquipmentType,
  people: Person[],
  equipment: Equipment[],
): boolean {
  const mateIds = people.filter((p) => p.squadId === person.squadId).map((p) => p.id);
  return equipment.some(
    (e) => e.type === type && e.ownerId !== null && mateIds.includes(e.ownerId),
  );
}

export function canClaimTask(
  person: Person,
  task: Task,
  people: Person[],
  equipment: Equipment[],
): boolean {
  if (task.status !== 'open') return false;
  if (task.assigneeIds.includes(person.id)) return false;
  if (task.requiredQuals.some((q) => !person.quals.includes(q))) return false;
  if (task.requiredEquipment.some((t) => !squadHasEquipment(person, t, people, equipment))) {
    return false;
  }
  return true;
}

// ─── Calendar (Increment 2 §2.3) ─────────────────────────────────────────────

function dateAscNullsLast(a: ISODate | null, b: ISODate | null): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a.localeCompare(b);
}

function partnerNameOf(person: Person, people: Person[]): string | null {
  if (!person.partnerId) return null;
  return people.find((p) => p.id === person.partnerId)?.name ?? null;
}

function entryFromCommitment(
  c: Commitment,
  person: Person,
  tasks: Task[],
  needs: Need[],
  people: Person[],
): CalendarEntry {
  if (c.isWeeklyRep) {
    return {
      id: c.id,
      kind: 'rep',
      outcome: c.outcome,
      title: 'Weekly rep',
      date: c.dueAt.slice(0, 10),
      durationMin: c.scopeMinutes,
      needTitle: null,
      needId: null,
      partnerName: partnerNameOf(person, people),
      recurrenceNote: null,
    };
  }
  const task = tasks.find((t) => t.id === c.taskId);
  const need = task ? needs.find((n) => n.id === task.needId) : undefined;
  return {
    id: c.id,
    kind: 'commitment',
    outcome: c.outcome,
    title: task?.title ?? c.taskId,
    date: task?.scheduledDate ?? null,
    durationMin: c.scopeMinutes,
    needTitle: need?.title ?? null,
    needId: task?.needId ?? null,
    partnerName: null,
    recurrenceNote: task?.recurrenceNote ?? null,
  };
}

export function upcomingFor(
  personId: string,
  commitments: Commitment[],
  tasks: Task[],
  needs: Need[],
  people: Person[] = [],
): CalendarEntry[] {
  const person = people.find((p) => p.id === personId);
  const pending = commitments.filter((c) => c.personId === personId && c.outcome === 'pending');
  const entries = pending.map((c) =>
    entryFromCommitment(c, person ?? ({ id: personId, partnerId: null } as Person), tasks, needs, people),
  );
  return entries.sort((a, b) => dateAscNullsLast(a.date, b.date) || a.title.localeCompare(b.title));
}

export function historyFor(
  personId: string,
  commitments: Commitment[],
  tasks: Task[],
  needs: Need[],
  people: Person[] = [],
): CalendarEntry[] {
  const person = people.find((p) => p.id === personId);
  const done = commitments.filter(
    (c) => c.personId === personId && (c.outcome === 'kept' || c.outcome === 'missed' || c.outcome === 'waived'),
  );
  const entries = done.map((c) =>
    entryFromCommitment(c, person ?? ({ id: personId, partnerId: null } as Person), tasks, needs, people),
  );
  return entries.sort((a, b) => {
    if (a.date === null && b.date === null) return a.title.localeCompare(b.title);
    if (a.date === null) return 1;
    if (b.date === null) return -1;
    return b.date.localeCompare(a.date) || a.title.localeCompare(b.title);
  });
}

export function opportunitiesFor(
  personId: string,
  tasks: Task[],
  needs: Need[],
  people: Person[],
  equipment: Equipment[],
): CalendarEntry[] {
  const person = people.find((p) => p.id === personId);
  if (!person) return [];
  const open = tasks.filter((t) => canClaimTask(person, t, people, equipment));
  const entries: CalendarEntry[] = open.map((t) => {
    const need = needs.find((n) => n.id === t.needId);
    return {
      id: t.id,
      kind: 'opportunity',
      outcome: 'open',
      title: t.title,
      date: t.scheduledDate,
      durationMin: t.durationMin,
      needTitle: need?.title ?? null,
      needId: t.needId,
      partnerName: null,
      recurrenceNote: t.recurrenceNote,
    };
  });
  return entries.sort((a, b) => dateAscNullsLast(a.date, b.date) || a.title.localeCompare(b.title) || a.id.localeCompare(b.id));
}

export function entriesInMonth(
  year: number,
  month: number,
  entries: CalendarEntry[],
): Map<ISODate, CalendarEntry[]> {
  const prefix = `${year}-${String(month).padStart(2, '0')}-`;
  const map = new Map<ISODate, CalendarEntry[]>();
  for (const e of entries) {
    if (e.date === null || !e.date.startsWith(prefix)) continue;
    const list = map.get(e.date) ?? [];
    list.push(e);
    map.set(e.date, list);
  }
  return map;
}
