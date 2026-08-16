# PitchIn — Increment 2: Demo Legibility + Calendar

**Status:** Ready to build
**Predecessor:** `PitchIn_MVP_build_spec.md` (Increment 1 — complete, all 10 phases shipped)
**Scope:** Five demo-legibility fixes + one new feature (`/calendar`)
**Constraint:** ~2 hours. Prototype only — mock data, no backend, no network calls.

---

## 0. Context — why this increment exists

Increment 1 is built and correct. Every derived figure reconciles, all prescribed copy is verbatim,
the permission model is enforced. The problem is not the product. The problem is that **the product
is being graded asynchronously by an instructor with nobody narrating it**, and right now:

- The annotation layer — built specifically for that situation — is **off by default and hidden
  behind an avatar menu**. A grader will never find it.
- The **role switcher is in the same hidden menu**. A grader who never opens it never learns there
  are three views, and therefore never sees `/readiness` (the local-government story) or `/post`
  (the decomposition centerpiece).
- Refreshing silently resets the role, making the Readiness tab vanish — which reads as a bug.

Part 1 fixes discoverability. Part 2 adds the calendar. **Part 1 matters more than Part 2.** If time
runs short, ship Part 1 complete and Part 2 partial, never the reverse.

Everything in `AGENTS.md` still applies — especially "transcribe seed verbatim," "the stalled need
stays stalled," and the non-guilting copy rule.

---

# PART 1 — Demo legibility

## 1.1 Annotations on by default, toggle in the top bar

**State change** (`src/state/DemoState.tsx`):
- Initial `annotationsOn: true` (currently `false`, line ~58)
- `resetDemo` restores `annotationsOn: true` (currently `false`, line ~176)

**Move the control** out of `ProfileMenu` into `AppShell`'s top bar. Remove it from the profile
menu — do not leave two copies.

Placement: right cluster, immediately left of the profile avatar.

```
[ VIEWING AS: RESIDENT | REQUESTER | COUNTY ]   [ ⃝ Explain this screen ]   (NB)
```

Markup: a `<button role="switch" aria-checked={annotationsOn}>` containing a small track/knob and
the label `"Explain this screen"` at 0.75rem. When on, the track fills `--ops-accent` and the label
takes `--ops-text`; when off, track is `--ops-border` and label is `--ops-text-2`.

> Rationale to preserve: annotations on by default means the grader reads the reasoning without
> discovering anything. The visible toggle lets them switch to the clean product view — and that
> contrast is itself part of the argument.

## 1.2 Role switcher promoted to the top bar

Replace the `VIEWING AS` `<select>` in `ProfileMenu` with a **segmented control in the top bar**.
Remove the select from the profile menu. The profile menu keeps its identity header, `My Rep`,
`Creek Side squad`, and `Reset demo`.

Structure:
- Mono 0.6875rem uppercase label `"VIEWING AS"`, letterspacing 0.08em, `--ops-text-3`
- Three buttons in a 1px-bordered group, radius 6px, mono 0.6875rem uppercase:
  `RESIDENT` · `REQUESTER` · `COUNTY`
- Active button: background `--ops-accent`, text `#0E1116`. Inactive: transparent, `--ops-text-2`,
  hover `--ops-raised`.
- `title` attributes: `"Nora Beckett — resident, Creek Side squad"`, `"Park County Emergency
  Management — requester"`, `"Park County — administrator"`
- `aria-pressed` on each button

Behavior is unchanged from today: switching role re-gates the nav, and if the current route is no
longer permitted it redirects to `/board` with the existing toast.

**Below 1100px viewport**, collapse the label and shorten to `RES` / `REQ` / `CTY`. Do not let the
top bar wrap.

## 1.3 Landing page — "What you're about to see"

New section on `/` (warm palette), inserted **between** the anti-gaming section and the
`"Enter South Park"` CTA.

Heading, Oswald 600 uppercase, `--warm-stamp`, letterspacing 0.06em:
`WHAT YOU'RE ABOUT TO SEE`

