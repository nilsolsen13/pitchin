# PitchIn — MVP Build Spec v1.0

**Status:** Ready to build
**Target:** Clickable prototype, mock data only, deployed as a static site
**Builder:** Cursor (or equivalent AI coding agent)
**Source narrative:** `PitchIn_spec_v1.md` (pitch prose — read for tone, not for structure)

---

## 0. How to use this document

This spec is written to be executed without clarifying questions. Where it gives a literal string
in quotes, **use that string exactly**. Where it gives a hex value, **use that hex value exactly**.
Do not invent copy, do not invent resident names, do not substitute lorem ipsum, and do not
generate placeholder tasks named "Task 1."

All seed data is in **Appendix A** as ready-to-use TypeScript. Copy it in rather than regenerating
it. The numbers in the dashboards are *derived* from that seed data and must reconcile.

**Build order is in Appendix B.** Follow it — each phase has a verifiable checkpoint.

---

## 1. Product summary

**PitchIn** turns a town's unmet needs into taskable units, matches them to the capabilities its
residents actually have, and rewards the one thing civic life never measures: showing up when you
said you would, week after week.

The thesis, stated as the product argues it: civic volunteering does not fail on goodwill. It fails
on three things.

1. **Supply chain.** Demand is unstructured ("we need help"), capacity is invisible (nobody knows
   who owns a welder, a truck, or fluent Spanish), and matching happens on whoever's group text.
2. **Loop closure.** Nobody reports the outcome, so effort disappears into a void and people don't
   return.
3. **Cadence.** Service is treated as episodic and heroic — the campaign, the crisis, the annual
   volunteer day. We have excellent technology for building physical habits and essentially none
   for civic ones.

PitchIn fixes (1) and (2) with logistics doctrine and (3) with a reward system built around
reliability rather than heroism.

**Vocabulary note.** The product is named *PitchIn* — warm, plain, inviting. The vocabulary inside
it is operational and stays operational: **reps, squads, quals, surge, sustainment, show-rate,
AAR, standing, materiel**. Do not soften these into "sessions," "teams," "badges," or "reports."
The tension between the friendly name and the rigorous interior is intentional and is the
product's personality.

---

## 2. Locked decisions

| Dimension | Decision |
|---|---|
| Build type | Clickable prototype. Mock data only. No backend, no auth, no database, no API keys, no network calls. |
| Persistence | None. In-memory React state. Refresh resets to seed. This is intended. |
| Stack | Vite 8 + React 19 + TypeScript 6 + Tailwind v3 + react-router-dom v7 (declarative API) — **already scaffolded and committed; do not upgrade or swap** |
| Hosting | Static build (`dist/`) deployed to Vercel or Netlify. SPA rewrite required (§9.4). |
| Viewport | Desktop-first (1440px design target). Must not break below 768px, but mobile polish is not a goal. |
| Town | South Park, Park County, Colorado. Pop. 4,187. Elevation 9,800 ft. |
| Demo date | **Thursday, March 12, 2026.** Hardcode as `DEMO_TODAY`. Never use `new Date()` for display logic. |
| Hero persona | The requester (county, churches, schools, sports teams, neighbors) |
| Visual system | Dual: **Ops** palette for working screens, **Warm** palette for The Wall only |
| Routes | 9 (landing + 8 product screens) |
| Framing | Landing page carries the thesis; annotations toggle available on every product screen, default OFF |

### 2.1 The South Park rule

The town is the *South Park* of the TV show, **played completely straight**. This means:

- **Businesses, orgs, and landmarks carry the reference.** Tweek Bros. Coffeehouse, City Wok,
  Skeeter's Bar, Photo Dojo, Stark's Pond, South Park Elementary, Hell's Pass Hospital, the South
  Park Cows, Park County Sheriff's Office. These are the easter eggs.
- **Residents do not.** Every resident is an invented, plausible Colorado name. **No character
  from the show appears as a resident. No jokes. No references in resident-facing copy.**
- Surrounding geography is real Park County: Kenosha Pass, Red Hill, Tarryall, Fairplay, Hartsel,
  Alma, the Middle Fork of the South Platte.

Anyone who knows the show will notice. Anyone who doesn't will read an earnest Colorado mountain
town. Both readings must work. **If a copy choice would get a laugh, cut it.**

---

## 3. Personas, roles, and permissions

Three roles. The app shell has a **"Viewing as"** switcher (§7.1) so a reviewer can see all three
without logging in.

| Role | Demo identity | Sees | Can do |
|---|---|---|---|
| `resident` | Nora Beckett, Creek Side squad | Board, Registry, My Rep, Squad, Wall, Need detail | Claim open tasks she is qualified for; accept/decline her weekly rep |
| `requester` | Park County Emergency Management | Board, Post a Need, Registry, Wall, Need detail | Post needs; **verify** completed tasks on needs she owns |
| `admin` | Park County (local government) | All of the above **plus** Readiness dashboard | Read-only oversight. Cannot verify tasks. |

### 3.1 Permission rules that must be visible in the UI

These three exist because they are the anti-gaming argument made mechanical. If they aren't
enforced in the interface, the argument is just a claim.

1. **Only the requester who owns a need can verify its tasks.** In `resident` and `admin` roles,
   the "Verify" control on a task renders disabled with the tooltip
   `"Only the requester can verify a task."`
2. **Individual show-rate is squad-visible, not town-visible.** On the Wall and the Readiness
   dashboard, rankings are **squad-level only** — never a list of individuals by show-rate. On the
   Squad screen, individual show-rates are visible because you are a squadmate.
3. **One rep per week, capped.** The My Rep screen shows at most one active commitment. There is
   no "take another rep" control. Copy on the screen states the cap explicitly.

---

## 4. Data model

All types live in `src/types.ts`. Use these exactly.

```ts
// ─── Primitives ──────────────────────────────────────────────────────────────

export type ISODate = string;            // "2026-03-12"
export type ISODateTime = string;        // "2026-03-12T18:00:00-07:00"
export type Role = 'resident' | 'requester' | 'admin';

// ─── People and capability ───────────────────────────────────────────────────

export type QualId =
  | 'chainsaw' | 'pump-operator' | 'spanish-interpreter' | 'elder-checkin'
  | 'wildfire-prep' | 'meeting-minutes' | 'heavy-tow' | 'food-safety'
  | 'first-aid' | 'wfr' | 'generator' | 'plow' | 'muck-out'
  | 'livestock' | 'child-cleared' | 'ham-radio';

export interface Qual {
  id: QualId;
  name: string;                          // "Chainsaw Operator"
  category: 'Response' | 'Care' | 'Logistics' | 'Civic';
  demonstration: string;                 // how it is earned, one sentence
  holders: number;                       // DERIVED at build time from people[] — do not hardcode
}

export type EquipmentType =
  | 'truck-tow' | 'truck-plow' | 'trailer-stock' | 'generator'
  | 'trash-pump' | 'chainsaw' | 'ham-base' | 'dehumidifier';

export interface Equipment {
  id: string;
  type: EquipmentType;
  label: string;                         // "2015 Ford F-250, 12,000 lb tow"
  ownerId: string | null;                // null = organization-owned
  ownerOrgId: string | null;
  lastUsed: ISODate | null;              // null = never used since registration
}

export interface Person {
  id: string;
  name: string;
  age: number;
  squadId: string;
  quals: QualId[];
  languages: string[];                   // ["English", "Spanish (conversational)"]
  availability: string;                  // "Thursdays 5–9pm, Saturday mornings"
  repSlot: string;                       // "Thursday 6:00 PM"
  partnerId: string | null;              // named partner for the weekly rep
  keptCount: number;                     // commitments kept, all time
  missedCount: number;                   // commitments missed, all time
  streakWeeks: number;                   // personal unbroken weeks
  joinedDate: ISODate;
  // showRate is DERIVED: keptCount / (keptCount + missedCount). Never store it.
}

export interface Squad {
  id: string;
  name: string;                          // "Creek Side"
  memberIds: string[];                   // 4–8 members
  streakWeeks: number;                   // squad-held streak
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
  contact: string;                       // "Dispatch, Park County EM"
}

// ─── Needs and tasks ─────────────────────────────────────────────────────────

export type NeedMode = 'sustainment' | 'surge';
export type NeedStatus = 'open' | 'staffing' | 'in_progress' | 'met' | 'stalled';

export interface Need {
  id: string;
  title: string;
  rawText: string;                       // the original free-text submission, verbatim
  requesterOrgId: string;
  submittedAt: ISODateTime;
  mode: NeedMode;
  status: NeedStatus;
  taskIds: string[];
  metAt: ISODateTime | null;
  aarId: string | null;
  stallReason: string | null;            // shown on the board when status === 'stalled'
}

export type TaskStatus =
  | 'open' | 'claimed' | 'in_progress' | 'verified' | 'missed' | 'blocked';

export interface Task {
  id: string;
  needId: string;
  title: string;
  detail: string;                        // one sentence of context
  durationMin: number;
  requiredQuals: QualId[];               // empty array = anyone
  requiredEquipment: EquipmentType[];    // empty array = none
  peopleNeeded: number;
  window: string;                        // "Thu 3/12, afternoon"
  status: TaskStatus;
  assigneeIds: string[];
  verifiedById: string | null;           // must be a person acting for the requester org
  verifiedAt: ISODateTime | null;
  blockReason: string | null;            // required when status === 'blocked'
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
  scopeMinutes: number;                  // 20 standard, 10 after one miss, 5 after two
}

// ─── After-action reports ────────────────────────────────────────────────────

export interface AAR {
  id: string;
  needId: string;
  whatWasNeeded: string;
  whoTurnedOut: string;                  // prose, names people
  whatItTook: string;
  whatWeDoDifferently: string;
  publishedAt: ISODateTime;
  authorId: string;
}

// ─── Local reciprocity ───────────────────────────────────────────────────────

export interface Merchant {
  id: string;
  business: string;                      // "Tweek Bros. Coffeehouse"
  offer: string;                         // "Free drip coffee on rep night"
  honoredFor: string;                    // "Any member with an active streak"
}
```

