// PitchIn data model — spec §4, transcribed verbatim.
// showRate and holder counts are DERIVED (src/lib/derive.ts), never stored.

// ─── Primitives ──────────────────────────────────────────────────────────────

export type ISODate = string; // "2026-03-12"
export type ISODateTime = string; // "2026-03-12T18:00:00-07:00"
export type Role = 'resident' | 'admin';

export type Standing = 'Provisional' | 'Established' | 'Sponsoring';

// ─── People and capability ───────────────────────────────────────────────────

export type QualId =
  | 'chainsaw' | 'pump-operator' | 'spanish-interpreter' | 'elder-checkin'
  | 'wildfire-prep' | 'meeting-minutes' | 'heavy-tow' | 'food-safety'
  | 'first-aid' | 'wfr' | 'generator' | 'plow' | 'muck-out'
  | 'livestock' | 'child-cleared' | 'ham-radio' | 'emt-paramedic';

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

export interface SquadTerritory {
  label: string;
  path: string; // SVG path in viewBox 0 0 1000 700
  cx: number;
  cy: number;
}

export interface Squad {
  id: string;
  name: string; // "Creek Side"
  memberIds: string[]; // 4–8 members
  streakWeeks: number; // squad-held streak
  standing: Standing;
  formedDate: ISODate;
  territory: SquadTerritory;
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
  postedByResident: boolean; // true only for needs this resident posted in-session
  mapPoint: { x: number; y: number } | null; // schematic coords (Part C)
  onBehalfOf: OnBehalfOf | null;
}

export interface OnBehalfOf {
  name: string;
  age: number | null;
  locationSpecific: string;
  locationGeneral: string;
  relationship: string;
  publicNameConsent: boolean;
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
  scheduledDate: ISODate | null; // "2026-03-12"; null = unscheduled (lists, not grid)
  recurrenceNote: string | null; // "Weekly, Tuesdays" — display only
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

export type HonorTag = 'available' | 'not-yet' | 'squad';

export interface HonorStatus {
  merchant: Merchant;
  tag: HonorTag;
  eligible: boolean;
  record: string; // current fact, not a countdown
}

// ─── Ribbons (final spec Part D) — derived, never stored on a person ─────────

export type RibbonId =
  | 'first-rep' | 'twelve-weeks' | 'half-year' | 'full-year'
  | 'fifty-kept' | 'surge-responder' | 'backstop' | 'multi-qual';

export interface Ribbon {
  id: RibbonId;
  name: string;
  criterion: string;
  note: string;
}

// ─── Demo state (spec §8.1) ──────────────────────────────────────────────────

export type RepState = 'STANDARD' | 'SCOPED_DOWN' | 'KEEP_THE_CHAIN' | 'WAIVED' | 'ACCEPTED';

// ─── Calendar view model (Increment 2 §2.3) ──────────────────────────────────

export type CalendarEntryKind = 'rep' | 'commitment' | 'opportunity';
export type CalendarEntryOutcome = 'pending' | 'kept' | 'missed' | 'waived' | 'open';

export interface CalendarEntry {
  id: string;
  kind: CalendarEntryKind;
  outcome: CalendarEntryOutcome;
  title: string;
  date: ISODate | null;
  durationMin: number;
  needTitle: string | null;    // null for weekly reps
  needId: string | null;
  partnerName: string | null;  // reps only
  recurrenceNote: string | null;
}

