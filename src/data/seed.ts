// Appendix A — seed data, transcribed verbatim. Do NOT regenerate.
// Dashboard numbers are DERIVED from this (src/lib/derive.ts) and must reconcile.

import type {
  AAR, Commitment, Equipment, Merchant, Need, Org, Person, Qual, Squad, Task,
} from '../types';

// ─── A.1 Constants ───────────────────────────────────────────────────────────

export const DEMO_TODAY = '2026-03-12';
export const TOWN = {
  name: 'South Park',
  county: 'Park County',
  state: 'Colorado',
  population: 4187,
  elevationFt: 9800,
};

// ─── A.2 Quals (16) ──────────────────────────────────────────────────────────
// holders is DERIVED from people[] below — computed, never hardcoded.

const QUAL_META: Omit<Qual, 'holders'>[] = [
  { id: 'chainsaw', name: 'Chainsaw Operator', category: 'Response', demonstration: 'Felled and bucked a standing dead under observation.' },
  { id: 'pump-operator', name: 'Pump Operator', category: 'Response', demonstration: 'Primed, ran, and cleared a trash pump on a live drawdown.' },
  { id: 'spanish-interpreter', name: 'Spanish Interpreter', category: 'Civic', demonstration: 'Interpreted a full county services session, reviewed by staff.' },
  { id: 'elder-checkin', name: 'Elder Check-In', category: 'Care', demonstration: 'Completed the Park County welfare-check protocol with a partner.' },
  { id: 'wildfire-prep', name: 'Wildfire Prep', category: 'Response', demonstration: 'Cleared defensible space to county standard on two properties.' },
  { id: 'meeting-minutes', name: 'Meeting Minutes', category: 'Civic', demonstration: 'Filed minutes for three public meetings, accepted by the clerk.' },
  { id: 'heavy-tow', name: 'Heavy Tow / Trailering', category: 'Logistics', demonstration: 'Backed and placed a loaded 20-foot trailer under observation.' },
  { id: 'food-safety', name: 'Food Safety', category: 'Care', demonstration: 'Current ServSafe handler card.' },
  { id: 'first-aid', name: 'First Aid / CPR', category: 'Care', demonstration: 'Current Red Cross certification.' },
  { id: 'wfr', name: 'Wilderness First Responder', category: 'Response', demonstration: 'Current 80-hour WFR certification.' },
  { id: 'generator', name: 'Generator Operator', category: 'Logistics', demonstration: 'Sited, grounded, and load-tested a portable generator.' },
  { id: 'plow', name: 'Snow Removal — Plow', category: 'Logistics', demonstration: 'Cleared two residential drives to standard without property damage.' },
  { id: 'muck-out', name: 'Structural Muck-Out', category: 'Response', demonstration: 'Completed flood-response muck-out training with respirator fit test.' },
  { id: 'livestock', name: 'Livestock Handling', category: 'Logistics', demonstration: 'Moved and penned cattle under observation.' },
  { id: 'child-cleared', name: 'Child Supervision Cleared', category: 'Care', demonstration: 'Background check on file with the school district.' },
  { id: 'ham-radio', name: 'Ham Radio Operator', category: 'Response', demonstration: 'Current FCC Technician license or above.' },
];

// ─── A.4 People (24) ─────────────────────────────────────────────────────────
// repSlot per squad; languages default ["English"] unless noted (A.4).
// joinedDate/availability are absent from A.4 — joinedDate uses the squad
// formedDate, availability uses the repSlot. See NOTES_FOR_NILS.md #3.

const CREEK = 'Thursday 6:00 PM';
const KENOSHA = 'Tuesday 7:00 PM';
const REDHILL = 'Thursday 6:00 PM';
const TARRYALL = 'Saturday 9:00 AM';

const FORMED_CREEK = '2024-06-14';
const FORMED_KENOSHA = '2024-03-08';
const FORMED_REDHILL = '2024-01-19';
const FORMED_TARRYALL = '2025-04-11';

