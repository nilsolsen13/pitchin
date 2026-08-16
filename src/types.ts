// PitchIn data model — spec §4, transcribed verbatim.
// showRate and holder counts are DERIVED (src/lib/derive.ts), never stored.

// ─── Primitives ──────────────────────────────────────────────────────────────

export type ISODate = string; // "2026-03-12"
export type ISODateTime = string; // "2026-03-12T18:00:00-07:00"
export type Role = 'resident' | 'requester' | 'admin';

// ─── People and capability ───────────────────────────────────────────────────

export type QualId =
  | 'chainsaw' | 'pump-operator' | 'spanish-interpreter' | 'elder-checkin'
  | 'wildfire-prep' | 'meeting-minutes' | 'heavy-tow' | 'food-safety'
  | 'first-aid' | 'wfr' | 'generator' | 'plow' | 'muck-out'
  | 'livestock' | 'child-cleared' | 'ham-radio';

export interface Qual {
  id: QualId;
  name: string; // "Chainsaw Operator"
  category: 'Response' | 'Care' | 'Logistics' | 'Civic';
  demonstration: string; // how it is earned, one sentence
  holders: number; // DERIVED at build time from people[] — do not hardcode
}

export type EquipmentType =
  | 'truck-tow' | 'truck-plow' | 'trailer-stock' | 'generator'
  | 'trash-pump' | 'chainsaw' | 'ham-base' | 'dehumidifier';

export interface Equipment {
  id: string;
  type: EquipmentType;
  label: string; // "2015 Ford F-250, 12,000 lb tow"
  ownerId: string | null; // null = organization-owned
  ownerOrgId: string | null;
  lastUsed: ISODate | null; // null = never used since registration
}

export interface Person {
  id: string;
  name: string;
  age: number;
  squadId: string;
  quals: QualId[];
  languages: string[]; // ["English", "Spanish (conversational)"]
  availability: string; // "Thursdays 5–9pm, Saturday mornings"
  repSlot: string; // "Thursday 6:00 PM"
  partnerId: string | null; // named partner for the weekly rep
  keptCount: number; // commitments kept, all time
  missedCount: number; // commitments missed, all time
  streakWeeks: number; // personal unbroken weeks
  joinedDate: ISODate;
  // showRate is DERIVED: keptCount / (keptCount + missedCount). Never store it.
}

export interface Squad {
  id: string;
  name: string; // "Creek Side"
  memberIds: string[]; // 4–8 members
  streakWeeks: number; // squad-held streak
  standing: 'Provisional' | 'Established' | 'Sponsoring';
  formedDate: ISODate;
  // showRate is DERIVED from member kept/missed sums.
}

// ─── Requesters ──────────────────────────────────────────────────────────────

export type OrgType = 'government' | 'church' | 'school' | 'team' | 'neighbor' | 'business';

export interface Org {
  id: string;
  name: string;
  type: OrgType;
  contact: string; // "Dispatch, Park County EM"
}

// ─── Needs and tasks ─────────────────────────────────────────────────────────

export type NeedMode = 'sustainment' | 'surge';
export type NeedStatus = 'open' | 'staffing' | 'in_progress' | 'met' | 'stalled';

export interface Need {
  id: string;
  title: string;
  rawText: string; // the original free-text submission, verbatim
  requesterOrgId: string;
  submittedAt: ISODateTime;
  mode: NeedMode;
  status: NeedStatus;
  taskIds: string[];
  metAt: ISODateTime | null;
  aarId: string | null;
  stallReason: string | null; // shown on the board when status === 'stalled'
}

export type TaskStatus =
  | 'open' | 'claimed' | 'in_progress' | 'verified' | 'missed' | 'blocked';

export interface Task {
  id: string;
  needId: string;
  title: string;
  detail: string; // one sentence of context
  durationMin: number;
  requiredQuals: QualId[]; // empty array = anyone
  requiredEquipment: EquipmentType[]; // empty array = none
  peopleNeeded: number;
  window: string; // "Thu 3/12, afternoon"
  status: TaskStatus;
  assigneeIds: string[];
  verifiedById: string | null; // must be a person acting for the requester org
  verifiedAt: ISODateTime | null;
  blockReason: string | null; // required when status === 'blocked'
}

// ─── Commitments — FIRST-CLASS. This is what show-rate is computed from. ──────

export type CommitmentOutcome = 'pending' | 'kept' | 'missed' | 'waived';

export interface Commitment {
  id: string;
  personId: string;
  taskId: string;
  madeAt: ISODateTime;
  dueAt: ISODateTime;
  outcome: CommitmentOutcome;
  isWeeklyRep: boolean;
  scopeMinutes: number; // 20 standard, 10 after one miss, 5 after two
}

// ─── After-action reports ────────────────────────────────────────────────────

export interface AAR {
  id: string;
  needId: string;
  whatWasNeeded: string;
  whoTurnedOut: string; // prose, names people
  whatItTook: string;
  whatWeDoDifferently: string;
  publishedAt: ISODateTime;
  authorId: string;
}

// ─── Local reciprocity ───────────────────────────────────────────────────────

export interface Merchant {
  id: string;
  business: string; // "Tweek Bros. Coffeehouse"
  offer: string; // "Free drip coffee on rep night"
  honoredFor: string; // "Any member with an active streak"
}

// ─── Demo state (spec §8.1) ──────────────────────────────────────────────────

export type RepState = 'STANDARD' | 'SCOPED_DOWN' | 'KEEP_THE_CHAIN' | 'WAIVED' | 'ACCEPTED';

// ─── Direct messages (demo chrome — not Appendix A) ──────────────────────────
// 1:1 threads only. Seed lives in src/data/messages.ts so Appendix A stays
// verbatim. Reset clones this the same way it clones needs/tasks.

export interface ChatThread {
  id: string;
  participantIds: [string, string];
}

export interface ChatMessage {
  id: string;
  threadId: string;
  fromId: string;
  body: string;
  sentAt: ISODateTime;
  readBy: string[];
}
