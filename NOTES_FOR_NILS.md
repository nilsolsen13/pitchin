# Notes for Nils

Places where the build spec disagrees with itself or with the seed. In every case I built to
the spec's data / derivation rules and did **not** alter the product to paper over the gap. These
are yours to decide later.

### 1. Board checkpoint "people committed → 15" vs seed's 16

Appendix B's Phase 4 checkpoint says claiming task 10 as Nora increments "people committed" to
**15**. The seed (Appendix A.8) has **16** distinct assignees across the Hansen tasks before any
claim, and §7.4 defines `PEOPLE COMMITTED` as distinct assignees. So the derived value starts at
16 and the claim yields **17**, not 15. I trusted the derivation (16 → 17) and left the seed
intact. The "15" in the checkpoint looks like a stale number written before the seed was finalized.

### 2. "20 annotations" vs 18 actually specified

Phase 9 / §8.2 refer to "all 20 annotations," but §7.2–§7.9 enumerate only **18** (Board 3, Post 2,
Need 3, My Rep 3, Squad 1, Registry 2, Readiness 2, Wall 2). The landing page specifies none. I
wired exactly the 18 that exist and did **not** invent two extra landing notes to force the count
to 20.

### 3. `joinedDate` / `availability` are missing from A.4

The `Person` type requires `joinedDate` and `availability`, but the A.4 people table supplies
neither. I set each person's `joinedDate` to their squad's `formedDate` and `availability` to their
`repSlot`. Neither field drives a displayed dashboard figure. Swap in real values if you have them.

### 4. Nora's 12-week strip: kept range overlaps the waived week

A.12 lists "kept ×9 (weeks ending 2025-12-25 through 2026-02-19)" **and** "waived ×1 (2026-02-19)"
— 2026-02-19 is double-counted, and 9+1+2+1 = 13 cells for a 12-week strip. I resolved it per the
build instruction: 9 kept for the Thursdays **2025-12-18 → 2026-02-12**, waived 2026-02-19, missed
2026-02-26 and 2026-03-05 (the last two red cells), and a **pending** current rep 2026-03-12 at 5
minutes shown in the rep card (not counted in the 12 completed cells). The strip therefore renders
exactly 12 completed weeks and reconciles with KEEP_THE_CHAIN (two consecutive misses → 5-min ask).

### 5. §7.6 Creek Side "QUALS HELD 11 / ASSETS 6" vs derived 13 / 13

§7.6's stat row hardcodes 11 quals / 6 assets for Creek Side. Derived from the seed, Creek Side
holds **13** distinct quals and its members own **13** registered assets. Per the "derive, never
hardcode" rule I display the derived **13 / 13**. Relatedly, §7.6's coverage example lists
"NO PUMP OPERATOR" — but Creek Side *has* the town's only pump operator (Ray Ferrin), so that
example is wrong for this squad. Coverage gaps are computed: Creek Side shows NO SPANISH
INTERPRETER / NO WILDERNESS FIRST RESPONDER / NO SNOW REMOVAL — PLOW.

### 6. Ray Ferrin's 46-week streak predates Creek Side's founding

Ray Ferrin (`p-ferrin`) has `streakWeeks: 46` but Creek Side's `formedDate` is 2024-06-14, which is
only ~39 weeks before the 2026-03-12 demo date. Several personal streaks exceed their squad's age
(Duke Hollinger's 52 vs Red Hill's ~60 is fine; Creek Side's are the tight ones). I transcribed the
seed values verbatim and did not adjust them; personal streaks presumably carry over from before a
squad formally organized.

### 7. "Bilingual paramedic" is really WFR + Spanish interpreter

The registry headline "1 BILINGUAL PARAMEDIC" has no `paramedic` qual behind it. I derived it as
holders of **both** `wfr` and `spanish-interpreter` — Marisol Vega, exactly 1 — which matches the
intended figure and her A.4 note ("the bilingual paramedic").

### 8. Accept-rep and verify-task toasts are unnamed in the spec

§8.3 lists toasts for commitment-logged, rep-waived, and demo-reset, and gives their exact strings,
but not for accepting a rep ("I'm on it") or verifying a task. I used the shortest neutral,
non-guilting strings consistent with the house style: **"REP ACCEPTED"** and **"TASK VERIFIED"**.

### 9. The Wall's "STILL OPEN" entries aren't enumerated

§7.9 says STILL OPEN shows "three entries" and only prescribes the Vasquez line verbatim. I chose
the three most legible open needs: the Hansen flood, the Vasquez driveway (with its exact
"6 DAYS · NEEDS A PLOW TRUCK ON THE TARRYALL SIDE" stamp), and the Tuesday interpreter desk. Days
open are derived.