export const people: Person[] = [
  // Creek Side
  { id: 'p-whitlock', name: 'Dana Whitlock', age: 41, squadId: 'creek-side', quals: ['chainsaw', 'muck-out', 'first-aid'], languages: ['English'], availability: CREEK, repSlot: CREEK, partnerId: 'p-delacroix', keptCount: 47, missedCount: 3, streakWeeks: 31, joinedDate: FORMED_CREEK },
  { id: 'p-ferrin', name: 'Ray Ferrin', age: 58, squadId: 'creek-side', quals: ['pump-operator', 'generator', 'ham-radio', 'chainsaw'], languages: ['English'], availability: CREEK, repSlot: CREEK, partnerId: 'p-ostrander', keptCount: 68, missedCount: 2, streakWeeks: 46, joinedDate: FORMED_CREEK },
  { id: 'p-raghavan', name: 'Priya Raghavan', age: 34, squadId: 'creek-side', quals: ['meeting-minutes', 'food-safety'], languages: ['English'], availability: CREEK, repSlot: CREEK, partnerId: 'p-sparks', keptCount: 22, missedCount: 3, streakWeeks: 12, joinedDate: FORMED_CREEK },
  { id: 'p-ostrander', name: 'Cal Ostrander', age: 63, squadId: 'creek-side', quals: ['heavy-tow', 'livestock', 'chainsaw'], languages: ['English'], availability: CREEK, repSlot: CREEK, partnerId: 'p-ferrin', keptCount: 41, missedCount: 4, streakWeeks: 27, joinedDate: FORMED_CREEK },
  { id: 'p-beckett', name: 'Nora Beckett', age: 29, squadId: 'creek-side', quals: ['child-cleared', 'first-aid'], languages: ['English'], availability: CREEK, repSlot: CREEK, partnerId: 'p-sparks', keptCount: 25, missedCount: 8, streakWeeks: 3, joinedDate: FORMED_CREEK },
  { id: 'p-aguirre', name: 'Tom Aguirre', age: 47, squadId: 'creek-side', quals: ['chainsaw', 'wildfire-prep'], languages: ['English'], availability: CREEK, repSlot: CREEK, partnerId: 'p-whitlock', keptCount: 34, missedCount: 6, streakWeeks: 18, joinedDate: FORMED_CREEK },
  { id: 'p-sparks', name: 'Junie Sparks', age: 52, squadId: 'creek-side', quals: ['food-safety', 'elder-checkin'], languages: ['English'], availability: CREEK, repSlot: CREEK, partnerId: 'p-beckett', keptCount: 40, missedCount: 3, streakWeeks: 22, joinedDate: FORMED_CREEK },
  { id: 'p-delacroix', name: 'Wes Delacroix', age: 38, squadId: 'creek-side', quals: ['muck-out', 'chainsaw'], languages: ['English'], availability: CREEK, repSlot: CREEK, partnerId: 'p-aguirre', keptCount: 31, missedCount: 4, streakWeeks: 15, joinedDate: FORMED_CREEK },

  // Kenosha Pass
  { id: 'p-vega', name: 'Marisol Vega', age: 36, squadId: 'kenosha-pass', quals: ['spanish-interpreter', 'wfr', 'first-aid'], languages: ['English', 'Spanish (native)'], availability: KENOSHA, repSlot: KENOSHA, partnerId: 'p-mwangi', keptCount: 72, missedCount: 3, streakWeeks: 41, joinedDate: FORMED_KENOSHA },
  { id: 'p-tanaka', name: 'Bud Tanaka', age: 66, squadId: 'kenosha-pass', quals: ['plow', 'generator', 'heavy-tow'], languages: ['English'], availability: KENOSHA, repSlot: KENOSHA, partnerId: 'p-grange', keptCount: 58, missedCount: 5, streakWeeks: 38, joinedDate: FORMED_KENOSHA },
  { id: 'p-grange', name: 'Hollis Grange', age: 44, squadId: 'kenosha-pass', quals: ['plow', 'heavy-tow'], languages: ['English'], availability: KENOSHA, repSlot: KENOSHA, partnerId: 'p-tanaka', keptCount: 33, missedCount: 5, streakWeeks: 20, joinedDate: FORMED_KENOSHA },
  { id: 'p-mwangi', name: 'Estelle Mwangi', age: 31, squadId: 'kenosha-pass', quals: ['wfr', 'elder-checkin'], languages: ['English'], availability: KENOSHA, repSlot: KENOSHA, partnerId: 'p-vega', keptCount: 27, missedCount: 3, streakWeeks: 16, joinedDate: FORMED_KENOSHA },
  { id: 'p-pinkerton', name: 'Andy Pinkerton', age: 55, squadId: 'kenosha-pass', quals: ['chainsaw', 'wildfire-prep', 'ham-radio'], languages: ['English'], availability: KENOSHA, repSlot: KENOSHA, partnerId: 'p-ko', keptCount: 62, missedCount: 4, streakWeeks: 33, joinedDate: FORMED_KENOSHA },
  { id: 'p-ko', name: 'Roseanne Ko', age: 49, squadId: 'kenosha-pass', quals: ['food-safety', 'meeting-minutes'], languages: ['English'], availability: KENOSHA, repSlot: KENOSHA, partnerId: 'p-pinkerton', keptCount: 17, missedCount: 4, streakWeeks: 9, joinedDate: FORMED_KENOSHA },

  // Red Hill
  { id: 'p-marchetti', name: 'Gil Marchetti', age: 60, squadId: 'red-hill', quals: ['chainsaw', 'generator'], languages: ['English'], availability: REDHILL, repSlot: REDHILL, partnerId: 'p-hollinger', keptCount: 76, missedCount: 4, streakWeeks: 44, joinedDate: FORMED_REDHILL },
  { id: 'p-reyes', name: 'Tasha Reyes', age: 27, squadId: 'red-hill', quals: ['child-cleared'], languages: ['English', 'Spanish (conversational)'], availability: REDHILL, repSlot: REDHILL, partnerId: 'p-sorokin', keptCount: 20, missedCount: 4, streakWeeks: 11, joinedDate: FORMED_REDHILL },
  { id: 'p-bradbury', name: 'Owen Bradbury', age: 43, squadId: 'red-hill', quals: ['muck-out', 'first-aid', 'chainsaw'], languages: ['English'], availability: REDHILL, repSlot: REDHILL, partnerId: 'p-marchetti', keptCount: 36, missedCount: 4, streakWeeks: 24, joinedDate: FORMED_REDHILL },
  { id: 'p-sorokin', name: 'Lena Sorokin', age: 39, squadId: 'red-hill', quals: ['wildfire-prep', 'meeting-minutes'], languages: ['English'], availability: REDHILL, repSlot: REDHILL, partnerId: 'p-reyes', keptCount: 14, missedCount: 4, streakWeeks: 6, joinedDate: FORMED_REDHILL },
  { id: 'p-hollinger', name: 'Duke Hollinger', age: 71, squadId: 'red-hill', quals: ['livestock', 'elder-checkin', 'chainsaw'], languages: ['English'], availability: REDHILL, repSlot: REDHILL, partnerId: 'p-bradbury', keptCount: 49, missedCount: 1, streakWeeks: 52, joinedDate: FORMED_REDHILL },

  // Tarryall
  { id: 'p-lindqvist', name: 'Petra Lindqvist', age: 33, squadId: 'tarryall', quals: ['wfr', 'chainsaw'], languages: ['English'], availability: TARRYALL, repSlot: TARRYALL, partnerId: 'p-okonjo', keptCount: 30, missedCount: 3, streakWeeks: 19, joinedDate: FORMED_TARRYALL },
  { id: 'p-okonjo', name: 'Marcus Okonjo', age: 46, squadId: 'tarryall', quals: ['heavy-tow', 'generator', 'chainsaw'], languages: ['English'], availability: TARRYALL, repSlot: TARRYALL, partnerId: 'p-lindqvist', keptCount: 25, missedCount: 4, streakWeeks: 14, joinedDate: FORMED_TARRYALL },
  { id: 'p-delacroix-reyes', name: 'Sunny Delacroix-Reyes', age: 24, squadId: 'tarryall', quals: ['food-safety', 'child-cleared'], languages: ['English'], availability: TARRYALL, repSlot: TARRYALL, partnerId: 'p-cardoza', keptCount: 17, missedCount: 6, streakWeeks: 4, joinedDate: FORMED_TARRYALL },
  { id: 'p-vasquez', name: 'Hank Vasquez', age: 57, squadId: 'tarryall', quals: ['chainsaw', 'muck-out'], languages: ['English'], availability: TARRYALL, repSlot: TARRYALL, partnerId: 'p-cardoza', keptCount: 42, missedCount: 3, streakWeeks: 29, joinedDate: FORMED_TARRYALL },
  { id: 'p-cardoza', name: 'Ines Cardoza', age: 35, squadId: 'tarryall', quals: ['elder-checkin', 'food-safety'], languages: ['English', 'Spanish (conversational)'], availability: TARRYALL, repSlot: TARRYALL, partnerId: 'p-vasquez', keptCount: 29, missedCount: 4, streakWeeks: 17, joinedDate: FORMED_TARRYALL },
];