Sub-line, Inter 400, `--warm-ink-2`, max-width 46rem:
`"A working prototype of a town that already runs this way. Nine screens, seeded with one Colorado town's real-shaped data. Every number on every dashboard is derived from that data, not typed in."`

Then a two-column list (single column below 800px) of nine entries. Each entry: the screen name as
a link (Oswald 600 uppercase, `--warm-ink`, underline on hover), then one line of Inter 400
`--warm-ink-2`. Use these strings exactly:

| Link text | href | Description |
|---|---|---|
| `THE BOARD` | `/board` | `"Six needs from the county, a church, a school, a ball club, and a neighbor. One of them is stuck, and the board says why."` |
| `POST A NEED` | `/post` | `"Describe a flood in plain English and watch it become eleven staffable tasks with skill and equipment requirements."` |
| `A NEED, IN DEPTH` | `/need/hansen-flood` | `"Who has turned out, what is still open, and the one task nobody in town is equipped to do."` |
| `THE WEEKLY REP` | `/me` | `"Twenty minutes, fixed time, named partner. Miss a week and the system shrinks the ask instead of guilting you."` |
| `THE CALENDAR` | `/calendar` | `"What you have signed up for, what you have already done, and what is open to someone with your quals."` |
| `A SQUAD` | `/squad/creek-side` | `"Four to eight neighbors. Streaks belong to the squad, so a bad month gets carried instead of punished."` |
| `THE REGISTRY` | `/registry` | `"What the town actually owns. Four generators, one bilingual paramedic, and three pumps with one qualified operator."` |
| `READINESS` | `/readiness` | `"What a county buys: show-rate, retention, time-to-met, and capacity gaps named specifically enough to fix."` |
| `THE WALL` | `/wall` | `"The public board. What got met this month, who met it, and an after-action report that admits what went wrong."` |

**Note:** `POST A NEED` and `READINESS` are role-gated. Clicking them from the landing page must
**switch the role automatically** and then navigate — a grader following your own index must not
land on a redirect. Implement by attaching an intended role to those two entries and dispatching
`setRole` before `navigate`.

## 1.4 Persist role and annotations across reload

Add to `src/state/DemoState.tsx`:

- Keys: `pitchin.role` and `pitchin.annotations` in **`sessionStorage`** (not `localStorage` —
  scoped to the tab so a fresh window is a fresh demo).
- Hydrate both on provider mount, validating `role` against `'resident' | 'requester' | 'admin'`
  and ignoring anything else.
- Write on every `setRole` / `toggleAnnotations`.
- `resetDemo()` clears both keys and returns to `role: 'resident'`, `annotationsOn: true`.
- Wrap all `sessionStorage` access in try/catch — a blocked-storage browser must degrade to
  in-memory defaults, never throw.

**Only these two flags persist.** Seed data, task states, commitments, and toasts still reset on
reload. That property is deliberate and must not change.

## 1.5 Remove the chat drawer

Delete:
- `src/components/ChatDrawer.tsx`
- `src/data/messages.ts`
- `src/lib/chat.ts`

Edit:
- `src/components/AppShell.tsx` — remove the `ChatDrawer` import and render, the messages button,
  the `unreadTotal` import, and the `chatOpen` state
- `src/state/DemoState.tsx` — remove `seedMessages` / `seedThreads` imports, message state, and any
  message actions
- `src/types.ts` — remove the message/thread types and the comment at line ~158
- `src/index.css` — remove `@keyframes drawer-in` and `.animate-drawer-in` if unused elsewhere

**Do NOT delete `src/lib/actors.ts`.** Both `AppShell` and `ProfileMenu` import `actorForRole` from
it. Remove only the message-related constants if they become unused; keep `Actor`, `actorForRole`,
and `displayName`.

Rationale: it renders in the dark ops palette inside a warm cork app, it is in no spec, it carries
no part of the argument, and three message stubs invite a click that goes nowhere.

---

# PART 2 — The Calendar

## 2.1 What it is

A resident's view of their own service over time: **what they signed up for, what they already did,
and what is open to someone with their quals.** Plus a calendar-export affordance that is honestly
labelled as not wired.

