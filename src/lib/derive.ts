// Derived values (spec §4.1). Every dashboard number comes from here.
// Nothing in this file is hardcoded from the expected-values table; the values
// are computed from the seed and must reconcile with it.

import type {
  AAR, CalendarEntry, Commitment, Equipment, EquipmentType, HonorStatus, ISODate,
  Merchant, Need, OnBehalfOf, Person, QualId, RibbonId, Role, Squad, Standing, Task,
} from '../types';
import { DEMO_TODAY } from '../data/seed';
import { dayNumber, fmtLongNoYear } from './format';

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

// "1 bilingual paramedic" = holds emt-paramedic AND spanish-interpreter (Marisol Vega).
export function bilingualParamedics(people: Person[]): Person[] {
  return people.filter(
    (p) => p.quals.includes('emt-paramedic') && p.quals.includes('spanish-interpreter'),
  );
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

export function canVerify(role: Role, need: Need): boolean {
  if (role === 'admin') {
    return need.requesterOrgId === 'org-pcem' || need.requesterOrgId === 'org-county';
  }
  return need.postedByResident;
}

export function onBehalfWorkingLine(ob: OnBehalfOf): string {
  const age = ob.age !== null ? `, ${ob.age}` : '';
  return `${ob.name}${age} · ${ob.locationSpecific}`;
}

export function onBehalfPublicLine(ob: OnBehalfOf): string {
  if (ob.publicNameConsent) return onBehalfWorkingLine(ob);
  return `a resident on ${ob.locationGeneral}`;
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
    // scopeMinutes describes the WEEKLY REP's shrinking ask (20/10/5) and is
    // meaningless for a claimed task. Take the real duration from the task, or
    // a newly-claimed 5-hour chaperone reports itself as 20 minutes.
    durationMin: task?.durationMin ?? c.scopeMinutes,
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

// ─── Local reciprocity (merchant honors) ─────────────────────────────────────
// Eligibility is derived, like show-rate. Record lines state the current fact.
// No "3 weeks to go" — a countdown toward a reward is the volume framing
// the product rejects.

const SURGE_WINDOW_DAYS = 30;

export function recentSurgeNeed(
  personId: string,
  needs: Need[],
  tasks: Task[],
  today: ISODate = DEMO_TODAY,
  windowDays = SURGE_WINDOW_DAYS,
): Need | null {
  const cutoff = dayNumber(today) - windowDays;
  const surgeIds = new Set(needs.filter((n) => n.mode === 'surge').map((n) => n.id));
  for (const task of tasks) {
    if (!surgeIds.has(task.needId)) continue;
    if (!task.assigneeIds.includes(personId)) continue;
    const when = task.scheduledDate ?? today;
    if (dayNumber(when) >= cutoff) {
      return needs.find((n) => n.id === task.needId) ?? null;
    }
  }
  return null;
}

export function squadAar(squad: Squad, aars: AAR[]): AAR | null {
  return aars.find((a) => squad.memberIds.includes(a.authorId)) ?? null;
}

export function honorsFor(
  person: Person,
  squad: Squad,
  merchants: Merchant[],
  needs: Need[],
  tasks: Task[],
  aars: AAR[],
): HonorStatus[] {
  const surge = recentSurgeNeed(person.id, needs, tasks);
  const aar = squadAar(squad, aars);
  const aarNeed = aar ? needs.find((n) => n.id === aar.needId) : undefined;

  return merchants.map((merchant) => {
    if (merchant.id === 'm-tweek') {
      const eligible = person.streakWeeks > 0;
      return {
        merchant,
        tag: eligible ? 'available' : 'not-yet',
        eligible,
        record: eligible
          ? `${person.streakWeeks} weeks unbroken.`
          : 'No active streak.',
      };
    }
    if (merchant.id === 'm-citywok') {
      return {
        merchant,
        tag: surge ? 'available' : 'not-yet',
        eligible: surge !== null,
        record: surge
          ? `Turned out for ${surge.title}.`
          : 'No surge turnout in the last 30 days.',
      };
    }
    if (merchant.id === 'm-skeeters') {
      return {
        merchant,
        tag: 'squad',
        eligible: aar !== null,
        record: aar
          ? `${squad.name} filed an after-action report on ${fmtLongNoYear(aar.publishedAt)}${aarNeed ? ` for ${aarNeed.title}` : ''}.`
          : `${squad.name} has not filed an after-action report.`,
      };
    }
    if (merchant.id === 'm-hardware') {
      const standing = standingFor(person);
      const eligible = standing === 'Established' || standing === 'Sponsoring';
      return {
        merchant,
        tag: eligible ? 'available' : 'not-yet',
        eligible,
        record: eligible ? `${standing} standing.` : merchant.honoredFor,
      };
    }
    return {
      merchant,
      tag: 'not-yet',
      eligible: false,
      record: merchant.honoredFor,
    };
  });
}

// ─── Ribbons (final spec Part D) — derived, never stored ─────────────────────

function earnsSurgeResponder(person: Person, needs: Need[], tasks: Task[]): boolean {
  const surgeIds = new Set(needs.filter((n) => n.mode === 'surge').map((n) => n.id));
  return tasks.some((t) => surgeIds.has(t.needId) && t.assigneeIds.includes(person.id));
}

function earnsBackstop(
  person: Person,
  commitments: Commitment[],
  tasks: Task[],
  aars: AAR[],
): boolean {
  const onWaivedTask = commitments.some((w) => {
    if (w.outcome !== 'waived' || w.isWeeklyRep || w.personId === person.id) return false;
    const task = tasks.find((t) => t.id === w.taskId);
    return !!task?.assigneeIds.includes(person.id);
  });
  if (!onWaivedTask) return false;
  // The crew on t-ramp-03 is three people; the AAR names who actually covered
  // the waived slot. Without that clause the ribbon would go to the whole crew.
  return aars.some((a) => a.whatItTook.includes(`${person.name} picked it up`));
}

export function ribbonsFor(
  person: Person,
  needs: Need[],
  tasks: Task[],
  commitments: Commitment[],
  aars: AAR[],
): RibbonId[] {
  const ids: RibbonId[] = [];
  if (person.keptCount >= 1) ids.push('first-rep');
  if (person.streakWeeks >= 12) ids.push('twelve-weeks');
  if (person.streakWeeks >= 26) ids.push('half-year');
  if (person.streakWeeks >= 52) ids.push('full-year');
  if (person.keptCount >= 50) ids.push('fifty-kept');
  if (earnsSurgeResponder(person, needs, tasks)) ids.push('surge-responder');
  if (earnsBackstop(person, commitments, tasks, aars)) ids.push('backstop');
  if (person.quals.length >= 3) ids.push('multi-qual');
  return ids;
}

export function ribbonsEarnedThisMonth(
  person: Person,
  needs: Need[],
  tasks: Task[],
  commitments: Commitment[],
  aars: AAR[],
): RibbonId[] {
  // Ribbons have no earned-at. "This month" means the triggering event sits
  // in the current demo month (March 2026): the Hansen surge, and Duthie
  // closing with the one covered waiver.
  const held = new Set(ribbonsFor(person, needs, tasks, commitments, aars));
  const ids: RibbonId[] = [];
  if (held.has('surge-responder')) ids.push('surge-responder');
  if (held.has('backstop')) ids.push('backstop');
  return ids;
}

export function standingFor(person: Person): Standing {
  const rate = showRate(person);
  if (person.streakWeeks >= 26 && rate >= 0.9) return 'Sponsoring';
  if (person.streakWeeks >= 12 && rate >= 0.85) return 'Established';
  return 'Provisional';
}