### 4.1 Derived values — compute, never hardcode

Put these in `src/lib/derive.ts`. Every dashboard number must come from here.

```ts
showRate(p: Person): number              // p.keptCount / (p.keptCount + p.missedCount)
squadShowRate(s: Squad, people): number  // sum(kept) / sum(kept + missed) across members
townShowRate(people): number             // same, across all people
medianStreak(people): number             // median of streakWeeks
qualHolders(qualId, people): Person[]
equipmentCount(type, equipment): number
equipmentUtilization(equipment): number  // used in last 90 days / total registered
```

**Expected values from the seed in Appendix A — all independently verified.** These are the
canonical numbers. If your build produces anything different, the seed was transcribed wrong. Fix
the transcription, never the displayed number.

| Quantity | Value |
|---|---|
| Registered residents | 24 |
| Registered equipment items | 31 |
| Town show-rate | 915 kept / 94 missed = **90.7%** |
| Median unbroken participation | **19.5 weeks** |
| Squad show-rates | Creek Side 90.3% · Kenosha Pass 91.8% · Red Hill 92.0% · Tarryall 87.7% |
| Chainsaw-qualified | 12 |
| Pump operators | 1 |
| Spanish interpreters | 1 |
| Plow-qualified | 2 |
| Generators / tow trucks / plow trucks / trash pumps / chainsaws | 4 / 9 / 2 / 3 / 8 |
| Equipment utilization (90 days) | 19 of 31 = **61%** |
| Hansen flood | 11 tasks · 16 distinct people · 26.75 person-hours · 3 verified · 1 blocked |
| Duthie ramp | 6 tasks · 9 residents · 13 commitments (12 kept, 1 waived) · 29.0 person-hours |

---

## 5. State machines

### 5.1 Task lifecycle

```
open ──claim──▶ claimed ──start──▶ in_progress ──requester verifies──▶ verified
 │                  │                    │
 │                  └──unclaim──▶ open    └──window passes, nobody showed──▶ missed
 │
 └──requirement unmet──▶ blocked ──requirement met──▶ open
```

Rules:
- A task may only be claimed by a person holding **every** qual in `requiredQuals`.
- A task requiring equipment may only be claimed by a person who owns a matching `EquipmentType`,
  or whose squad has one registered.
- `blocked` requires a non-null `blockReason`. Blocked tasks appear on the board and dashboard as
  **capacity gaps**, not as failures. Copy must frame them as supply problems.
- **Only a person acting for the need's requester org can move a task to `verified`.**

### 5.2 Commitment lifecycle

```
pending ──person shows, requester verifies──▶ kept
   │
   ├──window passes, no-show──────────────▶ missed
   │
   └──excused (illness, travel, surge conflict)──▶ waived
```

`waived` is excluded from show-rate entirely — it is neither numerator nor denominator. This is
load-bearing: it is how the system avoids punishing someone for a hard month.

### 5.3 The weekly rep and the shrinking ask

Every member holds exactly one standing commitment: one small unit per week, at a fixed time, with
a named partner. The system pre-scopes it so there is nothing to decide and nothing to organize.

```
consecutiveMisses = 0  →  scopeMinutes = 20   state: STANDARD
consecutiveMisses = 1  →  scopeMinutes = 10   state: SCOPED_DOWN
consecutiveMisses ≥ 2  →  scopeMinutes = 5    state: KEEP_THE_CHAIN
```

**Tone rule, non-negotiable.** The shrinking ask must never guilt, shame, or count down. It states
the fact and reduces the ask. Approved copy per state is in §7.5. Do not write alternatives.

---

## 6. Design system

Two palettes. **Ops** is the default for every screen except The Wall. **Warm** is used *only* on
`/wall` and on the landing page (`/`). The switch is deliberate and should feel like walking from a
dispatch office into the town library.

### 6.1 Ops palette

```
--ops-bg            #0E1116   page background
--ops-surface       #161B22   cards, panels
--ops-raised        #1C232D   hover, nested surfaces
--ops-border        #2A3441   1px dividers
--ops-text          #E6EDF3   primary text
--ops-text-2        #8B98A9   secondary text, labels
--ops-text-3        #5E6B7D   muted, metadata
--ops-accent        #E8A33D   PitchIn signal amber — CTAs, active nav, focus rings
--ops-accent-dim    #6B4D1C   accent backgrounds at 20% feel

status-open         #6E7C8C
status-claimed      #4C8DD9
status-progress     #E8A33D
status-verified     #3FA66A
status-missed       #C4544A
status-blocked      #C4544A
mode-surge          #D9642E
mode-sustainment    #4C8DD9
```

### 6.2 Warm palette

```
--warm-paper        #F4EFE4   page background
--warm-paper-deep   #EAE2D2   card background
--warm-ink          #2A2620   primary text
--warm-ink-2        #6B6250   secondary text
--warm-rule         #C9BFA9   hairlines
--warm-stamp        #A63D2E   letterpress red — headings, stamps
--warm-green        #47643F   "met" markers
```

### 6.3 Typography

Load from Google Fonts in `index.html`.

```
Ops UI          Inter        400 / 500 / 600
Ops mono        JetBrains Mono  400 / 500     — IDs, counts, timestamps, stat numbers
Warm display    Oswald       600 / 700        — uppercase, letter-spacing 0.06em
Warm body       Inter        400 / 500
```

Scale (rem): `0.75 / 0.875 / 1 / 1.125 / 1.25 / 1.5 / 1.875 / 2.375 / 3 / 3.75`

**Rule:** every number that is a *measurement* — show-rate, counts, durations, streak weeks,
timestamps — renders in JetBrains Mono. This single choice does most of the work of making the
product read as operational rather than as a marketing site.

### 6.4 Geometry

- Ops radius: `6px`. Warm radius: `2px` (nearly square — letterpress, not app).
- Ops border: `1px solid var(--ops-border)`. Warm rule: `1px solid var(--warm-rule)`.
- Max content width: `1280px`, centered, `32px` gutters.
- Grid: 12-column, `24px` gap.
- **No drop shadows on ops screens.** Depth comes from surface value only. The Wall may use one
  soft shadow to suggest paper lift.

### 6.5 Component primitives

Build these in `src/components/` before any screen.

| Component | Props | Notes |
|---|---|---|
| `AppShell` | `children` | Top nav, role switcher, annotations toggle, reset button |
| `StatusChip` | `status: TaskStatus \| NeedStatus` | Dot + uppercase mono label, 11px, letterspaced |
| `ModeBadge` | `mode: NeedMode` | "SURGE" orange / "SUSTAINMENT" blue |
| `QualBadge` | `qualId`, `size` | Name + category color. Tooltip = the `demonstration` string |
| `MaterielChip` | `type: EquipmentType` | Icon + label, e.g. "TRUCK · TOW" |
| `ShowRateRing` | `value: number`, `size` | Circular arc, mono % in center |
| `StatCard` | `label`, `value`, `unit?`, `sub?` | Mono value at 2.375rem |
| `TaskRow` | `task`, `onClaim`, `canClaim` | Title, window, duration, quals, materiel, status, assignees |
| `PersonCard` | `person`, `showRate?` | Initials avatar, name, squad, quals |
| `NeedCard` | `need` | Board card — title, requester, mode, progress bar, age |
| `RepCard` | `commitment`, `state` | The weekly rep. Three visual states (§7.5) |
| `AnnotationMarker` | `n`, `text` | Numbered amber dot; click opens panel. Hidden when toggle off |
| `SquadStreakBar` | `squad` | Weeks + a 12-cell recent-weeks strip |

---

## 7. Screen specifications

Nine routes. Each section below gives layout, literal copy, and states.

### 7.0 `/` — Landing (WARM palette)

Single scrolling page. This is the only screen that argues rather than demonstrates.

**Section 1 — Hero**
- Wordmark: `PitchIn` — Oswald 700, 3.75rem, uppercase, letterspacing 0.06em, color `--warm-ink`
- Rule beneath, `--warm-stamp`, 3px, 120px wide
- Deck (Inter 400, 1.25rem, max-width 46rem):
  `"A town's unmet needs, matched to the capabilities its residents actually have — and a reward for the one thing civic life never measures: showing up when you said you would, week after week."`

**Section 2 — "Civic volunteering does not fail on goodwill."**
Three columns, each with an Oswald uppercase label, `--warm-stamp`:

- `SUPPLY CHAIN` — `"Demand is unstructured. Capacity is invisible. Nobody knows who owns a welder, a truck, or fluent Spanish, so matching happens on whoever's group text."`
- `LOOP CLOSURE` — `"Nobody reports the outcome, so effort disappears into a void and people don't come back."`
- `CADENCE` — `"Service is treated as episodic and heroic. We have excellent technology for building physical habits and essentially none for civic ones."`

**Section 3 — The claim** (full-width, `--warm-paper-deep`, centered, 1.875rem, max-width 52rem)
`"Volunteering forty hours once and then vanishing is worth less than twenty minutes a week for two years. PitchIn is the first system that says so out loud."`

