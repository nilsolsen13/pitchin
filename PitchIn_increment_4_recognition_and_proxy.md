# PitchIn — Increment 4: Recognition, Sponsorship, and Proxy Requests

**Status:** Ready to build
**Predecessors:** Increments 1–3
**Depends on:** Increment 3 complete. Do not start until its acceptance checklist passes.
**Scope:** Three additive features — a recognition layer, business sponsorship, and posting on
another resident's behalf.

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