**Route:** `/calendar` · **Role:** `resident` only (redirects to `/board` otherwise, same pattern as
`/me`) · **Nav label:** `Calendar`, placed immediately after `My Rep`.

**Non-goals for this increment:** no county-wide or squad-wide calendar; no drag-to-reschedule; no
real `.ics` generation; no week or day views; no adding events.

## 2.2 Data model changes

`Task.window` is a human-readable string (`"Thu 3/12, afternoon"`) and cannot drive a calendar. Add
two fields to `Task` in `src/types.ts`:

```ts
scheduledDate: ISODate | null;   // "2026-03-12"; null = unscheduled (shows in lists, not on grid)
recurrenceNote: string | null;   // "Weekly, Tuesdays" — display only, no recurrence engine
```

`window` stays and remains the display string everywhere it already appears. **Do not remove or
reformat it.**

### Seed values — transcribe exactly

**Hansen flood** (`need-hansen-flood`), all `recurrenceNote: null`:

| Task | scheduledDate |
|---|---|
| `t-flood-01` Pump standing water | 2026-03-09 |
| `t-flood-02` Muck-out | 2026-03-12 |
| `t-flood-03` Haul debris load 1 | 2026-03-12 |
| `t-flood-04` Haul debris load 2 | 2026-03-13 |
| `t-flood-05` Move furniture to Hartsel | 2026-03-14 |
| `t-flood-06` Drying fans and dehumidifiers | 2026-03-10 |
| `t-flood-07` Sandbag the culvert | 2026-03-09 |
| `t-flood-08` Meals Thursday–Sunday | 2026-03-12 |
| `t-flood-09` Childcare for Ruby | 2026-03-12 |
| `t-flood-10` Photograph and inventory | 2026-03-13 |
| `t-flood-11` Well-water test | 2026-03-14 |

**Duthie ramp** (`need-duthie-ramp`), in task order: `2026-02-25`, `2026-02-26`, `2026-02-28`,
`2026-03-01`, `2026-03-02`, `2026-03-03`.

**Vasquez plow** (`need-vasquez-plow`): **both tasks `scheduledDate: null`.** The need is stalled;
nothing is scheduled because nobody has claimed it. This is correct and must not be "fixed" by
inventing a date.

**School chaperones** (`need-school-chaperones`): all six tasks `2026-04-16`.

**Cows timing** (`need-cows-timing`): first three tasks `2026-04-11`, last three `2026-04-25`.

**Interpreter desk** (`need-interpreter-desk`): `scheduledDate: '2026-03-17'`,
`recurrenceNote: 'Weekly, Tuesdays'`.

## 2.3 Derive functions

Add to `src/lib/derive.ts`. All are pure and take state as arguments.

```ts
// Pending/committed work for a person, ascending by date. Includes their weekly rep.
upcomingFor(personId, commitments, tasks, needs): CalendarEntry[]

// Completed record — kept | missed | waived — descending by date.
historyFor(personId, commitments, tasks, needs): CalendarEntry[]

// Open tasks the person is qualified for and not already committed to.
// Excludes `blocked` tasks. Ascending by date, nulls last.
opportunitiesFor(personId, tasks, needs, people, equipment): CalendarEntry[]

// All entries falling in a given month, for the grid.
entriesInMonth(year, month, entries): Map<ISODate, CalendarEntry[]>
```

`CalendarEntry` is a view model — put it in `src/types.ts`:

```ts
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
```

**Qualification rule for `opportunitiesFor`** — reuse the existing claim-eligibility logic rather
than writing a second copy. A task is an opportunity when: `status === 'open'`, the person holds
**every** qual in `requiredQuals`, any `requiredEquipment` is satisfied by the person or their
squad, and the person is not already an assignee.

For **Nora Beckett** (`p-beckett`, quals `child-cleared` + `first-aid`, no equipment) the seed must
yield: `t-flood-10` (no requirements), the two open chaperone tasks (`child-cleared`), the four open
Cows timing tasks (no requirements), and the second Vasquez task (no requirements, unscheduled).
It must **not** yield `t-flood-05` (needs `heavy-tow`), `t-flood-11` (blocked), or the Vasquez plow
task (needs `plow` + a plow truck).