**Section 4 — "Any metric becomes a target."**
Heading in Oswald uppercase. Four short lines, each preceded by a `--warm-stamp` square bullet:
- `"Show-rate can't be farmed — commitments are capped at one rep a week."`
- `"Tasks are verified by the requester, not self-reported."`
- `"Rankings are squad-level, so individual glory-seeking has nowhere to go."`
- `"Rewards stay symbolic and local, so no one has a financial reason to game them."`

Closing line beneath, italic, `--warm-ink-2`:
`"If we get this wrong, we crowd out the intrinsic motive and the whole thing dies. So the reward layer stays deliberately thin."`

**Section 5 — CTA**
- Button: `"Enter South Park"` — solid `--warm-stamp`, white text, Oswald uppercase, 1.125rem,
  radius 2px. Links to `/board`.
- Beneath, mono 0.875rem, `--warm-ink-2`:
  `"Working prototype · South Park, Park County, Colorado · Pop. 4,187 · Thursday, March 12, 2026"`

---

### 7.1 `AppShell` — persistent chrome (OPS palette)

Present on routes 1–8. Not on `/`.

**Top bar**, 64px, `--ops-surface`, bottom border:
- Left: `PitchIn` wordmark (Inter 600, 1.125rem, `--ops-text`) → links to `/`
- Center nav (Inter 500, 0.875rem, `--ops-text-2`; active = `--ops-accent` + 2px underline):
  `Board` · `Post a Need` · `Registry` · `My Rep` · `Readiness` · `The Wall`
  - `Post a Need` renders only for `requester`
  - `Readiness` renders only for `admin`
  - `My Rep` renders only for `resident`
- Right cluster:
  1. **Viewing as** select — mono 0.75rem label `"VIEWING AS"` above a dropdown:
     - `"Nora Beckett · Resident"`
     - `"Park County EM · Requester"`
     - `"Park County · Administrator"`
  2. **Annotations toggle** — switch labelled `"Explain this screen"`, default **off**
  3. **Reset** — ghost button `"Reset demo"`, restores seed state

**Second bar**, 36px, `--ops-bg`, mono 0.75rem, `--ops-text-3`:
`"SOUTH PARK, CO  ·  THU 12 MAR 2026  ·  TOWN SHOW-RATE 90.7%  ·  1 ACTIVE SURGE"`

---

### 7.2 `/board` — Needs Board

Two-column: main column (8 cols) and right rail (4 cols).

**Header**
- H1: `"Needs Board"` (1.875rem, Inter 600)
- Sub: `"Six needs. Five active, one met. One surge. One stalled."` (`--ops-text-2`)

