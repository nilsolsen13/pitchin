# PitchIn — Final Build Spec

**Status:** Ready to build. This is the last planned build.
**Supersedes:** the Increment 2, 3, and 4 documents, which have been consolidated here and deleted.
**Companion:** `PitchIn_MVP_build_spec.md` remains the reference for the **data model, screen
layouts, exact copy, and all seed data (Appendix A)**. Read it for anything this document does not
specify. Where the two disagree, **this document wins.**

---

## 0. Where the build stands

Increments 1, 2, and 3 are built, verified, and pushed. What exists today:

- Nine routes: `/`, `/board`, `/post`, `/need/:id`, `/me`, `/calendar`, `/squad/:id`, `/registry`,
  `/readiness`, `/wall`
- Cork bulletin aesthetic on every screen · annotations on by default, toggle and role switcher in
  the top bar · role and annotations persisted in `sessionStorage`
- Landing index of nine screens · calendar with month grid and honest export modal · five
  public-domain Polaroid prints · 22 annotations
- 17 quals including `emt-paramedic` · Park County snow policy on the stalled need

**This build adds six things and fixes what surfaced during the last two.** Ordered by value, and
designed so that stopping at any phase boundary leaves a coherent product.

---

## 1. Invariants — verified, and must still hold when you are done

Every figure below is **derived from the seed**, was confirmed by running the app, and must be
unchanged at the end of this build. If one moves, you broke something.

| Quantity | Value |
|---|---|
| Town show-rate | **90.7%** (915 kept / 94 missed) |
| Median unbroken participation | **19.5 weeks** |
| Squad show-rates | Creek Side 90.3 · Kenosha Pass 91.8 · Red Hill 92.0 · Tarryall 87.7 |
| Registry headline | **4** generators · **9** tow trucks · **12** chainsaw-qualified · **1** bilingual paramedic |
| Quals in circulation | **17** |
| Equipment utilization | **61%** (19 of 31) |
| Hansen flood | **16** people committed · **26.75** person-hours · 3 of 11 verified · 1 blocked |
| Duthie ramp | 9 residents · 13 commitments (12 kept, 1 waived) · 29.0 person-hours |
| Nora Beckett | 25 kept · 8 missed · **76%** · Provisional standing · 8 open opportunities |
| Squad ages | Creek Side 90 wk · Kenosha Pass 104 · Red Hill 111 · Tarryall 47 |

**Behavioural invariants:**

- The **Vasquez need stays stalled and unstaffed**, with both its capacity-gap diagnosis and the
  Park County policy line.
- The **cork aesthetic stays.** Do not restore the ops console.
- **No guilting copy** anywhere near the shrinking ask.
- `ramp-finished.jpg` still does not exist and its slot still renders **nothing**.
- No new dependencies. No network calls. No persistence beyond `pitchin.role` and
  `pitchin.annotations`.

---

## 2. Notes from the last two builds — dispositions

All sixteen notes in `NOTES_FOR_NILS.md` are resolved. Nothing below needs re-litigating.