## 2.4 Screen specification

Warm/cork palette, consistent with the rest of the app.

### Header
- H1: `"Calendar"`
- Sub: `"Your reps, your commitments, and what's open to you."`
- Right-aligned identity chip, mono 0.75rem: `"NORA BECKETT · CREEK SIDE"`

### Export row

A bordered panel directly under the header. Label, mono 0.6875rem uppercase, `--warm-ink-2`:
`ADD TO YOUR OWN CALENDAR`

Four buttons, `paper-btn-ghost` style: `Google Calendar` · `Outlook` · `Apple Calendar` ·
`Download .ics`

Clicking **any** of them opens the same small centered modal. Do not wire four different behaviours.

Modal, `--warm-paper`, 2px radius, max-width 30rem:
- Heading, Oswald uppercase, `--warm-stamp`: `NOT WIRED IN THIS PROTOTYPE`
- Body: `"In production, PitchIn publishes a personal subscription feed. Your weekly rep, anything you've claimed, and any surge callout appear in your own calendar automatically — and update themselves when the schedule changes, so nobody re-imports anything."`
- Mono line, `--warm-ink-2`, in a 1px-ruled inset, selectable but visually inert:
  `webcal://pitchin.town/south-park/nora-beckett.ics`
- Single button: `Close`
- Dismiss on Esc and on backdrop click. Return focus to the trigger.

> This is the honest version of a placeholder. A dead button reads as broken; a button that
> explains what it would do reads as product thinking.

### Month grid

- Controls row: `‹` prev, month label (Oswald uppercase, e.g. `MARCH 2026`), `›` next.
  **Range is clamped to December 2025 – April 2026.** Disable the arrows at the ends — never render
  an empty month.
- Default month on mount: **March 2026**.
- 7-column grid, Sunday-first, weekday headers in mono 0.6875rem uppercase.
- Leading/trailing days from adjacent months render at 35% opacity and hold no entries.
- **Today (2026-03-12)** gets a 2px `--warm-stamp` border and the date numeral in `--warm-stamp`.
- Each day cell shows the date numeral (mono) and up to **three** entry chips; a fourth or beyond
  collapses to `+N` in mono 0.625rem.
- Chip styling by outcome — reuse the existing status colors:

| Outcome | Chip |
|---|---|
| `kept` | filled `--status-verified` |
| `missed` | filled `--status-missed` |
| `waived` | filled `--status-open` |
| `pending` | filled `--ops-accent`, dark text |
| `open` (opportunity) | 1px dashed `--warm-rule`, transparent fill, `--warm-ink-2` text |

- Chip label: the entry title truncated to one line with `title` attribute carrying the full text.
- Clicking a chip whose `needId` is non-null navigates to `/need/{needId}`. Reps are not clickable.
- **Legend** beneath the grid, mono 0.6875rem: `KEPT` · `MISSED` · `WAIVED` · `COMMITTED` ·
  `OPEN TO YOU`, each with its swatch.

### Three lists below the grid

Stacked, each with an Oswald uppercase heading and a mono count.

**1. `UPCOMING — WHAT YOU'VE SIGNED UP FOR`**
From `upcomingFor`. Each row: date (mono), title, need title as a link, duration, partner for reps,
`recurrenceNote` if present. Empty state: `"Nothing on the books. Your rep is the standing one."`

**2. `OPEN TO YOU`**
From `opportunitiesFor`. Same row shape plus the matched quals as `QualBadge`s, and a `Claim`
button reusing the existing claim action and its toast. Unscheduled entries sort last and show
`—` in the date column with the mono tag `NOT YET SCHEDULED`.
Sub-line under the heading, `--warm-ink-2`:
`"You see these because you hold the quals they require. Quals are earned by demonstration, not requested."`
Empty state: `"Nothing open matches your quals right now."`