// Qual holders computed from people[] (spec: DERIVED, never hardcoded).
export const quals: Qual[] = QUAL_META.map((q) => ({
  ...q,
  holders: people.filter((p) => p.quals.includes(q.id)).length,
}));

// ─── A.3 Squads (4) ──────────────────────────────────────────────────────────
// memberIds computed from people[] by squadId, preserving people[] order.

const membersOf = (squadId: string) =>
  people.filter((p) => p.squadId === squadId).map((p) => p.id);

export const squads: Squad[] = [
  { id: 'creek-side', name: 'Creek Side', memberIds: membersOf('creek-side'), streakWeeks: 31, standing: 'Sponsoring', formedDate: FORMED_CREEK },
  { id: 'kenosha-pass', name: 'Kenosha Pass', memberIds: membersOf('kenosha-pass'), streakWeeks: 38, standing: 'Sponsoring', formedDate: FORMED_KENOSHA },
  { id: 'red-hill', name: 'Red Hill', memberIds: membersOf('red-hill'), streakWeeks: 44, standing: 'Sponsoring', formedDate: FORMED_REDHILL },
  { id: 'tarryall', name: 'Tarryall', memberIds: membersOf('tarryall'), streakWeeks: 19, standing: 'Established', formedDate: FORMED_TARRYALL },
];

// ─── A.6 Organizations (8) ───────────────────────────────────────────────────

export const orgs: Org[] = [
  { id: 'org-pcem', name: 'Park County Emergency Management', type: 'government', contact: 'Dispatch, Park County EM' },
  { id: 'org-county', name: 'Park County', type: 'government', contact: "County Administrator's Office, Fairplay" },
  { id: 'org-church', name: 'United Methodist Church of South Park', type: 'church', contact: 'Parish office' },
  { id: 'org-school', name: 'South Park Elementary', type: 'school', contact: 'Front office' },
  { id: 'org-cows', name: 'South Park Cows Athletics', type: 'team', contact: 'Athletic director' },
  { id: 'org-hhs', name: 'Park County Human Services', type: 'government', contact: 'Services desk, Fairplay' },
  { id: 'org-fire', name: 'South Park Fire Protection District', type: 'government', contact: 'Station 1' },
  { id: 'org-neighbor', name: 'Marguerite Ellery (neighbor)', type: 'neighbor', contact: 'Tarryall Road' },
];

// ─── A.5 Equipment (31) ──────────────────────────────────────────────────────

const eq = (
  id: string,
  type: Equipment['type'],
  label: string,
  owner: string | null,
  lastUsed: string | null,
  orgOwned = false,
): Equipment => ({
  id,
  type,
  label,
  ownerId: orgOwned ? null : owner,
  ownerOrgId: orgOwned ? owner : null,
  lastUsed,
});

