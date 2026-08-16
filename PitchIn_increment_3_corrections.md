# PitchIn — Increment 3: Corrections and Consistency

**Status:** Ready to build
**Predecessors:** `PitchIn_MVP_build_spec.md` (Increment 1, shipped) · `PitchIn_increment_2_calendar_and_polish.md` (Increment 2)
**Depends on:** Increment 2 complete. Do not start this until Increment 2's acceptance checklist passes.
**Size:** Small. One new qual, one copy addition, and a set of ratifications.

---

## 0. Context

After Increment 1, the build agent filed ten notes in `NOTES_FOR_NILS.md` recording places where the
spec disagreed with itself or with the seed. In every case it built to the derivation rules rather
than papering over the gap, which was the correct call. Those notes were never resolved — they have
been sitting as open questions while two further increments were specced on top of them.

This increment closes all ten, plus two questions raised since.

**On data sourcing:** the agent asked whether public records could seed the capability registry.
The answer is settled and needs no build work: **the demo stays fully synthetic.** No scraping, no
CORA requests, no external data. The agent's underlying analysis — that public records can seed a
needs board but are structurally silent on household capability — is correct and is good spoken
pitch material, but only one line of it becomes product (§2.2).

---

## 1. Findings — what was actually wrong

Every note re-checked against the seed. **Two required a code change. One was not a defect at all.**

| # | Note | Verdict |
|---|---|---|
| 1 | Phase 4 checkpoint says "people committed → 15"; derivation gives 16 → 17 | **Spec error.** Agent correct. Corrected in the MVP spec |
| 2 | "20 annotations" referenced; only 18 enumerated | **Spec error.** Agent correct. True count is now 22 after Increments 2–3 |
| 3 | `joinedDate` / `availability` missing from A.4 | **Spec gap.** Agent's defaults ratified — §3.4 |
| 4 | Nora's 12-week strip double-counts 2026-02-19 and yields 13 cells | **Spec error.** Agent's resolution ratified — §3.5 |
| 5 | Creek Side "11 quals / 6 assets" vs derived 13 / 13; "NO PUMP OPERATOR" example wrong | **Spec error.** Both derived values confirmed at 13. Corrected in the MVP spec |
| 6 | Ray Ferrin's 46-week streak "predates" Creek Side's founding | **NOT A DEFECT.** See below |
| 7 | "Bilingual paramedic" has no paramedic qual behind it | **Real data defect.** Fixed — §2.1 |
| 8 | Accept-rep and verify-task toast strings unspecified | **Spec gap.** Agent's strings ratified — §3.2 |
| 9 | The Wall's three "STILL OPEN" entries unenumerated | **Spec gap.** Agent's choices ratified — §3.3 |
| 10 | Cork bulletin visual contradicts §6's ops-console spec | **Superseded by direction.** Cork is canonical — §3.1 |

### Note 6 is an arithmetic error, not a data defect

The note states Creek Side's `formedDate` of 2024-06-14 is "~39 weeks" before the 2026-03-12 demo
date. It is **90 weeks**. A year was dropped. Recomputed:

| Squad | Formed | Age at demo date | Longest member streak | Fits |
|---|---|---|---|---|
| Creek Side | 2024-06-14 | 90 wk | Ray Ferrin, 46 wk | Yes |
| Kenosha Pass | 2024-03-08 | 104 wk | Marisol Vega, 41 wk | Yes |
| Red Hill | 2024-01-19 | 111 wk | Duke Hollinger, 52 wk | Yes |
| Tarryall | 2025-04-11 | 47 wk | Hank Vasquez, 29 wk | Yes |

**No personal streak exceeds its squad's existence. Change nothing.** Do not adjust streaks, do not
move `formedDate`s, and do not add a narrative explanation for a contradiction that isn't there.

> Worth keeping in mind generally: an agent flagging a defect is evidence worth checking, not a
> finding to act on. This one would have caused a pointless rewrite of four squads' seed data.

---

## 2. Changes to build

### 2.1 Add an EMT-Paramedic qual

The registry headline claims **1 BILINGUAL PARAMEDIC**. No `paramedic` qual exists, so the figure
was derived as *holders of both `wfr` and `spanish-interpreter`*. A Wilderness First Responder is an
80-hour wilderness certification — **not a paramedic**. The claim and the data disagree.