**3. `COMPLETED — YOUR RECORD`**
From `historyFor`, descending. Each row: date, title, and an outcome chip (`KEPT` / `MISSED` /
`WAIVED`). Beneath the heading, mono:
`"25 KEPT · 8 MISSED · SHOW-RATE 76%"` — **derived, not hardcoded.**
Then, `--warm-ink-2`:
`"A waived commitment counts against nobody. It is neither kept nor missed."`

### Annotations (3 new — numbers 19, 20, 21)

Keys `calendar:1`, `calendar:2`, `calendar:3` in `src/data/annotations.ts`:

1. On the export row — `"A civic system that doesn't appear in your actual calendar is asking you to remember it. Twenty minutes a week survives only if it lives where the rest of your week lives."`
2. On `OPEN TO YOU` — `"You are shown what you're qualified for, not everything that's open. That is the registry doing its job in the other direction — matching capability to need instead of broadcasting to everyone and hoping."`
3. On `COMPLETED` — `"Your record is commitments, not hours. Nine kept weeks and two missed ones is a truer picture of whether a town can count on you than any total ever printed on a volunteer certificate."`

---

## 3. Build order

| Phase | Work | Checkpoint |
|---|---|---|
| **1** | §1.5 remove chat drawer | `npm run build` clean; no messages button; `actorForRole` still resolves; no dead imports |
| **2** | §1.1 + §1.2 top-bar controls | Annotations on by first paint; segmented control switches role and re-gates nav; profile menu no longer duplicates either control |
| **3** | §1.4 persistence | Switch to County, hard-refresh → still County, Readiness still in nav, annotations still on. `Reset demo` returns to Resident + annotations on |
| **4** | §1.3 landing index | All nine links resolve; `POST A NEED` and `READINESS` switch role automatically and do not bounce to `/board` |
| **5** | §2.2 + §2.3 calendar data | Temporary print: Nora's upcoming, history, and opportunities match the lists named in §2.3 exactly |
| **6** | §2.4 calendar screen | Grid renders March 2026 with today marked; month arrows clamp at Dec 2025 / Apr 2026; all four export buttons open the one modal |
| **7** | Annotations 19–21 + `AGENTS.md` file table updated to list this spec | Toggle on, all 21 annotations open |

Commit at every phase boundary with the phase number in the message.

---

## 4. Acceptance checklist

- [ ] `npm run build` passes; no TypeScript errors; no console errors on any route
- [ ] Annotations are **on** at first paint, before any interaction
- [ ] The annotations toggle and the role switcher are both visible in the top bar without opening any menu
- [ ] Switching role to County and hard-refreshing keeps County and keeps Readiness in the nav
- [ ] `Reset demo` returns Resident + annotations on + seed data restored
- [ ] All nine landing links resolve; the two role-gated ones switch role rather than redirecting
- [ ] No chat drawer, no messages button, no dead imports; `actorForRole` still used by AppShell and ProfileMenu
- [ ] `/calendar` is resident-only and redirects otherwise
- [ ] Grid defaults to March 2026, marks 12 March as today, and clamps arrows at Dec 2025 / Apr 2026
- [ ] Nora's `OPEN TO YOU` contains `t-flood-10`, 2 chaperone tasks, 4 Cows tasks, 1 Vasquez task — and **excludes** `t-flood-05`, `t-flood-11`, and the Vasquez plow task
- [ ] `COMPLETED` header reads `25 KEPT · 8 MISSED · SHOW-RATE 76%`, derived
- [ ] All four export buttons open the same modal; Esc and backdrop close it
- [ ] Every Increment 1 figure is unchanged: town show-rate 90.7%, median 19.5 wk, utilization 61%, Hansen flood 16 people / 26.75 person-hours, registry 4 / 9 / 12 / 1
- [ ] The Vasquez need is still stalled with its capacity-gap diagnosis

---

## 5. Rules that still bind

From `AGENTS.md`, unchanged and non-negotiable:

- **Transcribe seed data verbatim.** The `scheduledDate` values in §2.2 are data, not suggestions.
- **The stalled need stays stalled.** Both Vasquez tasks are `scheduledDate: null` because nothing
  is scheduled when nobody has claimed it. Do not invent a date to make the grid look fuller.