export const equipment: Equipment[] = [
  eq('eq-01', 'truck-tow', '2015 Ford F-250, 12,000 lb tow', 'p-whitlock', '2026-03-10'),
  eq('eq-02', 'truck-tow', '2011 Ford F-350 dually', 'p-ostrander', '2026-03-10'),
  eq('eq-03', 'truck-tow', '2019 Chevy Silverado 2500', 'p-delacroix', '2026-03-11'),
  eq('eq-04', 'truck-tow', '2017 Toyota Tundra', 'p-bradbury', '2026-01-22'),
  eq('eq-05', 'truck-tow', '2008 Ford F-150', 'p-hollinger', '2025-11-22'),
  eq('eq-06', 'truck-tow', '2020 Ford F-250', 'p-okonjo', '2025-11-30'),
  eq('eq-07', 'truck-tow', '2014 GMC Sierra 2500', 'p-vasquez', '2026-03-11'),
  eq('eq-08', 'truck-tow', '2016 Toyota Tacoma', 'p-aguirre', '2026-02-28'),
  eq('eq-09', 'truck-tow', '2013 Ram 1500', 'p-marchetti', '2025-09-14'),
  eq('eq-10', 'truck-plow', "2012 Ford F-250 w/ 8' Boss plow", 'p-tanaka', '2026-03-09'),
  eq('eq-11', 'truck-plow', "2018 Ram 2500 w/ 7.5' Western plow", 'p-grange', '2026-03-09'),
  eq('eq-12', 'trailer-stock', "20' Featherlite stock trailer", 'p-ostrander', '2025-10-04'),
  eq('eq-13', 'generator', 'Honda EU7000is, 7 kW', 'p-tanaka', '2026-03-10'),
  eq('eq-14', 'generator', 'Generac GP6500, 6.5 kW', 'p-marchetti', '2026-03-10'),
  eq('eq-15', 'generator', 'Champion 5000W', 'p-ferrin', '2026-03-10'),
  eq('eq-16', 'generator', 'Westinghouse WGen4500', 'p-okonjo', null),
  eq('eq-17', 'trash-pump', 'Honda WT20 2" trash pump', 'p-ferrin', '2026-03-10'),
  eq('eq-18', 'trash-pump', 'Multiquip QP-2TH', 'org-fire', null, true),
  eq('eq-19', 'trash-pump', 'Wacker Neuson PT2', 'p-ostrander', null),
  eq('eq-20', 'chainsaw', 'Stihl MS 271, 20"', 'p-whitlock', '2026-02-21'),
  eq('eq-21', 'chainsaw', 'Husqvarna 455 Rancher', 'p-ferrin', '2026-02-21'),
  eq('eq-22', 'chainsaw', 'Stihl MS 261', 'p-aguirre', '2026-02-21'),
  eq('eq-23', 'chainsaw', 'Echo CS-590', 'p-delacroix', '2025-12-06'),
  eq('eq-24', 'chainsaw', 'Husqvarna 460', 'p-pinkerton', '2025-11-08'),
  eq('eq-25', 'chainsaw', 'Stihl MS 391', 'p-marchetti', '2025-11-15'),
  eq('eq-26', 'chainsaw', 'Echo CS-400', 'p-lindqvist', '2025-10-19'),
  eq('eq-27', 'chainsaw', 'Stihl MS 250', 'p-vasquez', '2025-12-06'),
  eq('eq-28', 'ham-base', 'Yaesu FT-991A base station', 'p-pinkerton', '2026-03-09'),
  eq('eq-29', 'ham-base', 'Icom IC-7300', 'p-ferrin', '2026-03-09'),
  eq('eq-30', 'dehumidifier', '2× Dri-Eaz LGR 7000XLi', 'org-fire', '2026-03-10', true),
  eq('eq-31', 'dehumidifier', '4× commercial air movers', 'org-fire', '2026-03-10', true),
];

// ─── A.7 Needs (6) ───────────────────────────────────────────────────────────

export const needs: Need[] = [
  {
    id: 'need-hansen-flood',
    title: 'Flood response — the Hansen place, Middle Fork',
    rawText:
      "Middle Fork came up over the bank behind the Hansen place Sunday night after the rain on top of the snowpack. Basement's got about three feet of standing water, mud through the whole ground floor, and their well head went under. Dennis and Kate are okay, they've got a seven-year-old, Ruby. They're staying at Kate's sister's in Fairplay for now but they need the house dried out before it goes to mold. Whatever help we can get.",
    requesterOrgId: 'org-pcem',
    submittedAt: '2026-03-09T07:20:00-07:00',
    mode: 'surge',
    status: 'in_progress',
    taskIds: ['t-flood-01', 't-flood-02', 't-flood-03', 't-flood-04', 't-flood-05', 't-flood-06', 't-flood-07', 't-flood-08', 't-flood-09', 't-flood-10', 't-flood-11'],
    metAt: null,
    aarId: null,
    stallReason: null,
  },
  {
    id: 'need-duthie-ramp',
    title: 'Wheelchair ramp — Alma Duthie, Bijou Street',
    rawText:
      "Alma Duthie came home from Hell's Pass after her hip and she can't do the front steps. She needs a ramp before the thaw makes the side yard a mess. The parish can cover materials.",
    requesterOrgId: 'org-church',
    submittedAt: '2026-02-24T09:00:00-07:00',
    mode: 'sustainment',
    status: 'met',
    taskIds: ['t-ramp-01', 't-ramp-02', 't-ramp-03', 't-ramp-04', 't-ramp-05', 't-ramp-06'],
    metAt: '2026-03-03T16:30:00-07:00',
    aarId: 'aar-duthie',
    stallReason: null,
  },
  {
    id: 'need-vasquez-plow',
    title: 'Driveway plowing — Eleanor Vasquez, 82, Tarryall Road',
    rawText:
      "Eleanor's 82 and her drive is 400 feet off Tarryall Road. It drifted in again Thursday and the county doesn't plow private drives. Her nephew Hank is in the squad but he doesn't have a plow.",
    requesterOrgId: 'org-neighbor',
    submittedAt: '2026-03-06T18:40:00-07:00',
    mode: 'sustainment',
    status: 'stalled',
    taskIds: ['t-plow-01', 't-plow-02'],
    metAt: null,
    aarId: null,
    stallReason:
      'Both plow-equipped trucks are registered to Kenosha Pass, 22 minutes from Tarryall Road. No plow capacity on the Tarryall side.',
  },
  {
    id: 'need-school-chaperones',
    title: 'Chaperones — 5th grade Kenosha Pass field trip',
    rawText:
      "Fifth grade is going up to Kenosha Pass April 16th for the ecology unit. District says we need six adults with current background checks. We have two.",
    requesterOrgId: 'org-school',
    submittedAt: '2026-03-02T14:00:00-07:00',
    mode: 'sustainment',
    status: 'staffing',
    taskIds: ['t-chap-01', 't-chap-02', 't-chap-03', 't-chap-04', 't-chap-05', 't-chap-06'],
    metAt: null,
    aarId: null,
    stallReason: null,
  },
  {
    id: 'need-cows-timing',
    title: 'Timing crew — Cows home track meets, April 11 & 25',
    rawText:
      "We need a timing and field crew for both home meets. Six people each day, no experience necessary, we'll train the morning of.",
    requesterOrgId: 'org-cows',
    submittedAt: '2026-03-11T16:10:00-07:00',
    mode: 'sustainment',
    status: 'staffing',
    taskIds: ['t-cows-01', 't-cows-02', 't-cows-03', 't-cows-04', 't-cows-05', 't-cows-06'],
    metAt: null,
    aarId: null,
    stallReason: null,
  },
  {
    id: 'need-interpreter-desk',
    title: 'Spanish interpreter — Tuesday county services desk',
    rawText:
      "We need someone at the services desk Tuesday mornings who can actually interpret, not just get by. Benefits enrollment, mostly.",
    requesterOrgId: 'org-hhs',
    submittedAt: '2026-01-13T08:00:00-07:00',
    mode: 'sustainment',
    status: 'in_progress',
    taskIds: ['t-desk-01'],
    metAt: null,
    aarId: null,
    stallReason: null,
  },
];

