# PitchIn — Increment 4: Recognition, Sponsorship, and Proxy Requests

**Status:** Ready to build
**Predecessors:** Increments 1–3
**Depends on:** Increment 3 complete. Do not start until its acceptance checklist passes.
**Scope:** Six parts — a recognition layer, business sponsorship, proxy requests, a County map view,
and removal of the requester role.

> **This increment is large.** See §10 for the cut order. Every stopping point leaves a coherent
> product; Part 6 first, because it corrects a modelling error everything else sits on top of.

---

## 0. Context, and the one thing that must not break

The product currently renders these lines on its own landing page:

> *"Rankings are squad-level, so individual glory-seeking has nowhere to go."*
> *"Rewards stay symbolic and local, so no one has a financial reason to game them."*
> *"...the reward layer stays deliberately thin."*

And the founding spec says, in as many words: **"A qual is a credential, not a sticker."**

This increment adds a recognition layer. Done carelessly, it makes the site contradict itself in
front of a reader who scrolled past those lines ninety seconds earlier. Done carefully, it does not
contradict them at all — because the commitments are specific, and two of the three survive
untouched:

| Commitment | Survives? | Why |
|---|---|---|
| Rankings are squad-level | **Yes, untouched** | Ribbons appear on your own profile and to your squad. **No town-wide individual ranking is ever created.** |
| Rewards stay symbolic and local | **Yes, untouched** | Merchant offers stay coffee-and-discount scale, keyed to reliability |
| The reward layer stays thin | **Needs one line rewritten** | See §5 |

**The load-bearing rule for this entire increment: every ribbon is keyed to reliability, never to
volume.** Nothing is awarded for hours logged, tasks completed, or doing more than your share.
There is no points total and no leaderboard. If a proposed award would rank residents against each
other publicly, it does not ship.

### A note on the name

The spec's vocabulary is operational — reps, squads, quals, surge, materiel, standing. "Badges" sits
oddly in it and carries exactly the sticker connotation the founding spec rejected. These are
specced as **Ribbons**, on the military analogy where a qualification badge marks capability and a
ribbon marks service. It is the badge layer that was asked for, renamed to fit.

If you prefer "Badges", it is a find-and-replace on one identifier and one label — say so and it
changes. Nothing else depends on the word.

### The three-tier model this produces

| Tier | Answers | Earned by | Consequential? |
|---|---|---|---|
| **Quals** | What you *can do* | Demonstration | Yes — determines surge callout |
| **Ribbons** | What you *have done* | Sustained record | No — recognition only |
| **Standing** | What you're *trusted with* | Sustained reliability | Yes — unlocks authority |

Capability, record, authority. Quals and Standing already exist in the data model; only Ribbons are
new, and Standing has never been built for individuals despite being promised in the founding spec.

---

# PART 1 — Ribbons

## 1.1 Data model

Add to `src/types.ts`:

```ts
export type RibbonId =
  | 'first-rep' | 'twelve-weeks' | 'half-year' | 'full-year'
  | 'fifty-kept' | 'surge-responder' | 'backstop' | 'multi-qual';

export interface Ribbon {
  id: RibbonId;
  name: string;
  criterion: string;   // shown verbatim in the UI — the rule, stated plainly
  note: string;        // one line on why this is worth recognising
}
```

**Ribbons are never stored on a person.** They are derived, exactly like show-rate. Add to
`src/lib/derive.ts`:

```ts
ribbonsFor(person, commitments, tasks, needs): RibbonId[]
ribbonHolders(ribbonId, people, ...): Person[]
```

## 1.2 The eight ribbons — exact definitions