**Add to `QualId` in `src/types.ts` and to the qual seed:**

```
id:            'emt-paramedic'
name:          'EMT-Paramedic'
category:      'Response'
demonstration: 'Current Colorado EMT-Paramedic certification, verified with the fire district.'
```

**Award it to Marisol Vega (`p-vega`) only.** Her quals become:
`['spanish-interpreter', 'wfr', 'first-aid', 'emt-paramedic']`

She keeps `wfr` — a backcountry-capable paramedic in a 9,800 ft basin plausibly holds both, and
removing it would drop the WFR count from 3 to 2 for no reason.

**Consequences — all derived, all must update automatically:**

| Where | Was | Becomes |
|---|---|---|
| Qual count (`/board` Town Capacity) | `16 QUALS IN CIRCULATION` | `17 QUALS IN CIRCULATION` |
| `/registry` qual list | 16 rows | 17 rows; new EMT-Paramedic row, 1 holder, tagged `SINGLE POINT OF FAILURE` |
| `/registry` headline `1 BILINGUAL PARAMEDIC` | derived `wfr ∧ spanish-interpreter` | derived **`emt-paramedic ∧ spanish-interpreter`** — still exactly 1 |
| Kenosha Pass distinct quals (`/squad`) | 12 | 13 |

No other figure moves. Town show-rate, median streak, utilization, equipment counts, and the Hansen
flood numbers are all untouched.

### 2.2 Sharpen the Readiness capacity gap

Marisol Vega is now, in the data, simultaneously the town's only Spanish interpreter **and** its
only paramedic. That is a genuine single-point-of-failure the system should surface, and it is
exactly the kind of insight the product claims to produce.

Replace the third capacity-gap line on `/readiness`:

- **Was:** `"SPANISH INTERPRETER — 1 qualified. Tuesday county services desk has no backup."`
- **Becomes:** `"SPANISH INTERPRETER — 1 qualified, and she is also the county's only paramedic. A surge takes her, and the Tuesday services desk goes dark."`

Keep the other two gap lines exactly as they are.

### 2.3 Ground the Vasquez stall in real policy

The stalled need's capacity gap currently explains the *supply* problem. Add the *institutional*
half beneath it, as a second line in the same block, mono 0.6875rem, `--warm-ink-2`:

```
Park County Road & Bridge maintains county-system roads only.
Private drives are the owner's responsibility.
```

This appears in **two places** — the stalled flyer on `/board` and the need detail for
`need-vasquez-plow`. Not on The Wall.