// ─── A.8 Tasks — the Hansen flood (11) + A.9 other needs' tasks ──────────────

const V_AT = '2026-03-11T09:00:00-07:00'; // verifiedAt for flood tasks 1, 6, 7

export const tasks: Task[] = [
  // Hansen flood (A.8)
  { id: 't-flood-01', needId: 'need-hansen-flood', title: 'Pump standing water from the basement', detail: 'Three feet in the basement. Draw down before the foundation takes more.', durationMin: 90, requiredQuals: ['pump-operator'], requiredEquipment: ['trash-pump'], peopleNeeded: 1, window: 'Mon 3/9, morning', status: 'verified', assigneeIds: ['p-ferrin'], verifiedById: 'p-vega', verifiedAt: V_AT, blockReason: null },
  { id: 't-flood-02', needId: 'need-hansen-flood', title: 'Muck-out — pull saturated drywall to 4 feet', detail: 'Everything below the waterline comes out or it goes to mold.', durationMin: 180, requiredQuals: ['muck-out'], requiredEquipment: [], peopleNeeded: 2, window: 'Thu 3/12, all day', status: 'in_progress', assigneeIds: ['p-whitlock', 'p-delacroix'], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-flood-03', needId: 'need-hansen-flood', title: 'Haul flood debris to the transfer station — load 1', detail: 'Drywall, insulation, and carpet to the Park County transfer station.', durationMin: 60, requiredQuals: [], requiredEquipment: ['truck-tow'], peopleNeeded: 1, window: 'Thu 3/12, afternoon', status: 'in_progress', assigneeIds: ['p-vasquez'], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-flood-04', needId: 'need-hansen-flood', title: 'Haul flood debris to the transfer station — load 2', detail: 'Second load. Subfloor and the rest of the insulation.', durationMin: 60, requiredQuals: [], requiredEquipment: ['truck-tow'], peopleNeeded: 1, window: 'Fri 3/13, morning', status: 'claimed', assigneeIds: ['p-ostrander'], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-flood-05', needId: 'need-hansen-flood', title: 'Move waterlogged furniture to storage in Hartsel', detail: 'Dining set and two dressers, salvageable if they dry out.', durationMin: 75, requiredQuals: ['heavy-tow'], requiredEquipment: ['truck-tow', 'trailer-stock'], peopleNeeded: 2, window: 'Sat 3/14, morning', status: 'open', assigneeIds: [], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-flood-06', needId: 'need-hansen-flood', title: 'Set and monitor drying fans and dehumidifiers', detail: "Fire district's LGRs plus four air movers, on a generator until power's back.", durationMin: 45, requiredQuals: ['generator'], requiredEquipment: ['generator', 'dehumidifier'], peopleNeeded: 1, window: 'Tue 3/10, evening', status: 'verified', assigneeIds: ['p-tanaka'], verifiedById: 'p-vega', verifiedAt: V_AT, blockReason: null },
  { id: 't-flood-07', needId: 'need-hansen-flood', title: 'Sandbag the bank at the Middle Fork culvert', detail: 'Keep the bank from cutting further if we get more runoff this week.', durationMin: 120, requiredQuals: [], requiredEquipment: [], peopleNeeded: 6, window: 'Mon 3/9, afternoon', status: 'verified', assigneeIds: ['p-aguirre', 'p-pinkerton', 'p-bradbury', 'p-lindqvist', 'p-okonjo', 'p-marchetti'], verifiedById: 'p-vega', verifiedAt: V_AT, blockReason: null },
  { id: 't-flood-08', needId: 'need-hansen-flood', title: 'Meals for the Hansens, Thursday through Sunday', detail: "Kate's sister's kitchen is small. Deliver to Fairplay.", durationMin: 30, requiredQuals: ['food-safety'], requiredEquipment: [], peopleNeeded: 4, window: 'Thu–Sun', status: 'claimed', assigneeIds: ['p-sparks', 'p-ko', 'p-delacroix-reyes'], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-flood-09', needId: 'need-hansen-flood', title: 'Childcare for Ruby Hansen during the muck-out', detail: "Ruby's seven. The house isn't a place for her right now.", durationMin: 180, requiredQuals: ['child-cleared'], requiredEquipment: [], peopleNeeded: 1, window: 'Thu 3/12, all day', status: 'claimed', assigneeIds: ['p-reyes'], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-flood-10', needId: 'need-hansen-flood', title: 'Photograph and inventory damage for the insurer', detail: 'Room-by-room photos and a written inventory before anything else is hauled.', durationMin: 60, requiredQuals: [], requiredEquipment: [], peopleNeeded: 1, window: 'Fri 3/13, morning', status: 'open', assigneeIds: [], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-flood-11', needId: 'need-hansen-flood', title: 'Well-water potability test and report', detail: 'The well head went under. Nobody drinks from it until it tests clean.', durationMin: 30, requiredQuals: [], requiredEquipment: [], peopleNeeded: 1, window: 'Sat 3/14', status: 'blocked', assigneeIds: [], verifiedById: null, verifiedAt: null, blockReason: 'CAPACITY GAP — no well-water test kit registered in South Park. Nearest is Park County Public Health, Fairplay. Flagged to the quarterly task menu.' },

  // Duthie ramp (A.9) — all verified, verifiedById p-raghavan
  { id: 't-ramp-01', needId: 'need-duthie-ramp', title: 'Measure the front approach and draw the ramp to code', detail: 'Approach, run, and rise measured against the county code before a board is cut.', durationMin: 60, requiredQuals: [], requiredEquipment: [], peopleNeeded: 1, window: 'Tue 2/24', status: 'verified', assigneeIds: ['p-raghavan'], verifiedById: 'p-raghavan', verifiedAt: '2026-03-03T16:30:00-07:00', blockReason: null },
  { id: 't-ramp-02', needId: 'need-duthie-ramp', title: 'Pick up lumber and hardware in Fairplay', detail: 'Treated lumber, fasteners, and non-skid from the Fairplay yard.', durationMin: 90, requiredQuals: [], requiredEquipment: ['truck-tow'], peopleNeeded: 1, window: 'Wed 2/25', status: 'verified', assigneeIds: ['p-ostrander'], verifiedById: 'p-raghavan', verifiedAt: '2026-03-03T16:30:00-07:00', blockReason: null },
  { id: 't-ramp-03', needId: 'need-duthie-ramp', title: 'Set the footings', detail: 'Dig, pour, and level the footings in frozen ground.', durationMin: 120, requiredQuals: [], requiredEquipment: [], peopleNeeded: 3, window: 'Sat 2/28', status: 'verified', assigneeIds: ['p-delacroix', 'p-bradbury', 'p-vasquez'], verifiedById: 'p-raghavan', verifiedAt: '2026-03-03T16:30:00-07:00', blockReason: null },
  { id: 't-ramp-04', needId: 'need-duthie-ramp', title: 'Frame and deck the ramp', detail: 'Stringers, joists, and decking to the drawn plan.', durationMin: 240, requiredQuals: [], requiredEquipment: [], peopleNeeded: 4, window: 'Sun 3/1', status: 'verified', assigneeIds: ['p-whitlock', 'p-delacroix', 'p-hollinger', 'p-aguirre'], verifiedById: 'p-raghavan', verifiedAt: '2026-03-03T16:30:00-07:00', blockReason: null },
  { id: 't-ramp-05', needId: 'need-duthie-ramp', title: 'Handrails and non-skid', detail: 'Rails to grip height and non-skid tread the length of the run.', durationMin: 120, requiredQuals: [], requiredEquipment: [], peopleNeeded: 2, window: 'Mon 3/2', status: 'verified', assigneeIds: ['p-whitlock', 'p-bradbury'], verifiedById: 'p-raghavan', verifiedAt: '2026-03-03T16:30:00-07:00', blockReason: null },
  { id: 't-ramp-06', needId: 'need-duthie-ramp', title: 'Walk it with Alma and adjust the landing', detail: 'Walk the finished ramp with Alma and move the landing to reach the rail from her chair.', durationMin: 30, requiredQuals: ['elder-checkin'], requiredEquipment: [], peopleNeeded: 1, window: 'Tue 3/3', status: 'verified', assigneeIds: ['p-sparks'], verifiedById: 'p-raghavan', verifiedAt: '2026-03-03T16:30:00-07:00', blockReason: null },

  // Vasquez plow (A.9) — both open. Do not staff. See NOTES / AGENTS rule 2.
  { id: 't-plow-01', needId: 'need-vasquez-plow', title: 'Plow the drive from Tarryall Road to the house', detail: 'Four hundred feet of drifted drive from Tarryall Road to the house.', durationMin: 45, requiredQuals: ['plow'], requiredEquipment: ['truck-plow'], peopleNeeded: 1, window: 'Thu 3/12', status: 'open', assigneeIds: [], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-plow-02', needId: 'need-vasquez-plow', title: 'Clear the propane tank and the meter', detail: 'Dig out the propane tank and the meter so the fill truck can reach them.', durationMin: 20, requiredQuals: [], requiredEquipment: [], peopleNeeded: 1, window: 'Thu 3/12', status: 'open', assigneeIds: [], verifiedById: null, verifiedAt: null, blockReason: null },

  // School chaperones (A.9) — 4 claimed, 2 open, all require child-cleared
  { id: 't-chap-01', needId: 'need-school-chaperones', title: 'Chaperone — 5th grade Kenosha Pass field trip', detail: 'One cleared adult for the ecology unit at Kenosha Pass.', durationMin: 300, requiredQuals: ['child-cleared'], requiredEquipment: [], peopleNeeded: 1, window: 'Thu 4/16', status: 'claimed', assigneeIds: ['p-beckett'], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-chap-02', needId: 'need-school-chaperones', title: 'Chaperone — 5th grade Kenosha Pass field trip', detail: 'One cleared adult for the ecology unit at Kenosha Pass.', durationMin: 300, requiredQuals: ['child-cleared'], requiredEquipment: [], peopleNeeded: 1, window: 'Thu 4/16', status: 'claimed', assigneeIds: ['p-reyes'], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-chap-03', needId: 'need-school-chaperones', title: 'Chaperone — 5th grade Kenosha Pass field trip', detail: 'One cleared adult for the ecology unit at Kenosha Pass.', durationMin: 300, requiredQuals: ['child-cleared'], requiredEquipment: [], peopleNeeded: 1, window: 'Thu 4/16', status: 'claimed', assigneeIds: ['p-delacroix-reyes'], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-chap-04', needId: 'need-school-chaperones', title: 'Chaperone — 5th grade Kenosha Pass field trip', detail: 'One cleared adult for the ecology unit at Kenosha Pass.', durationMin: 300, requiredQuals: ['child-cleared'], requiredEquipment: [], peopleNeeded: 1, window: 'Thu 4/16', status: 'claimed', assigneeIds: ['p-cardoza'], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-chap-05', needId: 'need-school-chaperones', title: 'Chaperone — 5th grade Kenosha Pass field trip', detail: 'One cleared adult for the ecology unit at Kenosha Pass.', durationMin: 300, requiredQuals: ['child-cleared'], requiredEquipment: [], peopleNeeded: 1, window: 'Thu 4/16', status: 'open', assigneeIds: [], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-chap-06', needId: 'need-school-chaperones', title: 'Chaperone — 5th grade Kenosha Pass field trip', detail: 'One cleared adult for the ecology unit at Kenosha Pass.', durationMin: 300, requiredQuals: ['child-cleared'], requiredEquipment: [], peopleNeeded: 1, window: 'Thu 4/16', status: 'open', assigneeIds: [], verifiedById: null, verifiedAt: null, blockReason: null },

  // Cows timing (A.9) — 2 claimed, 4 open, no requirements
  { id: 't-cows-01', needId: 'need-cows-timing', title: 'Timing and field crew — home track meet', detail: 'Timing and field help for a home meet, trained the morning of.', durationMin: 240, requiredQuals: [], requiredEquipment: [], peopleNeeded: 1, window: 'Sat 4/11', status: 'claimed', assigneeIds: ['p-sorokin'], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-cows-02', needId: 'need-cows-timing', title: 'Timing and field crew — home track meet', detail: 'Timing and field help for a home meet, trained the morning of.', durationMin: 240, requiredQuals: [], requiredEquipment: [], peopleNeeded: 1, window: 'Sat 4/11', status: 'claimed', assigneeIds: ['p-ko'], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-cows-03', needId: 'need-cows-timing', title: 'Timing and field crew — home track meet', detail: 'Timing and field help for a home meet, trained the morning of.', durationMin: 240, requiredQuals: [], requiredEquipment: [], peopleNeeded: 1, window: 'Sat 4/11', status: 'open', assigneeIds: [], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-cows-04', needId: 'need-cows-timing', title: 'Timing and field crew — home track meet', detail: 'Timing and field help for a home meet, trained the morning of.', durationMin: 240, requiredQuals: [], requiredEquipment: [], peopleNeeded: 1, window: 'Sat 4/25', status: 'open', assigneeIds: [], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-cows-05', needId: 'need-cows-timing', title: 'Timing and field crew — home track meet', detail: 'Timing and field help for a home meet, trained the morning of.', durationMin: 240, requiredQuals: [], requiredEquipment: [], peopleNeeded: 1, window: 'Sat 4/25', status: 'open', assigneeIds: [], verifiedById: null, verifiedAt: null, blockReason: null },
  { id: 't-cows-06', needId: 'need-cows-timing', title: 'Timing and field crew — home track meet', detail: 'Timing and field help for a home meet, trained the morning of.', durationMin: 240, requiredQuals: [], requiredEquipment: [], peopleNeeded: 1, window: 'Sat 4/25', status: 'open', assigneeIds: [], verifiedById: null, verifiedAt: null, blockReason: null },

  // Interpreter desk (A.9) — 1 in_progress, p-vega
  { id: 't-desk-01', needId: 'need-interpreter-desk', title: 'Interpret at the Tuesday services desk', detail: 'Interpret benefits enrollment at the Tuesday morning county services desk.', durationMin: 180, requiredQuals: ['spanish-interpreter'], requiredEquipment: [], peopleNeeded: 1, window: 'Tue mornings', status: 'in_progress', assigneeIds: ['p-vega'], verifiedById: null, verifiedAt: null, blockReason: null },
];

// ─── A.10 The AAR ────────────────────────────────────────────────────────────

export const aars: AAR[] = [
  {
    id: 'aar-duthie',
    needId: 'need-duthie-ramp',
    whatWasNeeded:
      'Alma Duthie, 79, came home from Hell\u2019s Pass Hospital after a hip replacement and could not manage the four front steps on Bijou Street. She needed a code-compliant ramp before the spring thaw turned the side yard to mud. The parish covered materials. Posted 24 February, met 3 March — seven days.',
    whoTurnedOut:
      'Nine residents across three squads. Priya Raghavan drew the plans and pulled the permit. Cal Ostrander hauled from Fairplay. Wes Delacroix, Owen Bradbury, and Hank Vasquez set footings in frozen ground on the 28th. Dana Whitlock, Duke Hollinger, and Tom Aguirre framed and decked it on the 1st. Junie Sparks walked it with Alma and moved the landing eight inches so she could reach the rail from her chair.',
    whatItTook:
      'Thirteen commitments, twelve kept and one waived. Twenty-nine person-hours. One truck, $612 in materials covered by the parish, and one county permit at no charge. No injuries. Longest single task was framing, four hours with four people. Duke Hollinger waived the footing shift — frozen ground, and he\u2019s seventy-one — and Hank Vasquez picked it up the same evening. A waived commitment counts against nobody. That is what it is for.',
    whatWeDoDifferently:
      'We bought lumber we already owned. Cal Ostrander had enough treated 2x8 in his barn to cover every stringer, and nobody checked the registry before driving to Fairplay. That\u2019s a ninety-minute round trip and $180 we didn\u2019t need to spend. Check materiel before you buy — that is the entire reason the registry exists. Second, we should have walked the landing with Alma before framing, not after. She caught the rail height in thirty seconds and we\u2019d have saved an hour of rework.',
    publishedAt: '2026-03-05T19:00:00-07:00',
    authorId: 'p-raghavan',
  },
];

// ─── A.11 Merchants (3) ──────────────────────────────────────────────────────

export const merchants: Merchant[] = [
  { id: 'm-tweek', business: 'Tweek Bros. Coffeehouse', offer: 'Drip coffee on the house, rep night.', honoredFor: 'Any member with an active streak.' },
  { id: 'm-citywok', business: 'City Wok', offer: 'Ten percent off, any Thursday.', honoredFor: 'Anyone who turned out for a surge in the last 30 days.' },
  { id: 'm-skeeters', business: "Skeeter's Bar", offer: 'First round after a surge closes.', honoredFor: 'Whole squad, when the AAR is filed.' },
];

// ─── A.12 Commitments ────────────────────────────────────────────────────────
// A full ledger (not capped at 20). One commitment per task-assignee pair across
// every need, so /need person/hours and the Duthie 12-kept count derive; plus the
// Duthie waiver (A.9) and Nora's 12 completed weekly reps + the pending one (A.12).

const taskById = (id: string): Task => {
  const t = tasks.find((x) => x.id === id);
  if (!t) throw new Error(`seed: unknown task ${id}`);
  return t;
};

const outcomeForTask = (status: Task['status']): Commitment['outcome'] =>
  status === 'verified' ? 'kept' : 'pending';

const ledgerFromTasks: Commitment[] = tasks.flatMap((t) => {
  const need = needs.find((n) => n.id === t.needId)!;
  return t.assigneeIds.map((personId) => ({
    id: `c-${t.id}-${personId}`,
    personId,
    taskId: t.id,
    madeAt: need.submittedAt,
    dueAt: need.submittedAt,
    outcome: outcomeForTask(t.status),
    isWeeklyRep: false,
    scopeMinutes: t.durationMin,
  }));
});

// A.9 — the 13th Duthie commitment: Hollinger waived the footing shift.
const duthieWaiver: Commitment = {
  id: 'c-ramp-hollinger-waived',
  personId: 'p-hollinger',
  taskId: 't-ramp-03',
  madeAt: '2026-02-26',
  dueAt: '2026-02-28',
  outcome: 'waived',
  isWeeklyRep: false, // the only non-rep waived commitment in the seed (A.9)
  scopeMinutes: taskById('t-ramp-03').durationMin,
};

// A.12 — Nora Beckett's last weekly reps. Twelve completed weeks (the /me strip)
// plus the pending current rep shown in the RepCard. Thursdays (repSlot).
// Range resolves the spec overlap per build instructions: 9 kept 12/18–2/12,
// waived 2/19, missed 2/26 & 3/5, pending 3/12. See NOTES_FOR_NILS.md #4.
const noraRepWeeks: { date: string; outcome: Commitment['outcome']; scope: number }[] = [
  { date: '2025-12-18', outcome: 'kept', scope: 20 },
  { date: '2025-12-25', outcome: 'kept', scope: 20 },
  { date: '2026-01-01', outcome: 'kept', scope: 20 },
  { date: '2026-01-08', outcome: 'kept', scope: 20 },
  { date: '2026-01-15', outcome: 'kept', scope: 20 },
  { date: '2026-01-22', outcome: 'kept', scope: 20 },
  { date: '2026-01-29', outcome: 'kept', scope: 20 },
  { date: '2026-02-05', outcome: 'kept', scope: 20 },
  { date: '2026-02-12', outcome: 'kept', scope: 20 },
  { date: '2026-02-19', outcome: 'waived', scope: 20 },
  { date: '2026-02-26', outcome: 'missed', scope: 20 },
  { date: '2026-03-05', outcome: 'missed', scope: 10 },
  { date: '2026-03-12', outcome: 'pending', scope: 5 },
];

const noraReps: Commitment[] = noraRepWeeks.map((w, i) => ({
  id: `c-nora-rep-${String(i + 1).padStart(2, '0')}`,
  personId: 'p-beckett',
  taskId: 'weekly-rep',
  madeAt: `${w.date}T00:00:00-07:00`,
  dueAt: `${w.date}T18:00:00-07:00`,
  outcome: w.outcome,
  isWeeklyRep: true,
  scopeMinutes: w.scope,
}));

export const commitments: Commitment[] = [
  ...ledgerFromTasks,
  duthieWaiver,
  ...noraReps,
];

// ─── A.13 Town history — aggregates that predate the ledger ───────────────────
// Aggregates covering needs closed BEFORE the current ledger window.
// Not derivable from needs[] — these stand in for South Park's prior 90 days.
export const townHistory = {
  needsClosedLast90Days: 9,
  medianDaysToMet: 6,
  retention6Month: 0.78,
  retention12Month: 0.61,
  lastSurge: { label: 'Middle Fork flood', date: '2026-03-09', respondersIn4Hours: 14 },
  priorSurge: { label: 'Hartsel grass fire', date: '2025-11-02', respondersIn6Hours: 9 },
  // Residents completing their weekly rep, 12 weeks ending 2026-03-12
  weeklyParticipation: [18, 19, 17, 20, 21, 19, 22, 20, 18, 21, 20, 21],
};

// ─── Initial demo state object (structuredClone target for resetDemo) ─────────

export const initialState = {
  people,
  needs,
  tasks,
  commitments,
};