| Note | Disposition |
|---|---|
| 1–11 | Closed in Increment 3. Note 6 (Ray Ferrin's streak) was an arithmetic error — Creek Side is 90 weeks old, not 39. **Do not touch squad ages or streaks.** |
| **12** — landing index also switches role for Calendar and My Rep | **Ratified.** The agent was right and the spec was incomplete. Keep it, and extend the same treatment to any new gated entry |
| **13** — `post:1` / `post:2` only mount after Decompose | **Ratified, no change.** Both annotations describe the decomposition and belong where they are. 20 of 22 markers at rest is correct |
| **14** — claimed tasks logged 20 minutes | **Already fixed.** `derive.ts` now takes non-rep duration from the task. The weekly-rep branch still uses `scopeMinutes`, which is correct there. **Do not revert** |
| **15** — Increment 4 arrived mid-build | Closed. That work is this document |
| **16** — `pitchin.annotations` written only on toggle | **Ratified, no change.** An unset key hydrates to the default (on). Correct behaviour |

**One correction to my own spec:** the annotation count is **22**, not the "21" written in an
earlier checkpoint. After this build it is **24**.

---

# PART A — Remove the requester role

**Build this first.** It corrects a modelling error that everything else sits on top of, and it
simplifies the top bar before four more things are added to it.

## A.1 The correction

Increment 1 modelled three roles: `resident`, `requester`, `admin`. That was wrong. **Requester is
not a role a person occupies — it is a relationship to a specific need.** Anyone can be a requester
by posting something. Modelling it as a mode forced a fiction where a viewer "becomes" the
requester, and made the product's most important permission rule look like a mode toggle.

## A.2 The new model

**Two roles.** `Role = 'resident' | 'admin'`. Delete `'requester'` everywhere, including
`actorForRole`.

| Role | Demo identity | Owns needs posted by |
|---|---|---|
| `resident` | Nora Beckett, Creek Side | anything she posts in-session |
| `admin` | Park County | `org-pcem` and `org-county` |

**Posting is open to both.** `Post a need` becomes a **standing button in the header** — not a nav
item, not gated. It is the one primary action in the top bar: `--warm-stamp` fill, `--warm-paper`
text, 2px radius, mono uppercase, placed left of the role switcher.

**Role switcher becomes two buttons:** `RESIDENT` · `COUNTY`. Below 1100px: `RES` · `CTY`.

## A.3 Verification permission — derived, and a better demonstration

Replace the role check with an ownership check in `derive.ts`:

```ts
canVerify(role: Role, need: Need): boolean
//   admin    -> need.requesterOrgId is 'org-pcem' or 'org-county'
//   resident -> need was posted by this resident in-session
```

What this produces on `/need/hansen-flood`:

| Viewing as | Verify on the Hansen flood | Verify on the Duthie ramp |
|---|---|---|
| Resident (Nora) | Disabled — `"Only the requester can verify a task."` | Disabled — same |
| County | **Enabled** — Park County EM posted it | Disabled — the parish posted it |

Same screen, two outcomes, and the difference is *who asked for the work*. Keep the tooltip string
exactly as it is.

## A.4 Posting must actually create a need

Today `/post` stage 3 navigates to `/need/hansen-flood` without creating anything. With posting open
to residents that no longer holds together.

`"Post to the board"` commits the decomposed need to in-memory state: generated id,
`requesterOrgId` from the current account, `mode` from the form, `status: 'staffing'`, tasks `open`,
`mapPoint` at the town centre `(340, 430)`. Then navigate to the new need.

It appears on the board, the map, and the ledger, and its poster can verify its tasks. Reset clears
it. **Even when the `"Use the Hansen flood"` prefill was used, create a new need** — do not navigate
to the seeded one, or the flow silently does nothing.

## A.5 Consequential edits

- `/post` is no longer role-gated. `/me` and `/calendar` stay resident-only. `/readiness` and the
  new `/map` are admin-only.
- Remove `Post a Need` from the nav array.
- Landing index: `POST A NEED` no longer needs a role switch. `READINESS` still switches to County.
- Replace every `role === 'requester'` with the `canVerify` ownership check.

---

# PART B — Posting on another resident's behalf

## B.1 Why

Two of six seeded needs are already proxy requests — Marguerite Ellery posted for Eleanor Vasquez,
the parish posted for Alma Duthie — and the model has no concept of it.

**The residents with the greatest need are the least likely to use software.** An 82-year-old
snowed in on Tarryall Road is not posting to a web app. Proxy posting is the primary path for the
highest-need cases; without it a civic platform quietly serves only the people who were already
fine.

## B.2 Data model

```ts
export interface OnBehalfOf {
  name: string;               // "Eleanor Vasquez"
  age: number | null;         // 82
  locationSpecific: string;   // "Tarryall Road"
  locationGeneral: string;    // "the Tarryall side"
  relationship: string;       // "Neighbour" | "Parish"
  publicNameConsent: boolean;
}
```

Add `onBehalfOf: OnBehalfOf | null` to `Need`.

**Seed:**

- `need-vasquez-plow` → `{ name: 'Eleanor Vasquez', age: 82, locationSpecific: 'Tarryall Road', locationGeneral: 'the Tarryall side', relationship: 'Neighbour', publicNameConsent: false }`
- `need-duthie-ramp` → `{ name: 'Alma Duthie', age: 79, locationSpecific: 'Bijou Street', locationGeneral: 'the Bijou Street end of town', relationship: 'Parish', publicNameConsent: true }`
- All four others → `null`

## B.3 Tiered visibility — the important part

Reuse the boundary the permission model already uses for show-rate.

| Where | Shows |
|---|---|
| `/board`, `/need/:id` — any role | Full: `"Eleanor Vasquez, 82 · Tarryall Road"` |
| `/wall` — the public board | Depends on `publicNameConsent` |

On The Wall only: consent `true` → full name. Consent `false` → generalised
(`"a resident on the Tarryall side"`), with this line beneath in mono 0.6875rem, `--warm-ink-2`:

`"Named only with the resident's say-so. Nobody has reached Eleanor yet."`

> One resident named and celebrated, one deliberately not, and the difference is consent — visible
> in a single comparison on one screen. It is the strongest evidence in the product that the
> privacy model is real rather than asserted.

## B.4 The posting flow

On `/post`, beneath the requester select, a checkbox: `"I'm posting this for someone else"`.

When checked, reveal `Their name`, `Age (optional)`, `Where they are`, `Your relationship to them`,
plus: `"They know I'm posting this, and they're happy to be named publicly."`

Leaving that unchecked is **valid and must not block submission.** It sets
`publicNameConsent: false` and shows, in `--warm-ink-2`:
`"That's fine. Their name will show to squads working the need, and the public wall will say only roughly where they are."`

Nothing here should read as a warning or a compliance gate. It is one question asked plainly.

## B.5 Annotation 23

Key `wall:4`, on the generalised Vasquez entry:

`"The people who most need help are the least likely to use software, so somebody else has to be able to ask on their behalf. That creates a problem — a vulnerable neighbour's name on a public board — and the answer is the same boundary the rest of the system uses: squads see who, the town sees roughly where, and the name is public only if she says so."`

---

# PART C — County Map

## C.1 What it is and is not

County officials need to spot trends. The trend worth spotting is already in the data and invisible
in every table: **capability is geographically clustered.** A table says "2 plow trucks." A map says
"both plow trucks are here, and the need is over there."

Verified — four capabilities exist in exactly one of four territories:

| Qual | Held by | Uncovered |
|---|---|---|
| Snow Removal — Plow | Kenosha Pass only | Creek Side, Red Hill, **Tarryall** |
| EMT-Paramedic | Kenosha Pass only | Creek Side, Red Hill, Tarryall |
| Spanish Interpreter | Kenosha Pass only | Creek Side, Red Hill, Tarryall |
| Pump Operator | Creek Side only | Kenosha Pass, Red Hill, Tarryall |

Eleanor Vasquez's stalled need is in **Tarryall**. Every plow is in **Kenosha Pass**.

**This is a hand-drawn SVG schematic, not a real map.** No mapping library, no tile server, no
GeoJSON, no network, no lat/long. Three binding reasons: `AGENTS.md` forbids new dependencies and
network calls; the demo must work offline; and **South Park is fictional** — a real Park County
basemap would show Fairplay and Hartsel and no South Park at all. Draw the basin. Do not fetch it.

## C.2 Route

`/map`, **admin only**, redirects to `/board` otherwise. Nav label `Map`, after `Readiness`.

## C.3 Geography

`viewBox="0 0 1000 700"`. Coordinates are abstract, not geographic.

Add to `Squad`: `territory: { label: string; path: string; cx: number; cy: number }`.

| Squad | Position | Centroid |
|---|---|---|
| Kenosha Pass | North | ~(500, 150) |
| Tarryall | East | ~(790, 380) |
| Creek Side | Centre-west, contains the town centre | ~(330, 380) |
| Red Hill | South | ~(520, 590) |

Four irregular polygons tiling the frame with a small gap, so it reads as a surveyed basin rather
than a pie chart. Soft mountain edge around the frame. Draw the **Middle Fork** as a labelled line
running north-south through Creek Side, a **SOUTH PARK** town-centre marker inside Creek Side, and
two or three thin roads. Territory labels in `font-display` uppercase, `--warm-ink-2`.

Add to `Need`: `mapPoint: { x: number; y: number } | null`.

| Need | Point |
|---|---|
| `need-hansen-flood` | (295, 300) |
| `need-vasquez-plow` | **(820, 350)** — Tarryall |
| `need-duthie-ramp` | (350, 415) |
| `need-school-chaperones` | (315, 440) |
| `need-cows-timing` | (375, 455) |
| `need-interpreter-desk` | (340, 470) |

Institutions clustering in the town centre is correct. The contrast that matters is Vasquez, alone,
out east.

## C.4 Two layers

Mono uppercase pills: `NEEDS` · `COVERAGE`. Default `NEEDS`.

**NEEDS** — one pin per need at its `mapPoint`, coloured by status with the existing tokens. Pin
size constant; **never scale a pin by anything** — a size-encoded pin is a ranking. Hover shows
title, requester, days open, tasks verified. Click navigates to the need.

**COVERAGE** — a qual selector listing all 17, **default `Snow Removal — Plow`**. Territories shade
`--warm-green` at 18% where held (`COVERED · {n} holder(s)`) and `--status-missed` at 14% where
absent (`NO COVERAGE`). Holder initials as small dots inside covered territories. Needs requiring
the selected qual keep their pins, outlined in `--status-missed`.

**When `plow` is selected**, draw a dashed line from Kenosha Pass's centroid to the Vasquez pin,
labelled `22 MIN`. This is the most important thing on the screen.

## C.5 Findings panel

Right rail, headed `WHAT THE MAP SHOWS`. **Every entry computed, never hardcoded.**

1. **`SINGLE-TERRITORY CAPABILITIES`** — any qual held in exactly one territory. Four rows from the
   current seed: `"{Qual} — {Squad} only. {n} territories uncovered."` Clicking a row switches the
   COVERAGE layer to that qual.
2. **`NEEDS IN UNCOVERED TERRITORY`** — open or stalled needs whose required quals are absent from
   the territory containing their `mapPoint`. Yields exactly one:
   `"Driveway plowing — Eleanor Vasquez. Tarryall has no plow. Nearest is Kenosha Pass, 22 minutes."`
3. **`WHERE NEEDS CLUSTER`** — count per territory, listed by name. **Do not rank territories or
   draw a bar chart** — it must not become a scoreboard of which neighbourhood is neediest.

Closing line, `--warm-ink-2`:
`"Two plough trucks is a number. Both plough trucks on the same side of the basin is a decision nobody made on purpose."`

## C.6 Honesty label — required, not optional

Mono 0.6875rem, `--warm-ink-2`, directly beneath the frame:

`"SCHEMATIC — RELATIVE POSITIONS ONLY, NOT A SURVEY. SOUTH PARK IS FICTIONAL; PARK COUNTY IS NOT."`

A hand-drawn diagram shown without qualification invites a reader to think it is geographic data,
and this product's credibility rests on never overclaiming.

## C.7 Annotation 24

Key `map:1`, on the findings panel:

`"The registry already knew there were two plough trucks. It took a map to notice they are both on the same side of the basin, twenty-two minutes from the person who needed one. That is the difference between an inventory and a readiness picture, and it is the thing a county is actually buying."`

---

# PART D — Ribbons

## D.1 The constraint that governs this part

The landing page currently renders:

> *"Rankings are squad-level, so individual glory-seeking has nowhere to go."*
> *"Rewards stay symbolic and local, so no one has a financial reason to game them."*

Both survive this build untouched, because **every ribbon is keyed to reliability, never to
volume**, and **no town-wide individual ranking is ever created.** Nothing is awarded for hours
logged or for doing more than your share. There is no points total and no leaderboard. If a proposed
award would rank residents against each other publicly, it does not ship.

They are called **Ribbons**, on the military analogy where a qualification badge marks capability
and a ribbon marks service — the founding spec explicitly rejects the sticker connotation of
"badge." This produces a clean three-tier model: **quals** are what you can do, **ribbons** are what
you have done, **standing** is what you are trusted with.

## D.2 Data model

```ts
export type RibbonId =
  | 'first-rep' | 'twelve-weeks' | 'half-year' | 'full-year'
  | 'fifty-kept' | 'surge-responder' | 'backstop' | 'multi-qual';

export interface Ribbon { id: RibbonId; name: string; criterion: string; note: string; }
```

**Never stored on a person — derived, like show-rate.** Add `ribbonsFor(person, …): RibbonId[]` to
`derive.ts`.

## D.3 The eight ribbons

| id | name | criterion (display verbatim) | rule |
|---|---|---|---|
| `first-rep` | First Rep | `"Completed your first weekly rep."` | `keptCount >= 1` |
| `twelve-weeks` | Twelve Weeks | `"Twelve consecutive weeks kept."` | `streakWeeks >= 12` |
| `half-year` | Half Year | `"Twenty-six consecutive weeks kept."` | `streakWeeks >= 26` |
| `full-year` | Full Year | `"Fifty-two consecutive weeks kept."` | `streakWeeks >= 52` |
| `fifty-kept` | Fifty Kept | `"Fifty commitments kept, all time."` | `keptCount >= 50` |
| `surge-responder` | Surge Responder | `"Turned out for a surge."` | commitment on a task in a `surge` need |
| `backstop` | Backstop | `"Covered a commitment somebody else had to waive."` | assignee on a task where another person's commitment was `waived` |
| `multi-qual` | Multi-Qual | `"Holds three or more quals."` | `quals.length >= 3` |

**Verified distribution — your build must reproduce this:**

First Rep **24** · Twelve Weeks **19** · Half Year **9** · Full Year **1** (Duke Hollinger) ·
Fifty Kept **5** · Multi-Qual **9** · Backstop **1** (Hank Vasquez) · Surge Responder derived from
Hansen flood assignees.

`backstop` is the most important ribbon and the reason this layer is defensible: **it rewards
covering for somebody else**, the precise opposite of glory-seeking, and the seed already contains
its one instance.

`note` strings:
- `first-rep` — `"Everybody starts here. It is the only one that is not hard."`
- `twelve-weeks` — `"A season of showing up."`
- `half-year` — `"Half a year without a gap. Most volunteer programmes never see this."`
- `full-year` — `"Fifty-two weeks. One person in town holds this."`
- `fifty-kept` — `"Fifty kept promises. Not fifty hours — fifty times somebody could count on you."`
- `surge-responder` — `"You answered when it was not your scheduled week."`
- `backstop` — `"Somebody could not make it, and you took it. This is the one worth having."`
- `multi-qual` — `"Three or more demonstrated capabilities in the registry."`

## D.4 Where they appear

| Screen | Treatment |
|---|---|
| `/me` | `YOUR RIBBONS` panel. Earned full-strength; unearned at 35% opacity with criterion visible |
| `/squad/:id` | Earned ribbons on each `PersonCard`, small |
| `/wall` | **Only** `RIBBONS EARNED THIS MONTH` — names and ribbon, **unordered and uncounted** |
| everywhere else | **None** |

> The Wall constraint is the whole ballgame. A list of who earned what is recognition. The same list
> sorted by count is a leaderboard. **Do not sort, do not count, do not aggregate.**

`RibbonChip` component: 28px/40px, `--warm-paper` face, 1px `--warm-rule` ring, two-letter mono
monogram (`FR` `12` `HY` `FY` `50` `SR` `BS` `MQ`). `full-year` and `backstop` take a
`--warm-stamp` ring. `aria-label` = `"{name} — {criterion}"`, plus `"not yet earned"` when unearned.

---

# PART E — Standing, for individuals

`standing` exists on `Squad`, is displayed in two places unexplained, and has never been built for
people despite the founding spec promising it unlocks authority.

## E.1 The ladder

Derived via `standingFor(person)`. Never stored.

| Standing | Requires | Unlocks |
|---|---|---|
| **Provisional** | Everyone starts here | Hold a weekly rep · claim tasks you are qualified for |
| **Established** | streak ≥ 12 wk **and** show-rate ≥ 85% | + vote on the quarterly task menu |
| **Sponsoring** | streak ≥ 26 wk **and** show-rate ≥ 90% | + sponsor a need onto the board · stand up a new squad |

**Verified distribution: 5 Provisional · 10 Established · 9 Sponsoring. Nora Beckett is
Provisional** (3-week streak, 76%) — correct, and useful: the demo persona sees the ladder above her
rather than sitting at the top of it.

## E.2 Display

`/me`, beneath the show-rate ring: three rungs vertically, current one marked with a
`--warm-stamp` rule, each listing its requirement and what it unlocks. Beneath, `--warm-ink-2`:

`"Standing is earned by keeping small promises over time. It is the only thing in PitchIn that gives you authority over the system, and it is deliberately slow."`

**No countdown, no progress bar, no "3 weeks to go."** Stating the requirement is enough; a progress
bar toward a reward is the volume framing this product rejects.

On `/squad/:id`, standing as a mono label on each `PersonCard`.

---

# PART F — Sponsorship and reciprocity

## F.1 Sponsorship of a need

The Duthie AAR already says *"$612 in materials covered by the parish."* Make it real.

```ts
export interface Sponsorship {
  id: string; needId: string; sponsorOrgId: string;
  what: string; valueUsd: number | null;   // null = in kind
}
```

**Seed exactly three:**

| id | need | sponsor | what | value |
|---|---|---|---|---|
| `sp-ramp-materials` | `need-duthie-ramp` | `org-church` | `"Materials — lumber, hardware, and non-skid tread"` | 612 |
| `sp-flood-drying` | `need-hansen-flood` | `org-fire` | `"Dehumidifiers and air movers, in kind"` | null |
| `sp-flood-meals` | `need-hansen-flood` | `m-citywok` | `"Meals for the family, Thursday through Sunday, in kind"` | null |

Display: a `SPONSORED BY` block on need detail under the progress strip, showing sponsor, what, and
`"$612"` or `"in kind"` in mono. On The Wall, the Duthie entry gains one line:
`"Materials covered by United Methodist Church of South Park — $612."`
**Nowhere else. No sponsor logos, no sponsor screen, no advertising surface.**

## F.2 Reciprocity as visible incentive

Three merchant offers already ship on The Wall, correctly keyed to reliability. What is missing is
that a volunteer never sees what they personally qualify for.

Add a `HONORED LOCALLY` panel to `/me` listing all offers with eligibility computed: eligible at
full strength with mono tag `AVAILABLE TO YOU`; ineligible at 45% opacity showing the criterion
verbatim with tag `NOT YET`.

For Nora: **Tweek Bros. available** · City Wok not yet · Skeeter's tagged `SQUAD`.

Beneath, `--warm-ink-2`:
`"Kept small and local on purpose. A coffee is not payment for your time — it is your town noticing."`

Add one merchant, deliberately keyed to standing so Parts E and F connect:

| id | business | offer | honoredFor |
|---|---|---|---|
| `m-hardware` | South Park Hardware | `"Ten percent off tools and materials, always."` | `"Anyone at Established standing or above."` |

---

# PART G — Landing copy reconciliation

Exactly one line changes. **The first three anti-gaming bullets are unchanged and remain true.**

Replace the closing italic line:
- **Was:** `"...So the reward layer stays deliberately thin."`
- **Becomes:** `"If we get this wrong, we crowd out the intrinsic motive and the whole thing dies. So every reward is keyed to reliability, never to volume — there is no points total, no leaderboard, and nothing you can win by doing more than your share."`

Add a fifth bullet in the existing style:
`"Ribbons record what you did, not how much — and the one worth having is for covering somebody else's shift."`

Add a tenth landing-index entry: `THE MAP` → `/map`, switching role to County, described:
`"Where the town's capability actually sits. Four capabilities exist in exactly one corner of the basin each."`

No other landing copy changes.

---

## 3. Build order

| Phase | Work | Checkpoint |
|---|---|---|
| **1** | Part A — role removal, header post button, `canVerify`, real need creation | Two roles; posting works from both; County verifies the flood but not the ramp; Nora verifies neither until she posts |
| **2** | Part B — proxy model, seeds, tiered visibility, `/post` flow, annotation 23 | Alma named on The Wall, Eleanor generalised with the consent note; both fully named on board and need detail; unchecked consent does not block submission |
| **3** | Part C — map geography, both layers, findings, honesty label, annotation 24 | Findings compute four single-territory quals and exactly one uncovered need; the 22 MIN line draws when plow is selected |
| **4** | Part D — ribbons | Distribution 24 / 19 / 9 / **1** / 5 / 9; Duke alone on Full Year; Hank alone on Backstop; no count or sort anywhere |
| **5** | Part E — standing ladder | 5 / 10 / 9; Nora Provisional; no progress bar |
| **6** | Part F — sponsorship, reciprocity panel, fourth merchant | Duthie shows $612 to the parish; Nora sees 1 of 4 offers available |
| **7** | Part G — landing copy and tenth index entry | Five bullets, revised closing line, ten index entries, 24 annotations |

Commit at every phase boundary. **Every phase boundary is a safe stopping point** — if you run out
of time, stop at one rather than leaving a phase half-applied.

---

## 4. Acceptance checklist

Verify each by running the check, not by assuming.

**Regression — the invariants in §1**
- [ ] All figures in §1 unchanged
- [ ] Vasquez still stalled with both its diagnosis lines
- [ ] Cork on every screen; ops console not restored
- [ ] `ramp-finished.jpg` slot still renders nothing
- [ ] Claimed-task duration still comes from the task, not `scopeMinutes` (note 14 fix intact)

**Part A**
- [ ] `Role` has exactly two members; no `'requester'` anywhere in the codebase
- [ ] `Post a need` is a header button in both roles, not in the nav array
- [ ] County verifies Hansen flood tasks; County cannot verify Duthie ramp tasks; Nora verifies neither
- [ ] Posting creates a real need visible on board, map, and ledger, verifiable by its poster
- [ ] Prefill still creates a new need rather than navigating to the seeded flood

**Part B**
- [ ] Alma named on The Wall; Eleanor generalised with the consent note
- [ ] Both fully named on board and need detail
- [ ] Unchecked consent does not block submission

**Part C**
- [ ] `/map` admin-only; redirects otherwise
- [ ] Findings compute four single-territory quals and exactly one uncovered need
- [ ] 22 MIN line draws when plow is selected
- [ ] Honesty label present verbatim
- [ ] **No mapping library, no tile requests, no network calls**
- [ ] No pin size-scaling, no territory ranking, no bar chart

**Parts D–F**
- [ ] Ribbon distribution 24 / 19 / 9 / 1 / 5 / 9; Duke alone on Full Year; Hank alone on Backstop
- [ ] **No ribbon count, total, sort, or ranking anywhere**; The Wall list unordered and uncounted
- [ ] Standing 5 / 10 / 9; Nora Provisional; no progress bar or countdown
- [ ] Three sponsorships; Duthie shows $612; no sponsor logos
- [ ] Four merchant offers on `/me` with computed eligibility

**Part G**
- [ ] Five anti-gaming bullets; first three unchanged; revised closing line
- [ ] Ten landing-index entries; 24 annotations

---

## 5. Rules that still bind

`AGENTS.md` in full. Especially:

- **Transcribe seed data verbatim.** Every value in this document is data, not a suggestion.
- **The stalled need stays stalled**, and Eleanor stays unnamed on The Wall.
- **Reliability, never volume.** If an award could be earned by doing more than your share, it does
  not ship. **No individual ranking, ever.**
- **No new dependencies.** Ribbons are CSS. The map is hand-drawn SVG.
- **Verify a flagged defect before acting on it** — see §2, note 6.
- Disagreements to `NOTES_FOR_NILS.md`; keep building to spec.
- Report honestly at the end. An accurate list of three failures beats a clean report nobody can
  trust.