This is verified fact about the real Park County, Colorado ([Public
Works](https://www.parkcountyco.gov/87/Public-Works), [Snow Removal
Policy](https://www.parkcountyco.gov/DocumentCenter/View/3219/Snow-Removal-Policy)). It is included
because it converts the stall from a story beat into a structural fact: the county has *already
decided* it will not do this, which is precisely the space PitchIn exists to fill.

**Do not add any other public-data references, citations, sources panel, or "where this data comes
from" surface.** One line, two places. Everything else stays in the spoken pitch.

---

## 3. Ratifications — canonical now, no code change

These are decisions the agent already made and built. They are written here so they stop reading as
defects and so no future agent "corrects" them back.

### 3.1 The cork bulletin aesthetic is canonical

§6 of the MVP spec specifies an Ops (dark dispatch console) palette for working screens and Warm
(letterpress) only for `/` and `/wall`. **That is superseded.** Every screen is a cork dorm
bulletin — pinned flyers, paper stock, warm ink, wood chrome — applied after Increment 1 at the
owner's direction.

**Do not restore the ops console.** Both token sets remain defined and cork is applied as a property
of the screens, not as a theme toggle. Status colors, mono-for-measurements, and all spec copy are
unchanged.

### 3.2 Toast strings

`"REP ACCEPTED"` on accepting a weekly rep. `"TASK VERIFIED"` on a requester verifying a task.
Both mono uppercase, consistent with the existing toasts.

### 3.3 The Wall's "STILL OPEN" entries

Three, in this order: the Hansen flood, the Vasquez driveway (with its exact
`"6 DAYS · NEEDS A PLOW TRUCK ON THE TARRYALL SIDE"` stamp), and the Tuesday interpreter desk. Days
open are derived.

### 3.4 `joinedDate` and `availability`

Each person's `joinedDate` is their squad's `formedDate`; `availability` is their `repSlot`. Neither
drives a displayed figure. Keep as built.

### 3.5 Nora's twelve-week strip

The strip renders exactly twelve completed weeks: **9 kept** for Thursdays 2025-12-18 → 2026-02-12,
**1 waived** 2026-02-19, **2 missed** 2026-02-26 and 2026-03-05. The current rep, 2026-03-12 at five
minutes, is `pending` and shown in the rep card — **not** counted as a thirteenth cell. This
reconciles with `KEEP_THE_CHAIN` (two consecutive misses → five-minute ask).

---

## 4. Corrections applied to the MVP spec

`PitchIn_MVP_build_spec.md` has been edited so canonical knowledge is consistent. Changed there:

- §2 locked decisions — visual system now records cork as canonical
- §4.1 expected-values table — qual count 16 → 17; note added on the paramedic derivation
- §6 — header note that cork supersedes the ops/warm split for working screens
- §7.2 — Town Capacity reads `17 QUALS IN CIRCULATION`
- §7.6 — Creek Side stat row corrected to derived 13 quals / 13 assets; the wrong "NO PUMP OPERATOR"
  coverage example replaced with the real derived gaps
- §7.7 — registry headline derivation changed to `emt-paramedic ∧ spanish-interpreter`
- §7.8 — the sharpened interpreter/paramedic capacity-gap line
- §8.3 — the two previously-unnamed toast strings
- §A.2 — EMT-Paramedic added; qual count 17
- §A.4 — Marisol Vega's quals; `joinedDate` / `availability` rule stated
- §A.12 — the twelve-week strip corrected to remove the double-counted week
- Appendix B Phase 4 — checkpoint corrected from "15" to "16 → 17"
- Annotation count corrected wherever "20" appeared

The MVP spec remains the authority on everything Increment 1 built. Where it and this document
disagree, **this document wins.**

---

## 5. Build order

Small enough for two phases.

| Phase | Work | Checkpoint |
|---|---|---|
| **1** | §2.1 EMT-Paramedic qual and all derived consequences | Board reads `17 QUALS IN CIRCULATION`; registry shows 17 quals with EMT-Paramedic tagged single-point-of-failure; `1 BILINGUAL PARAMEDIC` still derives to exactly 1; Kenosha Pass shows 13 distinct quals |
| **2** | §2.2 readiness gap line, §2.3 Vasquez policy line in both places | Copy matches this document character for character; The Wall is unchanged |

Commit at each phase boundary.

---

## 6. Acceptance checklist

- [ ] `npm run build` passes; no console errors on any route
- [ ] 17 quals in circulation, derived not hardcoded
- [ ] EMT-Paramedic appears in the registry with 1 holder and the single-point-of-failure tag
- [ ] `1 BILINGUAL PARAMEDIC` derives from `emt-paramedic ∧ spanish-interpreter` and still equals 1
- [ ] Marisol Vega shows four quals on `/squad/kenosha-pass`
- [ ] The readiness gap line reads exactly as §2.2
- [ ] The Park County policy line appears on the board's stalled flyer and on the Vasquez need detail — **and nowhere else**
- [ ] No squad `formedDate` or personal `streakWeeks` value was changed
- [ ] The ops console was **not** restored; cork remains on every screen
- [ ] Every other Increment 1 figure unchanged: show-rate 90.7%, median 19.5 wk, utilization 61%, Hansen flood 16 people / 26.75 person-hours, registry 4 / 9 / 12 / 1
- [ ] The Vasquez need is still stalled and unstaffed

---

## 7. Rules that still bind

`AGENTS.md` applies in full. Especially: transcribe seed verbatim, the stalled need stays stalled,
no guilting copy, no new dependencies, disagreements to `NOTES_FOR_NILS.md` rather than unilateral
changes — and **verify a flagged defect before acting on it.** Note 6 in this increment is the
worked example of why.