- **Never write guilting copy.** The `COMPLETED` list shows missed weeks factually with no warning
  language, no streak-loss framing, and no urgency.
- **No new dependencies.** The month grid is CSS grid and date arithmetic — do not install a date
  library or a calendar component. `Date` arithmetic on ISO strings is sufficient at this scale.
- **No persistence beyond the two flags in §1.4.** Seed state still resets on reload.
- **Disagreements go in `NOTES_FOR_NILS.md`**, not into unilateral changes.

---

# PART 3 — Photography

## 3.1 Why photographs, and why these

The site is currently all text. Three things it cannot currently do: show the problem, document that
the work happened, and show a finished result.

This is not decoration. **`t-flood-10` is already a task in the system — "Photograph and inventory
damage for the insurer."** The product produces photographs as a work artifact. Showing them is the
system doing its job, not a designer filling space. Treat photographs as *evidence in the record*,
not as stock imagery.

The photos are installed at `public/photos/` and are **public domain FEMA disaster-response
photography**. Sources, photographers, and one known caveat are in **`PHOTO_CREDITS.md` — read it.**

| File | Depicts |
|---|---|
| `flood-interior.jpg` | Gutted room stripped to studs, silt on the floor |
| `muckout.jpg` | Masked worker pulling saturated drywall |
| `debris-carry.jpg` | Volunteer in a respirator carrying siding out |
| `debris-haul.jpg` | Debris loaded into a truck on a residential street |
| `sandbag-line.jpg` | Neighbours of mixed ages filling sandbags together |
| `ramp-finished.jpg` | **RESERVED — file does not exist yet.** See §3.5 |

**Do not add, swap, rename, or source additional photographs.** If a slot has no file, it renders
nothing (§3.5). Do not substitute a different image to fill a gap, and never caption a photo as
something it does not depict.

## 3.2 The `Photo` component

New: `src/components/Photo.tsx`. Polaroid-style print pinned to the cork board.

```tsx
interface PhotoProps {
  src: string;             // "/photos/sandbag-line.jpg"
  alt: string;             // real description — screen readers get the truth
  caption: string;         // handwritten caption, see §3.4 for exact strings
  tilt?: number;           // degrees, default 0. Use -3..3 only
  width?: 'sm' | 'md' | 'lg';  // 180px | 260px | 420px
  fastener?: 'pin' | 'tape' | 'none';  // default 'pin'
}
```

Structure and styling:

- Outer print: `--warm-paper` (`#F4EFE4`) background, **12px** border on top/left/right, **44px**
  on the bottom for the caption, 2px radius, and the existing `.board-flyer` shadow.
- Rotation via `transform: rotate(var(--photo-tilt))`, set from the `tilt` prop. On hover/focus,
  rotate to `0deg` with the existing 160ms transition, matching `.board-flyer`.
- Image fills the frame, `object-fit: cover`, aspect ratio **4:3**.
- **Warm filter so photos sit in the palette rather than fighting it:**
  `filter: sepia(0.18) saturate(0.85) contrast(1.04) brightness(1.02);`
- Caption in **`font-hand`** (Kalam — already loaded for the wordmark), 0.8125rem,
  `--warm-ink-2`, centred in the bottom border.
- `fastener: 'pin'` renders the existing `.board-pin`; `'tape'` renders `.board-tape`.
- `loading="lazy"` and explicit `width`/`height` attributes to prevent layout shift.

Add to `tailwind.config.ts` if not present: nothing new required — `font-hand` already exists.

## 3.3 Where photos go

