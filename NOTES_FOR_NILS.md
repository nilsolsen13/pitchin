# Notes for Nils

Places where the spec disagrees with itself, with the seed, or with a choice I made.
I built to the increment docs and did not paper over gaps. Public-records sourcing
is closed: the demo stays fully synthetic.

## Closed by Increment 3 (ratified or corrected — do not "fix" back)

1. Board checkpoint 15 vs derived 16 → 17 — spec error, corrected in the MVP spec.
2. "20 annotations" vs 18 enumerated — spec error. Count is 22 after Increments 2–3.
3. `joinedDate` / `availability` missing from A.4 — defaults ratified (squad formedDate / repSlot).
4. Nora's 12-week strip double-count — agent's 9+1+2 resolution ratified.
5. Creek Side 11/6 vs derived 13/13 — spec error, corrected. Coverage is derived.
6. **Not a defect.** See below.
7. Bilingual paramedic had no paramedic qual — **fixed** in Increment 3 Phase 1 (`emt-paramedic`).
8. Toast strings — `"REP ACCEPTED"` / `"TASK VERIFIED"` ratified.
9. Wall STILL OPEN entries — Hansen, Vasquez, interpreter desk, ratified.
10. Cork vs ops console — cork is canonical. Do not restore the ops console.

### Note 6 rechecked (do not rewrite squad ages)

Creek Side `formedDate` 2024-06-14 to demo date 2026-03-12 is **90 weeks**, not ~39.
A year was dropped in the earlier arithmetic. Recomputed against every squad:

| Squad | Formed | Age at 2026-03-12 | Longest member streak | Fits |
|---|---|---|---|---|
| Creek Side | 2024-06-14 | 90 wk | Ray Ferrin, 46 wk | Yes |
| Kenosha Pass | 2024-03-08 | 104 wk | Marisol Vega, 41 wk | Yes |
| Red Hill | 2024-01-19 | 111 wk | Duke Hollinger, 52 wk | Yes |
| Tarryall | 2025-04-11 | 47 wk | Hank Vasquez, 29 wk | Yes |

No `formedDate` or `streakWeeks` value was changed.

## Chat drawer (Note 11, reopened then closed)

Increment 2 §1.5 deletes the messages rail. The Increment 3 spec commit restored it
(old note 11: you asked). This build removed it again, per Increment 2 and the
explicit instruction not to delete `src/lib/actors.ts`. `actorForRole` still feeds
AppShell and ProfileMenu. If you want the drawer back, that is a product call that
disagrees with Increment 2 on purpose.

## New notes from Increments 2–3

### 12. Landing index also switches role for Calendar and My Rep

Increment 2 §1.3 only names `POST A NEED` (requester) and `READINESS` (admin).
`/calendar` and `/me` are also resident-gated. The Phase 4 landing already attached
`role: 'resident'` to those two links so a County grader clicking the index does
not bounce to `/board`. I left that in. Spec-strict reading would only switch the
two named entries.

### 13. Post annotations are not on the compose stage

`post:1` mounts when `stage !== 'compose'`; `post:2` mounts on the summary. That is
Increment 1 behavior. Phase 7's "all 21 annotations open" is **20 at rest**; the two
Post notes appear after Decompose. I did not move them onto the empty form.

### 14. Claimed tasks always log 20 minutes

`CLAIM_TASK` in `DemoState` hardcodes `scopeMinutes: 20`. Claiming a chaperone slot
(300 min) or the Vasquez meter (20 min) from the calendar therefore writes 20 either
way. Pre-existing. I did not change it. The calendar duration column for *seeded*
commitments is still the task's real duration.

### 15. Increment 4 spec arrived mid-build and was not implemented

While Increment 2/3 were in progress, `PitchIn_increment_4_recognition_and_proxy.md`
landed on `main`, and two commits described a county map and removing the requester
role. I did not build Increment 4. The three-role switcher and `/post` requester gate
are still Increment 2. Some Increment 2 calendar files were committed under Increment 4
messages by a parallel agent — the code is in the tree; the git history for Phase 6
is messy.

### 16. `sessionStorage` annotations key is written only on toggle

§1.4 says write on every `setRole` / `toggleAnnotations`. Role is written on
`setRole`; annotations are written on `toggleAnnotations`. After switching to County
without touching the switch, `pitchin.annotations` is unset and hydrates to the
default `true`. The checklist (County + refresh, annotations still on) passes.
A stricter reading would persist the current annotations flag on role change too.