(The met need — the Duthie ramp — stays on the board under `ALL` and `MET`. A board that hides
what got done is a board that can't close the loop.)

**Filters** — pill row, mono 0.75rem uppercase: `ALL` · `SURGE` · `SUSTAINMENT` · `STALLED` ·
`MET`. Default `ALL`. Filtering is real and updates the list.

**Need cards** — one per need, ordered: surge first, then stalled, then by age descending. Each card:
- `ModeBadge` top-left, `StatusChip` top-right
- Title (1.125rem Inter 600)
- Requester line: `"{org.name} · posted {N} days ago"` (mono 0.75rem, `--ops-text-3`)
- Progress bar: verified tasks / total tasks, with mono label `"{v}/{t} TASKS VERIFIED"`
- Qual/materiel chips for unfilled requirements, max 4 then `"+N more"`
- Cards link to `/need/{id}`

The **stalled** card (Eleanor Vasquez) additionally renders a `--status-blocked` left border 3px
and a diagnosis line in mono 0.75rem:
`"CAPACITY GAP — both plow-equipped trucks registered to Kenosha Pass, 22 min from Tarryall Rd."`

> This card is the most important object on the screen. An all-green board reads as fiction. Do
> not soften, hide, or auto-resolve it.

**Right rail**
1. `RepCard` — "Your rep this week" (only in `resident` role; see §7.5 for states). Compact
   variant, links to `/me`.
2. **Town capacity** panel — mono list:
   `"24 RESIDENTS REGISTERED"` / `"31 ASSETS REGISTERED"` / `"16 QUALS IN CIRCULATION"` /
   `"4 SQUADS"`, with a `"View registry →"` link.
3. **This month on the wall** — one line per met need, with a `"See the wall →"` link.

**Annotations (3):**
1. On the stalled card — `"Unstaffed needs are diagnosed, not scolded. The registry knows exactly why this one hasn't moved: the equipment exists, it's just on the wrong side of the basin. That's a supply failure, not an apathy problem."`
2. On the mode badges — `"Sustainment is the weekly rep. Surge is the flood, the fire, the funeral. The whole point of drilling weekly is that when a surge comes, the town already knows who has a truck and who answers their phone."`
3. On the rep card — `"One rep. Twenty minutes. Fixed time, named partner. Nothing to decide and nothing to organize — the two places civic commitment usually dies."`

---

### 7.3 `/post` — Post a Need  *(requester role only)*

The screen that makes the product legible. Three stages on one route.

**Stage 1 — Compose**
- H1: `"Post a need"`
- Sub: `"Describe it the way you'd say it out loud. We'll break it into taskable units."`
- Textarea, 6 rows, mono 0.9375rem, placeholder:
  `"e.g. The Middle Fork came up over the bank behind the Hansen place. Basement's flooded, there's mud through the ground floor, and they've got a seven-year-old."`
- Below: requester select (pre-filled `"Park County Emergency Management"`), mode radio
  (`Sustainment` / `Surge`, default `Surge`)
- Primary button: `"Decompose"` — `--ops-accent`, dark text

**Prefill control.** Beside the textarea, a ghost button `"Use the Hansen flood"` fills the
textarea with the exact `rawText` from `need-hansen-flood` in Appendix A. This guarantees the demo
works even if the reviewer types nothing.

**Stage 2 — Decomposition (staged reveal, ~2.4s total)**

Purely `setTimeout`-driven. **No network calls.** Sequence:

| t (ms) | Event |
|---|---|
| 0 | Textarea locks, dims to 60%. Amber scanline sweeps down it once, 600ms |
| 300 | Mono status line appears: `"PARSING REQUIREMENTS…"` |
| 800 | Status → `"MATCHING AGAINST REGISTRY…"` |
| 1300 | Status → `"11 TASKABLE UNITS IDENTIFIED"` |
| 1500+ | Task rows fade+slide in, one every 90ms, in seed order |
| after last | Summary bar appears (below) |

Summary bar, mono 0.875rem:
`"11 TASKS · 3 REQUIRE A TRUCK · 1 REQUIRES A PUMP OPERATOR · 1 BLOCKED ON MATERIEL"`

Each revealed row shows: title, duration, `QualBadge`s, `MaterielChip`s, `peopleNeeded`. Rows are
editable in appearance (an inline pencil affordance) — the pencil need not do anything beyond
focusing the title text.

**Stage 3 — Confirm**
- Buttons: `"Post to the board"` (primary) and `"Start over"` (ghost)
- `"Post to the board"` navigates to `/need/hansen-flood`

**Annotations (2):**
1. On the status line — `"Turning free-text need into structured, staffable tasks is the one genuinely hard technical problem here. Every task carries time, skill, and materiel requirements, because a task nobody is qualified to do isn't a task — it's a wish."`
2. On the summary bar — `"'Help the Hansens after the flood' becomes eleven tasks, three of which need a truck and one of which needs someone who can operate a pump. That's the difference between a group text and a supply chain."`

---

### 7.4 `/need/:id` — Need Detail

Deep dive. `need-hansen-flood` is the canonical one; the route must also render the other five.

**Header block**
- `ModeBadge` + `StatusChip`
- H1: need title
- Meta row (mono 0.75rem): `"REQUESTED BY {org} · POSTED {date} · {N} DAYS OPEN"`
- Original text in a quote block, `--ops-raised`, left border 3px `--ops-accent`, italic, labelled
  `"AS SUBMITTED"`

**Progress strip** — 4 `StatCard`s. **All four are derived, not hardcoded:**
`TASKS VERIFIED` 3/11 · `PEOPLE COMMITTED` 16 · `PERSON-HOURS COMMITTED` 26.75 · `CAPACITY GAPS` 1

(`PEOPLE COMMITTED` = distinct assignees across the need's tasks. `PERSON-HOURS COMMITTED` =
`Σ durationMin × assignees.length / 60`. `CAPACITY GAPS` = tasks with status `blocked`.)

**Task list** — `TaskRow` per task, grouped by status in this order: `blocked`, `open`, `claimed`,
`in_progress`, `verified`. Group headers in mono uppercase with counts.

Each `TaskRow` shows:
- Status dot + title + one-line detail
- Right side: window, duration, `peopleNeeded`
- Chips row: required quals, required materiel
- Assignee avatars with names on hover
- **Action button, role-dependent:**
  - `resident` + task open + qualified → `"Claim"` (enabled)
  - `resident` + task open + not qualified → `"Claim"` disabled, tooltip
    `"Requires {qual name}. Earned by demonstration — see the registry."`
  - `requester` (owner) + task `in_progress` → `"Verify"` (enabled)
  - any other role + `in_progress` → `"Verify"` disabled, tooltip
    `"Only the requester can verify a task."`

**Claiming behavior (light state).** Clicking `"Claim"` as Nora Beckett: task → `claimed`, her
avatar appears, `PEOPLE COMMITTED` increments, and a mono toast appears bottom-right:
`"COMMITMENT LOGGED · THU 12 MAR · COUNTS TOWARD YOUR SHOW-RATE"`

**Blocked task treatment.** Task 11 renders with a `--status-blocked` border and its `blockReason`
in an inset panel:
`"CAPACITY GAP — no well-water test kit registered in South Park. Nearest is Park County Public Health, Fairplay. Flagged to the quarterly task menu."`

**Annotations (3):**
1. On the "AS SUBMITTED" block — `"The original words are kept verbatim and shown next to the structured version. Nobody has to trust that the decomposition was faithful — they can check."`
2. On the disabled Verify button — `"Tasks are verified by the requester, not self-reported. This is the single most important anti-gaming defense in the system, and it costs nothing to enforce."`
3. On the blocked task — `"A blocked task is inventory intelligence. It tells the town what it doesn't own yet — and it goes on the quarterly task menu that members with standing get to vote on."`

---

### 7.5 `/me` — My Rep  *(resident role only)*

Viewed as **Nora Beckett**, who has missed two weeks. This screen carries the most original idea in
the product, so its copy is fully prescribed.

**Left column (8 cols)**

`RepCard`, large variant. Nora's state is `KEEP_THE_CHAIN`. Render:
- Mono eyebrow: `"YOUR REP · THURSDAY 12 MARCH · 6:00 PM"`
- Headline (1.5rem): `"Call Alma Duthie and confirm she's got groceries through the weekend."`
- Meta row: `"5 MINUTES"` · `"WITH JUNIE SPARKS"` · `"CREEK SIDE"`
- Body, `--ops-text-2`:
  `"You've missed the last two. That happens. This one is five minutes — enough to keep the chain alive."`
- Buttons: `"I'm on it"` (primary) · `"Can't this week"` (ghost)

**All three states must be reachable.** Provide a small mono control beneath the card labelled
`"DEMO: REP STATE"` with three options — `STANDARD` / `SCOPED DOWN` / `KEEP THE CHAIN`.

| State | Headline | Meta | Body |
|---|---|---|---|
| `STANDARD` | `"Walk the Tarryall Road culverts and photograph any blockage."` | `20 MINUTES` · `WITH JUNIE SPARKS` | `"Same time, same partner, every week. Nothing to decide."` |
| `SCOPED_DOWN` | `"Check the Stark's Pond warming hut is stocked."` | `10 MINUTES` · `WITH JUNIE SPARKS` | `"You missed last week, so this one's smaller. No need to make it up."` |
| `KEEP_THE_CHAIN` | `"Call Alma Duthie and confirm she's got groceries through the weekend."` | `5 MINUTES` · `WITH JUNIE SPARKS` | `"You've missed the last two. That happens. This one is five minutes — enough to keep the chain alive."` |

**Clicking `"Can't this week"`** logs a `waived` commitment and shows the toast:
`"WAIVED · DOES NOT COUNT AGAINST YOUR SHOW-RATE"` — then the card renders the waived state:
`"Noted. Nothing counts against you. Junie's covering the call."`

Beneath the rep card, a **12-week strip**: one cell per week, `verified` green / `missed` red /
`waived` slate. Nora's last two cells are red. Label in mono: `"YOUR LAST 12 WEEKS"`.

**Right column (4 cols)**
1. `ShowRateRing` at 76%, mono caption `"25 KEPT · 8 MISSED"`, and beneath, `--ops-text-3`:
   `"Show-rate is commitments kept over commitments made. Not hours. Not tasks."`
2. **Squad panel** — `"Creek Side · 31 weeks"` with a note in `--ops-text-2`:
   `"Creek Side held the line while you were out. Streaks belong to the squad."`
   Link: `"See your squad →"` → `/squad/creek-side`
3. **Your quals** — `QualBadge` list: `Child Supervision Cleared`, `First Aid / CPR`. Beneath, a
   muted line: `"Quals are earned by demonstration and determine what you get called for in a surge."`
4. **The cap** — mono panel: `"1 REP / WEEK · CAP ENFORCED"` with body text
   `"You can't take a second rep. Volume isn't the metric."`

**Annotations (3):**
1. On the rep card — `"Miss a week and it doesn't guilt you — it shrinks the ask. Miss two and it offers five minutes to keep the chain alive. Every habit system in fitness knows this. No civic system does it."`
2. On the show-rate ring — `"Twenty minutes a week for two years beats forty hours once. This number is the whole thesis, and it's why 'commitment' is a first-class record in the data model rather than a side effect of finishing a task."`
3. On the squad panel — `"Streaks are held by the squad, not the individual. The person having a hard month gets carried instead of shamed, and the social pressure is the good kind — people you know are counting on you."`

---

### 7.6 `/squad/:id` — Squad Detail

Canonical: `/squad/creek-side`.

- H1: `"Creek Side"`, mono sub: `"8 MEMBERS · FORMED 14 JUN 2024 · STANDING: SPONSORING"`
- `SquadStreakBar`: `"31 WEEKS UNBROKEN"` + 12-cell recent strip
- Stat row: `SQUAD SHOW-RATE 90.3%` · `MEMBERS 8` · `QUALS HELD 11` · `ASSETS 6`
- Member grid — `PersonCard` per member with individual show-rate ring, quals, equipment
- **Visibility note panel**, mono 0.75rem, `--ops-text-3`:
  `"You can see individual show-rates because you're a squadmate. The town cannot. Public rankings are squad-level only."`
- **Coverage panel** — which quals the squad holds and which it lacks, e.g.
  `"NO PUMP OPERATOR"`, `"NO PLOW"` in `--status-missed`

**Annotation (1):** `"Four to eight neighbors. Small enough that you know everyone, large enough to absorb a bad month. The squad is the unit of accountability precisely so the individual isn't."`

---

### 7.7 `/registry` — Capability Registry

- H1: `"Capability Registry"`
- Sub: `"What the town actually has. Capability, not intention."`
- Search input, placeholder `"Search a skill, a language, a piece of equipment…"` — real
  client-side filter across person name, qual name, language, equipment label.
- Filter pills: `PEOPLE` · `QUALS` · `EQUIPMENT` (default `QUALS`)

**Headline strip** — four mono `StatCard`s. These must be computed and must match the seed:
`4 GENERATORS` · `9 TOW-CAPABLE TRUCKS` · `12 CHAINSAW-QUALIFIED` · `1 BILINGUAL PARAMEDIC`

**Quals view** — one row per qual: name, category, holder count, holder avatars, `demonstration`
text. Rows with `holders === 1` render a `--status-missed` mono tag `"SINGLE POINT OF FAILURE"`.
This applies to **Pump Operator** and **Spanish Interpreter**.

**Equipment view** — grouped by type, each item with owner and `lastUsed`. Items with
`lastUsed === null` render a mono tag `"NEVER USED"` in `--ops-text-3`.

**Utilization panel** (right): `"19 of 31 registered assets used in the last 90 days — 61%"` with
the line:
`"An idle welder is a supply failure, not an apathy problem."`

**Annotations (2):**
1. On the single-point-of-failure tags — `"Three trash pumps in town and one person qualified to run one. The registry doesn't just find capacity — it finds the places where the town is one person's bad week away from being unable to respond."`
2. On the utilization panel — `"Percent of registered capacity actually used is a metric no volunteer program tracks, because most of them don't know what they have."`

---

### 7.8 `/readiness` — Readiness Dashboard  *(admin role only)*

The local-government surface. Dense, operational, boardroom-printable.

- H1: `"Readiness"`, sub `"South Park, Park County · Thursday 12 March 2026"`

**Row 1 — five `StatCard`s** (these are "what good looks like" from the source spec):

| Label | Value | Sub |
|---|---|---|
| `TOWN SHOW-RATE` | `90.7%` | `"915 kept / 94 missed"` |
| `MEDIAN UNBROKEN WEEKS` | `19.5` | `"retention at 6 mo: 78%  ·  12 mo: 61%"` |
| `MEDIAN TIME TO MET` | `6 days` | `"last 90 days, 9 needs"` (from `townHistory`, §A.13) |
| `CAPACITY UTILIZATION` | `61%` | `"19 of 31 registered assets, 90 days"` |
| `SURGE RESPONSE` | `4 hrs` | `"14 residents fielded, Middle Fork flood"` |

**Row 2 — Squad standings** (left, 7 cols). **Squad-level only. Never list individuals here.**

| Squad | Show-rate | Streak | Members | Standing |
|---|---|---|---|---|
| Red Hill | 92.0% | 44 wk | 5 | Sponsoring |
| Kenosha Pass | 91.8% | 38 wk | 6 | Sponsoring |
| Creek Side | 90.3% | 31 wk | 8 | Sponsoring |
| Tarryall | 87.7% | 19 wk | 5 | Established |

Beneath the table, mono 0.75rem `--ops-text-3`:
`"Individual show-rates are not published. Rankings are squad-level by design."`

**Row 2 — Capacity gaps** (right, 5 cols). Three items, each with a `--status-blocked` marker:
1. `"PUMP OPERATOR — 3 pumps registered, 1 qualified operator"`
2. `"PLOW COVERAGE — 2 plow trucks, both registered to Kenosha Pass. Tarryall and Red Hill uncovered."`
3. `"SPANISH INTERPRETER — 1 qualified. Tuesday county services desk has no backup."`

**Row 3 — Participation over 12 weeks.** Simple bar chart, hand-rolled with divs (no chart
library). One bar per week = residents completing their rep. Values, weeks ending Dec 25 → Mar 12:
`18, 19, 17, 20, 21, 19, 22, 20, 18, 21, 20, 21`. Y-axis label mono: `"RESIDENTS COMPLETING REP"`.

**Row 4 — Needs ledger.** Table of all 6 needs: title, requester, mode, posted, status, days open,
tasks verified/total.

**Annotations (2):**
1. On median unbroken weeks — `"Retention at 6 and 12 months is the number no volunteer program publishes. It's the only one that predicts whether a town can respond next year."`
2. On capacity gaps — `"This is what a government actually buys. Not a volunteer list — a readiness picture, with the gaps named specifically enough to fix with a purchase order."`

---

### 7.9 `/wall` — The Wall  *(WARM palette)*

The public board. This screen must feel like paper on a wall at the hardware store, not like
software. It is deliberately the least interactive screen in the product.

**Masthead**
- `THE WALL` — Oswald 700, 3rem, uppercase, letterspacing 0.08em, `--warm-ink`
- Rule, `--warm-stamp`, 3px
- Mono sub: `"SOUTH PARK, COLORADO · MARCH 2026 · POSTED AT THE LIBRARY, TWEEK BROS., AND THE HARDWARE STORE"`

**Section 1 — `MET THIS MONTH`**
One entry: the Duthie ramp. Card, `--warm-paper-deep`, 2px radius:
- Title: `"Wheelchair ramp — Alma Duthie, Bijou Street"`
- Stamp graphic, `--warm-green`, rotated -6°, Oswald uppercase: `"MET · 3 MARCH"`
- Line: `"Requested by United Methodist Church of South Park. Posted 24 February. Met in 7 days."`
- `"Turned out: 9 residents · 13 commitments · 12 kept, 1 waived"`

**Section 2 — `AFTER-ACTION REPORT`**
Full AAR for the ramp, four labelled blocks in Oswald uppercase with prose beneath: `WHAT WAS
NEEDED` / `WHO TURNED OUT` / `WHAT IT TOOK` / `WHAT WE'D DO DIFFERENTLY`. Text is in Appendix A —
use verbatim. Signature line: `"— Filed by Priya Raghavan, Creek Side · 5 March 2026"`.

**Section 3 — `STILL OPEN`**
Three entries in a plain list, each with days-open in mono. The Vasquez driveway shows
`"6 DAYS · NEEDS A PLOW TRUCK ON THE TARRYALL SIDE"` in `--warm-stamp`.

**Section 4 — `SQUADS`**
Four squads with streak weeks in large Oswald numerals. **No individual names. No show-rates.**
Caption: `"Streaks are held by the squad."`

**Section 5 — `HONORED LOCALLY`**
Merchant reciprocity, three entries (Appendix A). Caption beneath:
`"Kept small and local on purpose. The reward is recognition by your own town, not a gift-card economy."`

**Footer**, mono, `--warm-ink-2`:
`"The digital system exists to feed this board."`

**Annotations (2):**
1. On the AAR — `"Every completed need gets a short public after-action report. Effort becomes visible and legible, which is what actually produces the next turnout. Most volunteer software has no concept of an outcome at all."`
2. On the 'what we'd do differently' block — `"An honest AAR names what went wrong. This one says the town bought lumber it already owned — which is exactly the failure the registry exists to prevent, admitted in public."`

---

## 8. Interaction specifications

### 8.1 Global demo state

One React context, `DemoStateProvider`, in `src/state/DemoState.tsx`. Holds:

```ts
{
  role: Role;
  annotationsOn: boolean;
  people: Person[];
  needs: Need[];
  tasks: Task[];
  commitments: Commitment[];
  repState: 'STANDARD' | 'SCOPED_DOWN' | 'KEEP_THE_CHAIN' | 'WAIVED' | 'ACCEPTED';
  toast: string | null;
}
```

Actions: `setRole`, `toggleAnnotations`, `claimTask`, `verifyTask`, `setRepState`, `acceptRep`,
`waiveRep`, `postNeed`, `resetDemo`.

`resetDemo()` re-imports from `src/data/seed.ts` via a `structuredClone` of the initial object.
**Never mutate the seed module directly** — every action must produce new arrays, or reset will
appear to do nothing.

### 8.2 Annotations

- Off by default. Toggle in the shell, persists across route changes within the session.
- When on: numbered amber circles (20px, `--ops-accent`, dark numeral) anchored to the elements
  named in §7. On The Wall and landing, the marker uses `--warm-stamp`.
- Clicking a marker opens a panel anchored beside it: mono uppercase label `"NOTE {n}"`, then the
  annotation text at 0.875rem, max-width 22rem. Click-outside or Esc closes.
- Annotation text lives in `src/data/annotations.ts` keyed by `{route}:{n}`.

### 8.3 Toasts

Bottom-right, `--ops-raised`, 1px border, mono 0.75rem uppercase, amber left border 3px, auto-
dismiss after 4s. Used for: commitment logged, task verified, rep accepted, rep waived, demo reset.

### 8.4 Reset

`"Reset demo"` restores seed state, sets role back to `resident`, annotations off, rep state to
`KEEP_THE_CHAIN`, and navigates to `/board`. Toast: `"DEMO RESET"`.

### 8.5 Motion

- Route transitions: none. Instant.
- Task reveal in decomposition: `opacity 0→1`, `translateY 8px→0`, 220ms `ease-out`, 90ms stagger.
- Toast: slide up 12px + fade, 180ms.
- Everything else: `transition: colors 120ms ease`.
- **Respect `prefers-reduced-motion`:** skip the scanline and stagger; reveal all tasks at once
  after 400ms so the flow still reads.

---

## 9. Engineering

### 9.1 File structure

```
pitchin/
├── index.html                  Google Fonts links, <title>PitchIn — South Park, CO</title>
├── package.json
├── vite.config.ts
├── tailwind.config.ts          palettes + font families as theme extensions
├── vercel.json                 SPA rewrite
├── netlify.toml                SPA redirect
└── src/
    ├── main.tsx
    ├── App.tsx                 router + DemoStateProvider
    ├── types.ts                §4 verbatim
    ├── data/
    │   ├── seed.ts             Appendix A — people, squads, orgs, quals, equipment,
    │   │                       needs, tasks, commitments, aars, merchants
    │   └── annotations.ts      all annotation copy, keyed by route:n
    ├── lib/
    │   ├── derive.ts           §4.1 computed values
    │   └── format.ts           date, duration, percent formatters
    ├── state/
    │   └── DemoState.tsx
    ├── components/             §6.5 primitives
    └── screens/
        ├── Landing.tsx     Board.tsx      PostNeed.tsx
        ├── NeedDetail.tsx  MyRep.tsx      SquadDetail.tsx
        ├── Registry.tsx    Readiness.tsx  Wall.tsx
```

### 9.2 Routing

```
/                     Landing        (warm, no shell)
/board                Board
/post                 PostNeed       redirect → /board if role !== 'requester'
/need/:needId         NeedDetail
/me                   MyRep          redirect → /board if role !== 'resident'
/squad/:squadId       SquadDetail
/registry             Registry
/readiness            Readiness      redirect → /board if role !== 'admin'
/wall                 Wall           (warm, shell retained)
*                     redirect → /
```

Switching role while on a route you can no longer see redirects to `/board` with the toast
`"VIEW CHANGED · {ROLE}"`.

### 9.3 Palette implementation

Define both palettes as CSS custom properties on `:root` in `index.css`. Apply
`data-surface="ops"` or `data-surface="warm"` to a wrapper per screen, and scope semantic Tailwind
tokens (`bg-surface`, `text-primary`, `border-rule`) to that attribute. This keeps components
palette-agnostic — the same `StatCard` works on both screens.

**Do not implement a dark-mode toggle.** Ops is dark and warm is light by design; they are not
themes of each other.

### 9.4 Deployment — do not skip

Client-side routing 404s on refresh without a rewrite. This is the single most common way an
otherwise finished prototype breaks in front of a reviewer.

`vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

`netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 9.5 Non-goals — do not build these

No authentication. No database or localStorage. No API routes or serverless functions. No real LLM
call. No chart library. No component library (Material, shadcn, Chakra). No animation library. No
i18n. No tests. No email or SMS. No image assets — avatars are CSS initials circles.

---

## Appendix A — Seed data

Transcribe into `src/data/seed.ts`. Do not regenerate, abbreviate, or substitute.

### A.1 Constants

```ts
export const DEMO_TODAY = '2026-03-12';
export const TOWN = {
  name: 'South Park',
  county: 'Park County',
  state: 'Colorado',
  population: 4187,
  elevationFt: 9800,
};
```

### A.2 Quals (16)

| id | name | category | demonstration |
|---|---|---|---|
| `chainsaw` | Chainsaw Operator | Response | "Felled and bucked a standing dead under observation." |
| `pump-operator` | Pump Operator | Response | "Primed, ran, and cleared a trash pump on a live drawdown." |
| `spanish-interpreter` | Spanish Interpreter | Civic | "Interpreted a full county services session, reviewed by staff." |
| `elder-checkin` | Elder Check-In | Care | "Completed the Park County welfare-check protocol with a partner." |
| `wildfire-prep` | Wildfire Prep | Response | "Cleared defensible space to county standard on two properties." |
| `meeting-minutes` | Meeting Minutes | Civic | "Filed minutes for three public meetings, accepted by the clerk." |
| `heavy-tow` | Heavy Tow / Trailering | Logistics | "Backed and placed a loaded 20-foot trailer under observation." |
| `food-safety` | Food Safety | Care | "Current ServSafe handler card." |
| `first-aid` | First Aid / CPR | Care | "Current Red Cross certification." |
| `wfr` | Wilderness First Responder | Response | "Current 80-hour WFR certification." |
| `generator` | Generator Operator | Logistics | "Sited, grounded, and load-tested a portable generator." |
| `plow` | Snow Removal — Plow | Logistics | "Cleared two residential drives to standard without property damage." |
| `muck-out` | Structural Muck-Out | Response | "Completed flood-response muck-out training with respirator fit test." |
| `livestock` | Livestock Handling | Logistics | "Moved and penned cattle under observation." |
| `child-cleared` | Child Supervision Cleared | Care | "Background check on file with the school district." |
| `ham-radio` | Ham Radio Operator | Response | "Current FCC Technician license or above." |

### A.3 Squads (4)

| id | name | members | streakWeeks | standing | formed |
|---|---|---|---|---|---|
| `creek-side` | Creek Side | 8 | 31 | Sponsoring | 2024-06-14 |
| `kenosha-pass` | Kenosha Pass | 6 | 38 | Sponsoring | 2024-03-08 |
| `red-hill` | Red Hill | 5 | 44 | Sponsoring | 2024-01-19 |
| `tarryall` | Tarryall | 5 | 19 | Established | 2025-04-11 |

### A.4 People (24)

`repSlot` is `"Thursday 6:00 PM"` for all Creek Side and Red Hill members, `"Tuesday 7:00 PM"` for
Kenosha Pass, `"Saturday 9:00 AM"` for Tarryall. Languages default to `["English"]` unless noted.

**Creek Side** (`creek-side`)

| id | name | age | quals | kept | missed | streak | partner | notes |
|---|---|---|---|---|---|---|---|---|
| `p-whitlock` | Dana Whitlock | 41 | chainsaw, muck-out, first-aid | 47 | 3 | 31 | `p-delacroix` | |
| `p-ferrin` | Ray Ferrin | 58 | pump-operator, generator, ham-radio, chainsaw | 68 | 2 | 46 | `p-ostrander` | **only pump operator in town** |
| `p-raghavan` | Priya Raghavan | 34 | meeting-minutes, food-safety | 22 | 3 | 12 | `p-sparks` | filed the ramp AAR |
| `p-ostrander` | Cal Ostrander | 63 | heavy-tow, livestock, chainsaw | 41 | 4 | 27 | `p-ferrin` | |
| `p-beckett` | Nora Beckett | 29 | child-cleared, first-aid | 25 | 8 | 3 | `p-sparks` | **the `resident` demo persona** |
| `p-aguirre` | Tom Aguirre | 47 | chainsaw, wildfire-prep | 34 | 6 | 18 | `p-whitlock` | |
| `p-sparks` | Junie Sparks | 52 | food-safety, elder-checkin | 40 | 3 | 22 | `p-beckett` | Nora's named partner |
| `p-delacroix` | Wes Delacroix | 38 | muck-out, chainsaw | 31 | 4 | 15 | `p-aguirre` | |

**Kenosha Pass** (`kenosha-pass`)

| id | name | age | quals | kept | missed | streak | partner | notes |
|---|---|---|---|---|---|---|---|---|
| `p-vega` | Marisol Vega | 36 | spanish-interpreter, wfr, first-aid | 72 | 3 | 41 | `p-mwangi` | **the bilingual paramedic.** Languages: English, Spanish (native) |
| `p-tanaka` | Bud Tanaka | 66 | plow, generator, heavy-tow | 58 | 5 | 38 | `p-grange` | |
| `p-grange` | Hollis Grange | 44 | plow, heavy-tow | 33 | 5 | 20 | `p-tanaka` | |
| `p-mwangi` | Estelle Mwangi | 31 | wfr, elder-checkin | 27 | 3 | 16 | `p-vega` | |
| `p-pinkerton` | Andy Pinkerton | 55 | chainsaw, wildfire-prep, ham-radio | 62 | 4 | 33 | `p-ko` | |
| `p-ko` | Roseanne Ko | 49 | food-safety, meeting-minutes | 17 | 4 | 9 | `p-pinkerton` | |

**Red Hill** (`red-hill`)

| id | name | age | quals | kept | missed | streak | partner | notes |
|---|---|---|---|---|---|---|---|---|
| `p-marchetti` | Gil Marchetti | 60 | chainsaw, generator | 76 | 4 | 44 | `p-hollinger` | |
| `p-reyes` | Tasha Reyes | 27 | child-cleared | 20 | 4 | 11 | `p-sorokin` | Languages: English, Spanish (conversational) — **not** interpreter-qualified |
| `p-bradbury` | Owen Bradbury | 43 | muck-out, first-aid, chainsaw | 36 | 4 | 24 | `p-marchetti` | |
| `p-sorokin` | Lena Sorokin | 39 | wildfire-prep, meeting-minutes | 14 | 4 | 6 | `p-reyes` | |
| `p-hollinger` | Duke Hollinger | 71 | livestock, elder-checkin, chainsaw | 49 | 1 | 52 | `p-bradbury` | longest streak in town |

**Tarryall** (`tarryall`)

| id | name | age | quals | kept | missed | streak | partner | notes |
|---|---|---|---|---|---|---|---|---|
| `p-lindqvist` | Petra Lindqvist | 33 | wfr, chainsaw | 30 | 3 | 19 | `p-okonjo` | |
| `p-okonjo` | Marcus Okonjo | 46 | heavy-tow, generator, chainsaw | 25 | 4 | 14 | `p-lindqvist` | |
| `p-delacroix-reyes` | Sunny Delacroix-Reyes | 24 | food-safety, child-cleared | 17 | 6 | 4 | `p-cardoza` | |
| `p-vasquez` | Hank Vasquez | 57 | chainsaw, muck-out | 42 | 3 | 29 | `p-cardoza` | Eleanor Vasquez's nephew. Has a truck, no plow. |
| `p-cardoza` | Ines Cardoza | 35 | elder-checkin, food-safety | 29 | 4 | 17 | `p-vasquez` | Languages: English, Spanish (conversational) |

**Verification:** chainsaw holders = Dana, Ray, Cal, Tom, Wes, Andy, Gil, Owen, Duke, Petra,
Marcus, Hank = **12**. Pump operators = Ray only = **1**. Spanish interpreters = Marisol only =
**1**. Sum kept = **915**, sum missed = **94**.

### A.5 Equipment (31 items)

| type | label | owner | lastUsed |
|---|---|---|---|
| truck-tow | 2015 Ford F-250, 12,000 lb tow | `p-whitlock` | 2026-03-10 |
| truck-tow | 2011 Ford F-350 dually | `p-ostrander` | 2026-03-10 |
| truck-tow | 2019 Chevy Silverado 2500 | `p-delacroix` | 2026-03-11 |
| truck-tow | 2017 Toyota Tundra | `p-bradbury` | 2026-01-22 |
| truck-tow | 2008 Ford F-150 | `p-hollinger` | 2025-11-22 |
| truck-tow | 2020 Ford F-250 | `p-okonjo` | 2025-11-30 |
| truck-tow | 2014 GMC Sierra 2500 | `p-vasquez` | 2026-03-11 |
| truck-tow | 2016 Toyota Tacoma | `p-aguirre` | 2026-02-28 |
| truck-tow | 2013 Ram 1500 | `p-marchetti` | 2025-09-14 |
| truck-plow | 2012 Ford F-250 w/ 8' Boss plow | `p-tanaka` | 2026-03-09 |
| truck-plow | 2018 Ram 2500 w/ 7.5' Western plow | `p-grange` | 2026-03-09 |
| trailer-stock | 20' Featherlite stock trailer | `p-ostrander` | 2025-10-04 |
| generator | Honda EU7000is, 7 kW | `p-tanaka` | 2026-03-10 |
| generator | Generac GP6500, 6.5 kW | `p-marchetti` | 2026-03-10 |
| generator | Champion 5000W | `p-ferrin` | 2026-03-10 |
| generator | Westinghouse WGen4500 | `p-okonjo` | null |
| trash-pump | Honda WT20 2" trash pump | `p-ferrin` | 2026-03-10 |
| trash-pump | Multiquip QP-2TH | org `org-fire` | null |
| trash-pump | Wacker Neuson PT2 | `p-ostrander` | null |
| chainsaw | Stihl MS 271, 20" | `p-whitlock` | 2026-02-21 |
| chainsaw | Husqvarna 455 Rancher | `p-ferrin` | 2026-02-21 |
| chainsaw | Stihl MS 261 | `p-aguirre` | 2026-02-21 |
| chainsaw | Echo CS-590 | `p-delacroix` | 2025-12-06 |
| chainsaw | Husqvarna 460 | `p-pinkerton` | 2025-11-08 |
| chainsaw | Stihl MS 391 | `p-marchetti` | 2025-11-15 |
| chainsaw | Echo CS-400 | `p-lindqvist` | 2025-10-19 |
| chainsaw | Stihl MS 250 | `p-vasquez` | 2025-12-06 |
| ham-base | Yaesu FT-991A base station | `p-pinkerton` | 2026-03-09 |
| ham-base | Icom IC-7300 | `p-ferrin` | 2026-03-09 |
| dehumidifier | 2× Dri-Eaz LGR 7000XLi | org `org-fire` | 2026-03-10 |
| dehumidifier | 4× commercial air movers | org `org-fire` | 2026-03-10 |

**Verification (computed, confirmed):** 31 items · generators **4** · tow-capable trucks **9** ·
plow trucks **2** · trash pumps **3** · chainsaws **8**. Items with `lastUsed` on or after
2025-12-12 (90 days before `DEMO_TODAY`) = **19** → utilization **61%**.

Note there are 8 registered chainsaws but 12 chainsaw-qualified residents. That asymmetry is
correct and intentional — qualification and materiel are tracked separately, which is the entire
point of the registry.

### A.6 Organizations

| id | name | type | contact |
|---|---|---|---|
| `org-pcem` | Park County Emergency Management | government | "Dispatch, Park County EM" |
| `org-county` | Park County | government | "County Administrator's Office, Fairplay" |
| `org-church` | United Methodist Church of South Park | church | "Parish office" |
| `org-school` | South Park Elementary | school | "Front office" |
| `org-cows` | South Park Cows Athletics | team | "Athletic director" |
| `org-hhs` | Park County Human Services | government | "Services desk, Fairplay" |
| `org-fire` | South Park Fire Protection District | government | "Station 1" |
| `org-neighbor` | Marguerite Ellery (neighbor) | neighbor | "Tarryall Road" |

### A.7 Needs (6)

**`need-hansen-flood` — SURGE, in_progress, the deep dive**
- Title: `"Flood response — the Hansen place, Middle Fork"`
- Requester: `org-pcem` · Submitted: `2026-03-09T07:20:00-07:00` · Mode: `surge`
- `rawText` (verbatim):
  `"Middle Fork came up over the bank behind the Hansen place Sunday night after the rain on top of the snowpack. Basement's got about three feet of standing water, mud through the whole ground floor, and their well head went under. Dennis and Kate are okay, they've got a seven-year-old, Ruby. They're staying at Kate's sister's in Fairplay for now but they need the house dried out before it goes to mold. Whatever help we can get."`
- 11 tasks (A.8)

**`need-duthie-ramp` — SUSTAINMENT, met, has AAR**
- Title: `"Wheelchair ramp — Alma Duthie, Bijou Street"`
- Requester: `org-church` · Submitted: `2026-02-24T09:00:00-07:00` · Met: `2026-03-03T16:30:00-07:00`
- 6 tasks, all `verified` · AAR: `aar-duthie`
- `rawText`: `"Alma Duthie came home from Hell's Pass after her hip and she can't do the front steps. She needs a ramp before the thaw makes the side yard a mess. The parish can cover materials."`

**`need-vasquez-plow` — SUSTAINMENT, stalled, the honest gap**
- Title: `"Driveway plowing — Eleanor Vasquez, 82, Tarryall Road"`
- Requester: `org-neighbor` · Submitted: `2026-03-06T18:40:00-07:00`
- Status `stalled`. `stallReason`:
  `"Both plow-equipped trucks are registered to Kenosha Pass, 22 minutes from Tarryall Road. No plow capacity on the Tarryall side."`
- 2 tasks, both `open`, 6 days
- `rawText`: `"Eleanor's 82 and her drive is 400 feet off Tarryall Road. It drifted in again Thursday and the county doesn't plow private drives. Her nephew Hank is in the squad but he doesn't have a plow."`

**`need-school-chaperones` — SUSTAINMENT, staffing**
- Title: `"Chaperones — 5th grade Kenosha Pass field trip"` · `org-school`
- Submitted `2026-03-02T14:00:00-07:00` · 6 tasks, 4 `claimed`, 2 `open`
- Requires `child-cleared` on every task
- `rawText`: `"Fifth grade is going up to Kenosha Pass April 16th for the ecology unit. District says we need six adults with current background checks. We have two."`

**`need-cows-timing` — SUSTAINMENT, staffing**
- Title: `"Timing crew — Cows home track meets, April 11 & 25"` · `org-cows`
- Submitted `2026-03-11T16:10:00-07:00` · 6 tasks, 2 `claimed`, 4 `open`
- `rawText`: `"We need a timing and field crew for both home meets. Six people each day, no experience necessary, we'll train the morning of."`

**`need-interpreter-desk` — SUSTAINMENT, in_progress, recurring**
- Title: `"Spanish interpreter — Tuesday county services desk"` · `org-hhs`
- Submitted `2026-01-13T08:00:00-07:00` · 1 task, `in_progress`, assigned `p-vega`
- Requires `spanish-interpreter`
- `rawText`: `"We need someone at the services desk Tuesday mornings who can actually interpret, not just get by. Benefits enrollment, mostly."`

### A.8 Tasks — the Hansen flood (all 11)

All `needId: 'need-hansen-flood'`.

| # | id | title | dur | quals | materiel | need | window | status | assignees |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `t-flood-01` | Pump standing water from the basement | 90 | pump-operator | trash-pump | 1 | Mon 3/9, morning | `verified` | `p-ferrin` |
| 2 | `t-flood-02` | Muck-out — pull saturated drywall to 4 feet | 180 | muck-out | — | 2 | Thu 3/12, all day | `in_progress` | `p-whitlock`, `p-delacroix` |
| 3 | `t-flood-03` | Haul flood debris to the transfer station — load 1 | 60 | — | truck-tow | 1 | Thu 3/12, afternoon | `in_progress` | `p-vasquez` |
| 4 | `t-flood-04` | Haul flood debris to the transfer station — load 2 | 60 | — | truck-tow | 1 | Fri 3/13, morning | `claimed` | `p-ostrander` |
| 5 | `t-flood-05` | Move waterlogged furniture to storage in Hartsel | 75 | heavy-tow | truck-tow, trailer-stock | 2 | Sat 3/14, morning | `open` | — |
| 6 | `t-flood-06` | Set and monitor drying fans and dehumidifiers | 45 | generator | generator, dehumidifier | 1 | Tue 3/10, evening | `verified` | `p-tanaka` |
| 7 | `t-flood-07` | Sandbag the bank at the Middle Fork culvert | 120 | — | — | 6 | Mon 3/9, afternoon | `verified` | `p-aguirre`, `p-pinkerton`, `p-bradbury`, `p-lindqvist`, `p-okonjo`, `p-marchetti` |
| 8 | `t-flood-08` | Meals for the Hansens, Thursday through Sunday | 30 | food-safety | — | 4 | Thu–Sun | `claimed` | `p-sparks`, `p-ko`, `p-delacroix-reyes` |
| 9 | `t-flood-09` | Childcare for Ruby Hansen during the muck-out | 180 | child-cleared | — | 1 | Thu 3/12, all day | `claimed` | `p-reyes` |
| 10 | `t-flood-10` | Photograph and inventory damage for the insurer | 60 | — | — | 1 | Fri 3/13, morning | `open` | — |
| 11 | `t-flood-11` | Well-water potability test and report | 30 | — | — | 1 | Sat 3/14 | `blocked` | — |

Task detail strings:
1. `"Three feet in the basement. Draw down before the foundation takes more."`
2. `"Everything below the waterline comes out or it goes to mold."`
3. `"Drywall, insulation, and carpet to the Park County transfer station."`
4. `"Second load. Subfloor and the rest of the insulation."`
5. `"Dining set and two dressers, salvageable if they dry out."`
6. `"Fire district's LGRs plus four air movers, on a generator until power's back."`
7. `"Keep the bank from cutting further if we get more runoff this week."`
8. `"Kate's sister's kitchen is small. Deliver to Fairplay."`
9. `"Ruby's seven. The house isn't a place for her right now."`
10. `"Room-by-room photos and a written inventory before anything else is hauled."`
11. `"The well head went under. Nobody drinks from it until it tests clean."`

Task 11 `blockReason`:
`"CAPACITY GAP — no well-water test kit registered in South Park. Nearest is Park County Public Health, Fairplay. Flagged to the quarterly task menu."`

`verifiedById` for tasks 1, 6, 7 is `p-vega` (acting for `org-pcem`), `verifiedAt` `2026-03-11T09:00:00-07:00`.

**Verification (computed, confirmed):** 3 tasks require `truck-tow` (5 also requires
`trailer-stock`) ✓ · 1 requires `pump-operator` ✓ · 1 is `blocked` ✓ · distinct people committed =
**16** ✓ · person-hours committed = **26.75** ✓ · tasks verified = 3 of 11 ✓.

Note task 8 is partially filled — 3 assignees against `peopleNeeded: 4`. Render it as `claimed`
with a mono sub-label `"3 OF 4 FILLED"`. Partial fill is realistic and should be visible.

### A.9 Tasks — other needs

Generate the remaining tasks from these titles. Give each a one-sentence `detail` in the same
plain, concrete voice. Do not invent additional tasks.

**`need-duthie-ramp`** — all `verified`, all `verifiedById: 'p-raghavan'`:
1. `"Measure the front approach and draw the ramp to code"` — 60m — `p-raghavan`
2. `"Pick up lumber and hardware in Fairplay"` — 90m — truck-tow — `p-ostrander`
3. `"Set the footings"` — 120m — 3 people — `p-delacroix`, `p-bradbury`, `p-vasquez`
4. `"Frame and deck the ramp"` — 240m — 4 people — `p-whitlock`, `p-delacroix`, `p-hollinger`, `p-aguirre`
5. `"Handrails and non-skid"` — 120m — 2 people — `p-whitlock`, `p-bradbury`
6. `"Walk it with Alma and adjust the landing"` — 30m — elder-checkin — `p-sparks`

**Ramp commitment ledger (13 records, not 12).** The six tasks above account for 12 kept
commitments. Seed a **13th** commitment: `p-hollinger` on task 3 (`"Set the footings"`), outcome
`waived`, `madeAt 2026-02-26`, `dueAt 2026-02-28`. Hank Vasquez's commitment on that task is the
replacement. This makes the AAR's "thirteen commitments, twelve kept and one waived" derive from
data, and it is the only place in the seed where the `waived` outcome appears on a non-rep
commitment — it exists so the mechanic is demonstrable, not merely described.

**Verification (computed, confirmed):** 9 distinct residents · 12 task commitments + 1 waived =
13 · person-hours = **29.0**.

**`need-vasquez-plow`** — both `open`:
1. `"Plow the drive from Tarryall Road to the house"` — 45m — `plow` qual + `truck-plow`
2. `"Clear the propane tank and the meter"` — 20m — no requirements

**`need-school-chaperones`** — 6 tasks, `"Chaperone — 5th grade Kenosha Pass field trip"` ×6, 300m
each, `child-cleared` required. Four `claimed`: `p-beckett`, `p-reyes`, `p-delacroix-reyes`,
`p-cardoza`. Two `open`.

**`need-cows-timing`** — 6 tasks, `"Timing and field crew — home track meet"` ×6, 240m each, no
requirements. Two `claimed`: `p-sorokin`, `p-ko`. Four `open`.

**`need-interpreter-desk`** — 1 task, `"Interpret at the Tuesday services desk"`, 180m,
`spanish-interpreter`, `in_progress`, `p-vega`.

### A.10 The AAR

```
id: 'aar-duthie'  ·  needId: 'need-duthie-ramp'
publishedAt: '2026-03-05T19:00:00-07:00'  ·  authorId: 'p-raghavan'
```

**WHAT WAS NEEDED**
`"Alma Duthie, 79, came home from Hell's Pass Hospital after a hip replacement and could not manage the four front steps on Bijou Street. She needed a code-compliant ramp before the spring thaw turned the side yard to mud. The parish covered materials. Posted 24 February, met 3 March — seven days."`

**WHO TURNED OUT**
`"Nine residents across three squads. Priya Raghavan drew the plans and pulled the permit. Cal Ostrander hauled from Fairplay. Wes Delacroix, Owen Bradbury, and Hank Vasquez set footings in frozen ground on the 28th. Dana Whitlock, Duke Hollinger, and Tom Aguirre framed and decked it on the 1st. Junie Sparks walked it with Alma and moved the landing eight inches so she could reach the rail from her chair."`

**WHAT IT TOOK**
`"Thirteen commitments, twelve kept and one waived. Twenty-nine person-hours. One truck, $612 in materials covered by the parish, and one county permit at no charge. No injuries. Longest single task was framing, four hours with four people. Duke Hollinger waived the footing shift — frozen ground, and he's seventy-one — and Hank Vasquez picked it up the same evening. A waived commitment counts against nobody. That is what it is for."`

**WHAT WE'D DO DIFFERENTLY**
`"We bought lumber we already owned. Cal Ostrander had enough treated 2x8 in his barn to cover every stringer, and nobody checked the registry before driving to Fairplay. That's a ninety-minute round trip and $180 we didn't need to spend. Check materiel before you buy — that is the entire reason the registry exists. Second, we should have walked the landing with Alma before framing, not after. She caught the rail height in thirty seconds and we'd have saved an hour of rework."`

### A.11 Merchants

| business | offer | honoredFor |
|---|---|---|
| Tweek Bros. Coffeehouse | `"Drip coffee on the house, rep night."` | `"Any member with an active streak."` |
| City Wok | `"Ten percent off, any Thursday."` | `"Anyone who turned out for a surge in the last 30 days."` |
| Skeeter's Bar | `"First round after a surge closes."` | `"Whole squad, when the AAR is filed."` |

### A.12 Recent commitments

Seed 20 explicit `Commitment` records covering the active needs, so the "people committed" counts
on `/need/hansen-flood` derive rather than being hardcoded. Additionally seed **Nora Beckett's last
12 weekly reps** as commitments so the 12-week strip on `/me` renders from data:

```
kept ×9  (weeks ending 2025-12-25 through 2026-02-19)
waived ×1 (2026-02-19)
missed ×2 (2026-02-26, 2026-03-05)
pending ×1 (2026-03-12, isWeeklyRep: true, scopeMinutes: 5)
```

### A.13 Town history — aggregates that predate the ledger

The Readiness dashboard shows figures spanning more history than the six seeded needs contain.
Rather than fabricating dozens of closed needs, seed these as an explicit constant. **Label the
source in a code comment** so nobody later mistakes them for derived values.

```ts
// Aggregates covering needs closed BEFORE the current ledger window.
// Not derivable from needs[] — these stand in for South Park's prior 90 days.
export const townHistory = {
  needsClosedLast90Days: 9,
  medianDaysToMet: 6,
  retention6Month: 0.78,
  retention12Month: 0.61,
  lastSurge:      { label: 'Middle Fork flood',  date: '2026-03-09', respondersIn4Hours: 14 },
  priorSurge:     { label: 'Hartsel grass fire', date: '2025-11-02', respondersIn6Hours: 9  },
  // Residents completing their weekly rep, 12 weeks ending 2026-03-12
  weeklyParticipation: [18, 19, 17, 20, 21, 19, 22, 20, 18, 21, 20, 21],
};
```

Everything else on the Readiness dashboard — show-rate, median streak, squad standings, capacity
gaps, utilization, the needs ledger — is derived from `people`, `equipment`, `needs`, and `tasks`.
Only this block is asserted.

**Sanity note on `weeklyParticipation`:** values sit between 17 and 22 against 24 registered
residents. Do not raise them toward 24. A town where everyone shows up every week is not a town, and
the gap between registered and participating is precisely what the shrinking-ask mechanic exists
to address.

---

## Appendix B — Build order

Each phase ends with a checkpoint you can verify before continuing.

**Phase 1 — Foundation.** Scaffold Vite + React + TS + Tailwind. Add both palettes and all four
fonts. Add `types.ts` (§4) and the full `seed.ts` (Appendix A). Add `derive.ts`.
✅ *Checkpoint:* a temporary page prints town show-rate `90.7%`, median streak `19.5`, 24 people,
31 assets, 12 chainsaw holders, 4 generators, 1 pump operator.

**Phase 2 — Shell and routing.** `AppShell`, all 9 routes, role switcher with redirects, reset,
toasts. Screens can be stubs.
✅ *Checkpoint:* every route reachable; switching roles shows/hides `Post a Need`, `My Rep`,
`Readiness` correctly; reset returns to `/board`.

**Phase 3 — Primitives.** All of §6.5. Build them on a scratch route before wiring screens.
✅ *Checkpoint:* every `TaskStatus` and `NeedStatus` renders a correctly-colored chip; a
`ShowRateRing` at 76% draws correctly.

**Phase 4 — Board and Need Detail.** §7.2, §7.4. Claim and verify with real state changes and
permission enforcement.
✅ *Checkpoint:* as `resident`, claiming task 10 adds Nora and increments "people committed" to 15;
`Verify` is disabled with the correct tooltip; as `requester`, verifying task 2 moves it to the
verified group.

**Phase 5 — Post a Need.** §7.3, including the full staged reveal and the prefill button.
✅ *Checkpoint:* the 2.4s sequence runs to completion and lands on the summary bar reading
`"11 TASKS · 3 REQUIRE A TRUCK · 1 REQUIRES A PUMP OPERATOR · 1 BLOCKED ON MATERIEL"`.

**Phase 6 — My Rep and Squad.** §7.5, §7.6. All three rep states plus waived.
✅ *Checkpoint:* the demo state control reaches all three states with the exact prescribed copy;
`"Can't this week"` produces the waived card and toast.

**Phase 7 — Registry and Readiness.** §7.7, §7.8. All stats computed via `derive.ts`.
✅ *Checkpoint:* registry headline reads `4 / 9 / 12 / 1`; Pump Operator and Spanish Interpreter
both carry the single-point-of-failure tag; the readiness squad table matches §7.8 exactly.

**Phase 8 — The Wall.** §7.9, warm palette. Verify the palette switch is complete — no ops colors
leak through.
✅ *Checkpoint:* `/wall` shows the full AAR verbatim, no individual show-rates anywhere.

**Phase 9 — Landing and annotations.** §7.0, §8.2. Wire all 20 annotations.
✅ *Checkpoint:* toggle on, every product screen shows its markers, each opens the correct text.

**Phase 10 — Deploy.** Add `vercel.json` and `netlify.toml`. Build and deploy.
✅ *Checkpoint:* `npm run build` clean; deployed; **hard-refresh directly on `/wall` and `/need/hansen-flood` returns the page, not a 404.**

---

## Appendix C — Acceptance checklist

- [ ] All 9 routes render; no console errors
- [ ] Town show-rate reads 90.7% and reconciles with 915/94 in the seed
- [ ] Every number in the §4.1 table matches what the built app displays
- [ ] Registry headline reads 4 generators / 9 tow trucks / 12 chainsaw-qualified / 1 bilingual paramedic
- [ ] Equipment utilization reads 61% (19 of 31)
- [ ] Need detail reads 16 people committed / 26.75 person-hours
- [ ] The Wall reads 13 commitments, 12 kept, 1 waived — and the AAR names the waiver
- [ ] All 11 flood tasks present and individually named; 3 require a truck; 1 requires a pump operator; 1 is blocked
- [ ] Eleanor Vasquez's need is visibly stalled with its capacity-gap diagnosis on the board
- [ ] `Verify` is disabled for non-requester roles with the exact tooltip
- [ ] No individual show-rate appears on `/wall` or `/readiness`
- [ ] All three shrinking-ask states reachable, with the exact prescribed copy
- [ ] The AAR's "what we'd do differently" appears verbatim
- [ ] Annotations off by default; all 20 present when toggled on
- [ ] Reset restores seed state from every screen
- [ ] No lorem ipsum, no "Task 1", no placeholder names anywhere
- [ ] Hard refresh on a deep route does not 404 on the deployed host
```