| Screen | Photo | Width | Placement |
|---|---|---|---|
| `/` landing | `sandbag-line.jpg` | `lg` | Hero, right of the deck. Tilt `-2`. The thesis image: neighbours, mixed ages, doing it themselves |
| `/board` | `flood-interior.jpg` | `sm` | Thumbnail on the Hansen flood flyer only. Tilt `2`, fastener `tape` |
| `/need/hansen-flood` | `flood-interior.jpg`, `muckout.jpg`, `debris-haul.jpg` | `md` | A row directly under the "AS SUBMITTED" quote, headed `FILED WITH THE REQUEST` (mono, uppercase). Tilts `-3`, `1`, `-1` |
| `/squad/creek-side` | `sandbag-line.jpg` | `md` | Beside the member grid. Tilt `2` |
| `/wall` | `debris-carry.jpg` | `md` | In `STILL OPEN`, beside the Hansen flood entry. Tilt `-2` |
| `/wall` | `ramp-finished.jpg` | `lg` | In `MET THIS MONTH`, beside the Duthie ramp. Tilt `1`. **Renders nothing until the file exists** |

Every other screen stays text-only. `/readiness` and `/registry` get **no photographs** — they are
instruments, and photographs would undercut their seriousness.

## 3.4 Caption and alt text — exact strings

Captions are diegetic: written as a neighbour would label a print, not as a caption writer would.

| File | `caption` | `alt` |
|---|---|---|
| `sandbag-line.jpg` | `"Sandbag line at the culvert — 9 March"` | `"About a dozen people of different ages standing in a line, filling and passing sandbags."` |
| `flood-interior.jpg` | `"Ground floor, day one"` | `"The interior of a flood-damaged house, stripped back to wall studs, with silt across the floor."` |
| `muckout.jpg` | `"Drywall out to four feet"` | `"A person in a dust mask crouching to pull saturated drywall away from a kitchen wall."` |
| `debris-haul.jpg` | `"Load two, to the transfer station"` | `"Flood debris being loaded into the back of a truck on a residential street."` |
| `debris-carry.jpg` | `"Still going — Hansen place"` | `"A volunteer wearing a respirator carrying a length of siding out of a flood-damaged house."` |
| `ramp-finished.jpg` | `"Alma's ramp, finished 3 March"` | `"A finished wooden wheelchair ramp leading up to the front door of a house."` |

**Alt text describes the photograph truthfully.** It is not the caption repeated, and it must not
claim the image shows South Park or any named resident — it does not.

## 3.5 The missing-file rule — important

`ramp-finished.jpg` **does not exist yet** and may never be supplied.

`Photo` must handle this without any visible failure:

- Maintain a module-level constant listing the filenames that actually ship.
- If `src` is not in that list, `Photo` returns `null`.
- **No placeholder box, no grey rectangle, no "image missing" text, no broken-image icon.** The
  surrounding layout must reflow cleanly as though the photo was never specified.
- When someone later drops a real file at `public/photos/ramp-finished.jpg`, adding its name to
  that constant is the only change needed.

> A missing photo that renders nothing looks intentional. A broken image icon in front of a grader
> looks like the build failed. This rule is why the reserved slot is safe to ship.

## 3.6 Annotation 22

Key `wall:3` in `src/data/annotations.ts`, anchored to the photo beside the Hansen flood entry:

`"Photographing the damage is task ten on the flood job — it is work somebody signed up for, not decoration. That is why the record has pictures in it at all: the system asked someone to take them, and it knows who."`

## 3.7 Build phase

Insert as **Phase 8** (after annotations, before the AGENTS.md update):

| Phase | Work | Checkpoint |
|---|---|---|
| **8** | `Photo` component, the six placements, captions, alt text, missing-file rule, annotation 22 | All five shipped photos render with warm filter and handwritten captions. `/wall` shows the Duthie ramp entry with **no** visual gap or broken icon. `npm run build` clean. Total `public/photos/` under 1 MB |

## 3.8 Additions to the acceptance checklist

- [ ] Five photographs render; each caption matches §3.4 exactly
- [ ] `ramp-finished.jpg` is absent and its slot renders **nothing** — no placeholder, no broken icon
- [ ] Photos carry the warm filter and read as prints on the board, not as stock photography
- [ ] `/readiness` and `/registry` contain no photographs
- [ ] Every `alt` describes the actual photograph and claims nothing about South Park
- [ ] `PHOTO_CREDITS.md` is present and unmodified