| id | name | criterion (display verbatim) | rule |
|---|---|---|---|
| `first-rep` | First Rep | `"Completed your first weekly rep."` | `keptCount >= 1` |
| `twelve-weeks` | Twelve Weeks | `"Twelve consecutive weeks kept."` | `streakWeeks >= 12` |
| `half-year` | Half Year | `"Twenty-six consecutive weeks kept."` | `streakWeeks >= 26` |
| `full-year` | Full Year | `"Fifty-two consecutive weeks kept."` | `streakWeeks >= 52` |
| `fifty-kept` | Fifty Kept | `"Fifty commitments kept, all time."` | `keptCount >= 50` |
| `surge-responder` | Surge Responder | `"Turned out for a surge."` | holds a commitment on a task belonging to a `mode: 'surge'` need |
| `backstop` | Backstop | `"Covered a commitment somebody else had to waive."` | is the assignee on a task where another person's commitment was `waived` |
| `multi-qual` | Multi-Qual | `"Holds three or more quals."` | `quals.length >= 3` |

**Verified distribution from the current seed** — your build must reproduce these:

| Ribbon | Holders |
|---|---|
| First Rep | 24 |
| Twelve Weeks | 19 |
| Half Year | 9 |
| Full Year | **1** — Duke Hollinger |
| Fifty Kept | 5 |
| Multi-Qual | 9 |
| Backstop | **1** — Hank Vasquez (covered Duke Hollinger's waived footing shift on the ramp) |
| Surge Responder | derived from Hansen flood assignees |

`backstop` is the most important ribbon in the set and the reason this layer is defensible: **it
rewards covering for somebody else.** It is the precise opposite of glory-seeking, and the seed
already contains its one instance.

`ribbon.note` strings, shown on hover/expand:

- `first-rep` — `"Everybody starts here. It is the only one that is not hard."`
- `twelve-weeks` — `"A season of showing up."`
- `half-year` — `"Half a year without a gap. Most volunteer programmes never see this."`
- `full-year` — `"Fifty-two weeks. One person in town holds this."`
- `fifty-kept` — `"Fifty kept promises. Not fifty hours — fifty times somebody could count on you."`
- `surge-responder` — `"You answered when it was not your scheduled week."`
- `backstop` — `"Somebody could not make it, and you took it. This is the one worth having."`
- `multi-qual` — `"Three or more demonstrated capabilities in the registry."`

## 1.3 Where ribbons appear — and where they must not

| Screen | Treatment |
|---|---|
| `/me` | New `YOUR RIBBONS` panel. Earned ribbons full-strength; unearned shown at 35% opacity with their criterion visible, so the path is legible |
| `/squad/:id` | Each `PersonCard` shows earned ribbons, small |
| `/calendar` | None |
| `/board`, `/registry`, `/post`, `/need/:id` | **None** |
| `/readiness` | **None** |
| `/wall` | **Only** a `RIBBONS EARNED THIS MONTH` list — names and ribbon, **unordered and uncounted.** No totals, no ranking, no "most" |

> The Wall constraint is the whole ballgame. A list of who earned what is recognition. The same list
> sorted by count is a leaderboard, and a leaderboard contradicts the landing page. **Do not sort,
> do not count, do not aggregate.**

## 1.4 The `RibbonChip` component

`src/components/RibbonChip.tsx`. Small pinned-enamel look, consistent with the cork board:

- Circular or shield-ish, 28px (`sm`) / 40px (`md`), `--warm-paper` face, 1px `--warm-rule` ring
- Two-letter monogram in `font-mono` uppercase (`FR`, `12`, `HY`, `FY`, `50`, `SR`, `BS`, `MQ`)
- Earned: full opacity, subtle inner shadow. Unearned: 35% opacity, no shadow
- `full-year` and `backstop` take a `--warm-stamp` ring — the two scarce ones
- Tooltip / expand shows `name`, `criterion`, and `note`
- `aria-label` = `"{name} — {criterion}"`, plus `"not yet earned"` when unearned

---

# PART 2 — Standing, for individuals

`standing` already exists on `Squad` and is displayed in two places, unexplained. The founding spec
promises it unlocks real authority. It has never been built for people.

## 2.1 The ladder

Derived, never stored. Add `standingFor(person): Standing` to `derive.ts`.

| Standing | Requires | Unlocks |
|---|---|---|
| **Provisional** | Everyone starts here | Hold a weekly rep · claim tasks you are qualified for |
| **Established** | streak ≥ 12 weeks **and** show-rate ≥ 85% | + vote on the quarterly task menu |
| **Sponsoring** | streak ≥ 26 weeks **and** show-rate ≥ 90% | + sponsor a need onto the board · stand up a new squad |

**Verified distribution:** 5 Provisional · 10 Established · 9 Sponsoring.
**Nora Beckett is Provisional** (3-week streak, 76% show-rate) — correct, and useful: the demo
persona can see the ladder above her rather than sitting at the top of it.

## 2.2 Display

On `/me`, a `YOUR STANDING` panel directly beneath the show-rate ring:

- Three rungs rendered vertically, current one marked with a `--warm-stamp` rule
- Each rung lists its requirement and what it unlocks, in the strings above
- Beneath, for anyone not at the top, in `--warm-ink-2`:
  `"Standing is earned by keeping small promises over time. It is the only thing in PitchIn that gives you authority over the system, and it is deliberately slow."`
- **No countdown, no progress bar, no "3 weeks to go" nudge.** Stating the requirement is enough;
  a progress bar toward a reward is the volume framing this product rejects.

On `/squad/:id`, each member's standing appears as a mono label on their `PersonCard`.

---

# PART 3 — Sponsorship and reciprocity

## 3.1 Sponsorship of a need

The Duthie AAR already says *"$612 in materials covered by the parish."* Sponsorship exists in the
prose and not in the model. Make it real.

```ts
export interface Sponsorship {
  id: string;
  needId: string;
  sponsorOrgId: string;     // an Org, or a Merchant id
  what: string;             // "Materials — lumber, hardware, non-skid"
  valueUsd: number | null;  // null = in kind
}
```

**Seed exactly three:**

| id | need | sponsor | what | value |
|---|---|---|---|---|
| `sp-ramp-materials` | `need-duthie-ramp` | `org-church` | `"Materials — lumber, hardware, and non-skid tread"` | 612 |
| `sp-flood-drying` | `need-hansen-flood` | `org-fire` | `"Dehumidifiers and air movers, in kind"` | null |
| `sp-flood-meals` | `need-hansen-flood` | `m-citywok` | `"Meals for the family, Thursday through Sunday, in kind"` | null |

Display:
- **Need detail** — a `SPONSORED BY` block under the progress strip. Sponsor name, what, and
  `"$612"` or `"in kind"` in mono.
- **The Wall** — the Duthie entry gains one line: `"Materials covered by United Methodist Church of South Park — $612."`
- **Nowhere else.** No sponsor logos, no sponsor screen, no advertising surface.

## 3.2 Reciprocity as visible incentive

Three merchant offers already ship on The Wall. They are correctly keyed to reliability
(`"any member with an active streak"`, `"anyone who turned out for a surge in the last 30 days"`).
What is missing is that a volunteer never sees what they personally qualify for.

Add to `/me` a `HONORED LOCALLY` panel listing all three offers with eligibility computed:

- **Eligible** — full strength, mono tag `AVAILABLE TO YOU`
- **Not yet** — 45% opacity, showing the criterion verbatim, mono tag `NOT YET`

For Nora (3-week active streak, no surge turnout): Tweek Bros. **available**; City Wok **not yet**;
Skeeter's shown as squad-level with the tag `SQUAD`.

Beneath the panel, `--warm-ink-2`:
`"Kept small and local on purpose. A coffee is not payment for your time — it is your town noticing."`

Add one merchant so the panel has a fourth row:

| id | business | offer | honoredFor |
|---|---|---|---|
| `m-hardware` | South Park Hardware | `"Ten percent off tools and materials, always."` | `"Anyone at Established standing or above."` |

That one is deliberately keyed to **standing**, tying Parts 2 and 3 together.

---

# PART 4 — Posting on another resident's behalf

## 4.1 Why this matters

Two of the six seeded needs are already proxy requests — Marguerite Ellery posted for Eleanor
Vasquez, and the parish posted for Alma Duthie — and the model has no concept of it.

This is not a convenience feature. **The residents with the greatest need are the least likely to
use software.** An 82-year-old snowed in on Tarryall Road is not going to post to a web app. Proxy
posting is the primary path for the highest-need cases, and a civic platform without it quietly
serves only the people who were already fine.

## 4.2 Data model

```ts
export interface OnBehalfOf {
  name: string;               // "Eleanor Vasquez"
  age: number | null;         // 82
  locationSpecific: string;   // "Tarryall Road"
  locationGeneral: string;    // "the Tarryall side"
  relationship: string;       // "Neighbour" | "Nephew" | "Parish"
  publicNameConsent: boolean; // may the public Wall name them?
}
```

Add `onBehalfOf: OnBehalfOf | null` to `Need`.

## 4.3 Tiered visibility — the important part

Reuse the boundary the permission model already establishes for show-rate.

| Viewer | Sees |
|---|---|
| `resident`, `requester`, `admin` on `/board`, `/need/:id` | Full: `"Eleanor Vasquez, 82 · Tarryall Road"` |
| **`/wall` — the public board** | Depends on `publicNameConsent` |

On The Wall only:
- `publicNameConsent: true` → full name (`"Alma Duthie, Bijou Street"`)
- `publicNameConsent: false` → generalised (`"a resident on the Tarryall side"`)

**Seed:** Alma Duthie `true`. Eleanor Vasquez `false`.

And the reason is the point. Add beneath the generalised entry, mono 0.6875rem, `--warm-ink-2`:
`"Named only with the resident's say-so. Nobody has reached Eleanor yet."`

> One resident named and celebrated, one deliberately not — and the difference is consent, visible
> in a single comparison on one screen. It costs nothing and it is the strongest evidence in the
> product that its privacy model is real rather than asserted.

## 4.4 Seed values

**`need-vasquez-plow`:**
`{ name: 'Eleanor Vasquez', age: 82, locationSpecific: 'Tarryall Road', locationGeneral: 'the Tarryall side', relationship: 'Neighbour', publicNameConsent: false }`

**`need-duthie-ramp`:**
`{ name: 'Alma Duthie', age: 79, locationSpecific: 'Bijou Street', locationGeneral: 'the Bijou Street end of town', relationship: 'Parish', publicNameConsent: true }`

All four other needs: `onBehalfOf: null`.

## 4.5 The posting flow

On `/post`, beneath the requester select, a checkbox:
`"I'm posting this for someone else"`

When checked, reveal four fields — `Their name`, `Age (optional)`, `Where they are`,
`Your relationship to them` — plus a required checkbox:

`"They know I'm posting this, and they're happy to be named publicly."`

Leaving that unchecked is **valid and must not block submission.** It sets
`publicNameConsent: false`, and an inline note appears in `--warm-ink-2`:
`"That's fine. Their name will show to squads working the need, and the public wall will say only roughly where they are."`

Nothing about this flow should feel like a warning or a compliance gate. It is one question asked
plainly.

## 4.6 Annotation 23

Key `wall:4`, anchored to the generalised Vasquez entry:

`"The people who most need help are the least likely to use software, so somebody else has to be able to ask on their behalf. That creates a problem — a vulnerable neighbour's name on a public board — and the answer is the same boundary the rest of the system uses: squads see who, the town sees roughly where, and the name is public only if she says so."`

---

# PART 5 — Landing copy reconciliation

Exactly one line changes. The first three anti-gaming bullets are **unchanged and remain true.**

Replace the closing italic line of the anti-gaming section:

- **Was:** `"If we get this wrong, we crowd out the intrinsic motive and the whole thing dies. So the reward layer stays deliberately thin."`
- **Becomes:** `"If we get this wrong, we crowd out the intrinsic motive and the whole thing dies. So every reward is keyed to reliability, never to volume — there is no points total, no leaderboard, and nothing you can win by doing more than your share."`

Add a fifth bullet to the same list, matching the existing square-bullet style:

`"Ribbons record what you did, not how much — and the one worth having is for covering somebody else's shift."`

No other landing copy changes.

---

## 6. Build order

| Phase | Work | Checkpoint |
|---|---|---|
| **1** | Ribbon types, the eight definitions, `ribbonsFor`, `RibbonChip` | Distribution matches §1.2 exactly: 24 / 19 / 9 / 1 / 5 / 9, Duke alone on Full Year, Hank alone on Backstop |
| **2** | Ribbons on `/me` and `/squad`; `RIBBONS EARNED THIS MONTH` on The Wall | No count, no sort, no ranking anywhere. Ribbons absent from board, registry, post, need detail, readiness, calendar |
| **3** | Individual standing ladder, `/me` panel, squad labels | 5 / 10 / 9 split; Nora reads Provisional; no progress bar or countdown |
| **4** | `Sponsorship` model, three seeds, need-detail and Wall display | Duthie shows $612 to the parish; Hansen shows two in-kind sponsors |
| **5** | `HONORED LOCALLY` on `/me` + the South Park Hardware merchant | Nora: Tweek Bros. available, City Wok not yet, Skeeter's squad, Hardware not yet |
| **6** | `OnBehalfOf` model, seeds, tiered visibility, `/post` flow, annotation 23 | Alma named on The Wall; Eleanor generalised with the consent note; both fully named on board and need detail |
| **7** | Landing copy reconciliation (§5) | The five bullets and the revised closing line render; nothing else on `/` changed |

Commit at each phase boundary.

---

## 7. Acceptance checklist

- [ ] `npm run build` passes; no console errors on any route
- [ ] Ribbon distribution: 24 / 19 / 9 / **1** / 5 / 9, with Duke Hollinger alone on Full Year and Hank Vasquez alone on Backstop
- [ ] **No ribbon count, total, sort, or ranking exists anywhere in the product**
- [ ] The Wall's ribbon list is unordered and uncounted
- [ ] Ribbons do not appear on board, registry, post, need detail, readiness, or calendar
- [ ] Standing splits 5 Provisional / 10 Established / 9 Sponsoring; Nora is Provisional
- [ ] No progress bar or countdown toward any standing or ribbon
- [ ] Three sponsorships seeded; Duthie shows $612 to the parish; no sponsor logos anywhere
- [ ] Four merchant offers on `/me` with eligibility computed per viewer
- [ ] On The Wall, Alma Duthie is named and Eleanor Vasquez is generalised, with the consent note
- [ ] On board and need detail, both beneficiaries are fully named
- [ ] `/post` proxy flow works, and leaving the consent box unchecked does **not** block submission
- [ ] Landing shows five anti-gaming bullets and the revised closing line; first three bullets unchanged
- [ ] All prior figures unchanged: show-rate 90.7%, median 19.5 wk, utilization 61%, 17 quals, Hansen flood 16 people / 26.75 person-hours, registry 4 / 9 / 12 / 1
- [ ] The Vasquez need is still stalled and unstaffed

---

## 8. Rules that still bind

`AGENTS.md` in full, plus:

- **Reliability, never volume.** If an award could be earned by doing more than your share, it does
  not ship.
- **No individual ranking, ever.** Squad-level only in public. This is the commitment the landing
  page makes and this increment must not break it.
- **The stalled need stays stalled**, and Eleanor stays unnamed on The Wall.
- No new dependencies. Ribbons are CSS, not an icon library.
- Verify a flagged defect before acting on it (Increment 3 §1).
- Disagreements to `NOTES_FOR_NILS.md`.

---

# PART 5 — County Map view

## 5.1 Why a map, and what it must not be

County officials need to spot trends across the basin. The trend worth spotting is already in the
data and is invisible in every table the product currently renders: **capability is geographically
clustered.** A table says "2 plow trucks." A map says "both plow trucks are here, and the need is
over there."

Verified from the seed — four capabilities exist in exactly one of four territories:

| Qual | Held by | Uncovered territories |
|---|---|---|
| Snow Removal — Plow | Kenosha Pass only | Creek Side, Red Hill, **Tarryall** |
| EMT-Paramedic | Kenosha Pass only | Creek Side, Red Hill, Tarryall |
| Spanish Interpreter | Kenosha Pass only | Creek Side, Red Hill, Tarryall |
| Pump Operator | Creek Side only | Kenosha Pass, Red Hill, Tarryall |

Eleanor Vasquez's stalled need is in **Tarryall**. Every plow is in **Kenosha Pass**. That is the
map's punchline and it must be legible in three seconds.

**This is a hand-drawn SVG schematic. It is not a real map.** No mapping library, no tile server, no
GeoJSON, no network requests, no lat/long. Three reasons, all binding:

1. `AGENTS.md` forbids new dependencies and network calls.
2. The demo must work with no internet.
3. **South Park is fictional.** A real Park County basemap would show Fairplay and Hartsel and no
   South Park at all, which would undercut the whole demo.

Draw the basin. Do not fetch it.

## 5.2 Route and access

`/map`, **admin only** — redirects to `/board` otherwise, same pattern as `/readiness`. Nav label
`Map`, placed immediately after `Readiness`.

## 5.3 Geography — schematic coordinates

Coordinates are abstract, in a `viewBox="0 0 1000 700"`. They are **not** geographic and the screen
says so (§5.6).

Add to `Squad`:
```ts
territory: { label: string; path: string; cx: number; cy: number };
```

Four territories filling the basin, roughly compass-placed on real Park County orientation:

| Squad | Position | Centroid |
|---|---|---|
| Kenosha Pass | North | ~(500, 150) |
| Tarryall | East | ~(790, 380) |
| Creek Side | Centre-west, along the Middle Fork — contains the town centre | ~(330, 380) |
| Red Hill | South | ~(520, 590) |

Draw them as four irregular polygons that tile the frame with a small gap, so it reads as a
surveyed basin rather than a pie chart. Ring the whole frame with a soft mountain edge.

Static furniture, drawn once:
- **The Middle Fork** — a line running roughly north-south through Creek Side, labelled
- **Town centre** — a small cluster marker inside Creek Side labelled `SOUTH PARK`
- **Roads** — two or three thin lines connecting territories
- Territory name labels in `font-display` uppercase, `--warm-ink-2`

Add to `Need`: `mapPoint: { x: number; y: number } | null`.

| Need | Point | Sits in |
|---|---|---|
| `need-hansen-flood` | (295, 300) | Creek Side, on the Middle Fork |
| `need-vasquez-plow` | (820, 350) | **Tarryall** |
| `need-duthie-ramp` | (350, 415) | Creek Side, town centre |
| `need-school-chaperones` | (315, 440) | Creek Side, town centre |
| `need-cows-timing` | (375, 455) | Creek Side, town centre |
| `need-interpreter-desk` | (340, 470) | Creek Side, town centre |

Institutions clustering in the town centre is correct and realistic — the school, the parish, and
the county offices are all there. The contrast that matters is Vasquez out east, alone.

## 5.4 Two layers

Selector at the top, mono uppercase pills: `NEEDS` · `COVERAGE`. Default `NEEDS`.

### Layer: NEEDS
- One pin per need at its `mapPoint`, coloured by status using the existing status tokens
  (surge, stalled, in progress, staffing, met)
- Pin size constant. **Do not scale pins by anything** — a size-encoded pin is a ranking
- Hover: need title, requester, days open, tasks verified
- Click: navigates to `/need/{id}`
- Territories drawn in a flat neutral fill

### Layer: COVERAGE
- A qual selector beside the layer pills, listing all 17 quals. **Default: `Snow Removal — Plow`**
- Territories shade by whether any member holds the selected qual:
  - held → `--warm-green` at 18% opacity, mono label `COVERED · {n} holder(s)`
  - absent → `--status-missed` at 14% opacity, mono label `NO COVERAGE`
- Holder initials render as small dots inside covered territories
- Needs requiring the selected qual keep their pins, outlined in `--status-missed`
- **When `plow` is selected**, draw a dashed line from Kenosha Pass's centroid to the Vasquez pin,
  labelled in mono: `22 MIN`. This is the single most important thing on the screen

## 5.5 Findings panel — where "spot trends" actually happens

A right-hand rail, headed `WHAT THE MAP SHOWS`. **Every entry is computed, never hardcoded.**

**Section 1 — `SINGLE-TERRITORY CAPABILITIES`.** Any qual held in exactly one of four territories.
Renders four rows from the current seed, each `"{Qual} — {Squad} only. {n} territories uncovered."`
Clicking a row switches the COVERAGE layer to that qual.

**Section 2 — `NEEDS IN UNCOVERED TERRITORY`.** Any open or stalled need whose required quals are
absent from the territory containing its `mapPoint`. From the current seed this yields exactly one:

`"Driveway plowing — Eleanor Vasquez. Tarryall has no plow. Nearest is Kenosha Pass, 22 minutes."`

**Section 3 — `WHERE NEEDS CLUSTER`.** Count of needs per territory, listed by name. **Do not rank
territories or render a bar chart** — a list, so it does not become a scoreboard of which
neighbourhood is neediest.

Closing line beneath the panel, `--warm-ink-2`:
`"Two plough trucks is a number. Both plough trucks on the same side of the basin is a decision nobody made on purpose."`

## 5.6 Honesty label — required

Mono 0.6875rem, `--warm-ink-2`, directly beneath the map frame:

`"SCHEMATIC — RELATIVE POSITIONS ONLY, NOT A SURVEY. SOUTH PARK IS FICTIONAL; PARK COUNTY IS NOT."`

This is not optional. A hand-drawn diagram presented without qualification invites a reader to
believe it is geographic data, and the product's credibility rests on never overclaiming.

## 5.7 Annotation 24

Key `map:1`, anchored to the findings panel:

`"The registry already knew there were two plough trucks. It took a map to notice they are both on the same side of the basin, twenty-two minutes from the person who needed one. That is the difference between an inventory and a readiness picture, and it is the thing a county is actually buying."`

---

# PART 6 — Remove the requester role

## 6.1 The correction

Increment 1 modelled three roles: `resident`, `requester`, `admin`. **That was wrong.** Requester is
not a role a person occupies — it is a **relationship to a specific need**. Anyone can be a
requester by posting something.

Modelling it as a mode forced a fiction where a viewer "becomes" the requester, and it made the
product's most important permission rule look like a mode toggle rather than what it is.

**Supersedes:** MVP spec §3 and §7.3, Increment 2 §1.2 and §1.3. Where those conflict with this
part, this part wins.

## 6.2 The new model

**Two roles.** `Role = 'resident' | 'admin'`. Delete `'requester'` everywhere.

| Role | Demo identity | Owns needs posted by |
|---|---|---|
| `resident` | Nora Beckett, Creek Side | anything she posts in-session |
| `admin` | Park County | `org-pcem` and `org-county` |

**Posting is open to both.** `Post a need` becomes a **standing button in the header**, present for
every role — not a nav item, not gated. Style it as the one primary action in the top bar:
`--warm-stamp` fill, `--warm-paper` text, 2px radius, mono uppercase, to the left of the role
switcher.

**The role switcher becomes two buttons:** `RESIDENT` · `COUNTY`. Below 1100px: `RES` · `CTY`.

## 6.3 Verification permission — now derived, and better for it

Replace the role check with an ownership check in `derive.ts`:

```ts
canVerify(role: Role, need: Need): boolean
// true when the current account owns the need:
//   admin    -> need.requesterOrgId is 'org-pcem' or 'org-county'
//   resident -> need was posted by this resident in-session
```

What this produces on `/need/hansen-flood`, which is a **better demonstration than the old role
toggle**:

| Viewing as | Verify on the Hansen flood | Verify on the Duthie ramp |
|---|---|---|
| Resident (Nora) | Disabled — `"Only the requester can verify a task."` | Disabled — same |
| County | **Enabled** — Park County EM posted it | Disabled — the parish posted it |

Same screen, two different outcomes, and the difference is *who asked for the work* rather than
which mode you selected. Keep the existing tooltip string exactly.

## 6.4 Posting must now actually create a need

Today `/post` stage 3 navigates to `/need/hansen-flood` without creating anything. With posting open
to residents, that no longer holds together — a resident must be able to post and then verify.

Change: `"Post to the board"` commits the decomposed need to in-memory state with a generated id,
`requesterOrgId` set from the current account, `mode` from the form, `status: 'staffing'`, tasks in
`open`, and `mapPoint` set to the town centre `(340, 430)`. Then navigate to that new need.

It appears on the board, on the map, and in the ledger, and its poster can verify its tasks. Reset
clears it, like all other session state.

If the reviewer used the `"Use the Hansen flood"` prefill, still create a **new** need rather than
navigating to the seeded one — otherwise the flow silently does nothing.

## 6.5 Consequential edits

- **Routing** — `/post` is no longer role-gated. `/me` stays resident-only. `/readiness` and `/map`
  stay admin-only.
- **Nav** — remove `Post a Need` from the nav array; it is a header button now.
- **Increment 2 §1.3 landing index** — `POST A NEED` no longer needs an automatic role switch.
  `READINESS` still switches to County. Add a tenth entry, `THE MAP` → `/map`, description:
  `"Where the town's capability actually sits. Four capabilities exist in exactly one corner of the basin each."`
- **Increment 2 §1.2** — the segmented control is two buttons, not three.
- **`actorForRole`** — drop the requester branch.
- **Anywhere `role === 'requester'` appears** — replace with the `canVerify` ownership check.

---

## 9. Revised build order

Parts 1–4 keep phases 1–7 as specced. Then:

| Phase | Work | Checkpoint |
|---|---|---|
| **8** | Part 6 role removal, header post button, `canVerify`, real need creation | Two roles only; posting works from both; County can verify the flood but not the ramp; Nora can verify neither until she posts something |
| **9** | Part 5 map — geography, both layers, findings panel, honesty label | Findings compute the four single-territory quals and the one uncovered need; the 22 MIN line draws when plow is selected |
| **10** | Annotation 24, landing index tenth entry | 24 annotations total |

## 10. Cut order if time runs short

Increment 4 is now large. Build in this order and stop wherever you must — every stopping point
leaves a coherent product:

1. **Part 6** (role removal) — corrects a modelling error and simplifies everything downstream
2. **Part 4** (proxy) — strongest single idea in this increment
3. **Part 5** (map) — best payoff per unit of work for the County story
4. **Part 1–2** (ribbons, standing)
5. **Part 3** (sponsorship, reciprocity panel)

## 11. Additions to the acceptance checklist

- [ ] `Role` has exactly two members; no `'requester'` remains anywhere in the codebase
- [ ] `Post a need` is a header button visible in both roles and is not in the nav array
- [ ] County can verify Hansen flood tasks; County **cannot** verify Duthie ramp tasks; Nora can verify neither
- [ ] Posting creates a real need that appears on the board, the map, and the ledger, and whose poster can verify its tasks
- [ ] `/map` is admin-only and redirects otherwise
- [ ] Findings panel computes four single-territory quals and exactly one need in uncovered territory
- [ ] Selecting Snow Removal — Plow draws the 22 MIN line from Kenosha Pass to the Vasquez pin
- [ ] The schematic honesty label is present verbatim
- [ ] No mapping library, no tile requests, no network calls of any kind
- [ ] No pin is size-scaled and no territory ranking or bar chart exists
