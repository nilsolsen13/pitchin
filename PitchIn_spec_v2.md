# PitchIn — MVP Spec Authoring Plan

## Context

`PitchIn/PitchIn_spec_v1.md` is a **pitch narrative** for MUSTER — a civic readiness system built on
supply-chain doctrine (task decomposition, capability registry, readiness ratings, AARs) with a
deliberately thin reward layer (show-rate, squads, quals, standing). It is persuasive prose. It is
not buildable: it names no screens, no data model, no states, and no copy.

Nils needs a **class demo submission** — a hosted clickable prototype that shows what the product
would look like and how it would function. The idea matters more than the functionality. The
teacher reviews it asynchronously, without a live narration.

The actual deliverable of this session is therefore **not the prototype** — it is a spec document
precise enough that Cursor can build the entire thing without making design decisions. That
distinction drives everything below: for an AI-executed build, every unspecified string becomes a
decision made by autocomplete, and unspecified copy plus unspecified seed data is exactly what
makes a prototype read as a student project.

**Output:** `PitchIn/PitchIn_MVP_build_spec.md` — a single comprehensive document with a clearly
delineated seed-data appendix Cursor can be pointed at section by section.

## Locked decisions (from 20 scoping questions)

| Dimension | Decision |
|---|---|
| Product name | **PitchIn** — doctrine vocabulary retained inside (reps, squads, quals, surge, show-rate, AAR) |
| Deliverable | Spec doc → Cursor builds → static host (Vercel/Netlify) |
| Hero user | The **requester**: county, churches, schools, sports teams, neighbors |
| Local government | Customer + administrator (gets its own readiness dashboard) |
| Town | **South Park, Park County, Colorado** — TV reference played straight; easter eggs live in businesses and landmarks, never in resident names |
| Scenario | Mixed needs board, flood deep-dive |
| Screens | 8 product screens + landing |
| Data | Mock only. In-memory, resets on refresh. No backend, no auth, no API keys |
| Interactivity | Clickable with light state + explicit "Reset demo" control |
| Stack | Vite + React + TypeScript + Tailwind + react-router-dom |
| Viewport | Desktop-first, responsive enough not to break on mobile |
| Visual tone | **Operational core, warm wall** — ops console for working screens, letterpress community-board for the public wall |
| Framing | Landing page stating the thesis + annotations toggle, off by default |
| Spec depth | Maximum — literal copy, exact hex values, every seed record enumerated |

## Screen inventory

| # | Route | Screen | Aesthetic | Carries |
|---|---|---|---|---|
| 0 | `/` | Landing / thesis | Warm | The three failures (supply chain, loop closure, cadence); the show-rate claim; "Enter South Park" |
| 1 | `/board` | Needs board | Ops | Mixed needs incl. one visibly unstaffed; "Your rep this week" card |
| 2 | `/post` | Post a need | Ops | Free text → staged decomposition reveal → editable task list |
| 3 | `/need/hansen-flood` | Need detail | Ops | 11 tasks, staffing state, capability match, requester verification |
| 4 | `/me` | Resident / weekly rep | Ops | Rep card, streak, show-rate, quals, **shrinking ask** |
| 5 | `/squad/creek-side` | Squad detail | Ops | 4–8 neighbors, squad-held streak, coverage gaps |
| 6 | `/registry` | Capability registry | Ops | Search the town: 4 generators, 1 bilingual paramedic, 12 chainsaw-qualified |
| 7 | `/readiness` | Gov readiness dashboard | Ops | Show-rate, capacity utilization, time-to-met, surge readiness |
| 8 | `/wall` | The wall | **Warm** | Needs met this month, squads that met them, what's still open, published AARs |

## Demo timeline (design call — makes the prototype credible)

The town is frozen at a moment with three needs in three different states:

- **Closed with published AAR** — the church ramp. Gives the wall real content.
- **Mid-execution** — the Hansen flood. Gives need-detail live staffing, some tasks verified,
  some open, one blocked on a missing qual.
- **Unstaffed** — a driveway-plow request for an elderly resident, 6 days open, zero claims.

One visibly unmet need is what makes the other two believable. An all-green prototype reads as
fiction.

## Data model to specify

Ten entities. The two that matter most:

**`Commitment` — first-class, separate from `Task`.** `{id, personId, taskId, madeAt, dueAt,
outcome: pending | kept | missed | waived}`. Show-rate is `kept / (kept + missed)`; waived is
excluded. This exists because show-rate is a *schema* decision, not a feature — systems that model
only tasks structurally cannot report retention, which is why no volunteer program publishes it.

**`Task` state machine.** `open → claimed → in_progress → verified`, plus `missed`. Claiming
requires a matching qual where one is required. **Only the requester can move a task to
`verified`** — this is the anti-gaming claim made mechanical rather than asserted.

Remaining: `Person`, `Qual`, `Equipment`, `Org` (requester), `Need`, `Squad`, `AAR`, `Merchant`.

## Behaviors requiring explicit specification

1. **Staged decomposition reveal** (screen 2) — free text → ~1.5s parse animation → tasks appear
   sequentially with skill and materiel chips. Purely `setTimeout`-driven. This is the moment the
   product becomes legible; it must never depend on a network call.
2. **Shrinking ask** (screen 4) — miss one rep, next is auto-scoped smaller; miss two, a
   five-minute rep is offered. Three visual states, all reachable via a demo control.
3. **Squad-level visibility boundary** — individual show-rate visible to squadmates, town-level
   rankings squad-only. Must be visible in the UI or the anti-gaming argument stays a claim.
4. **Annotations toggle** — global context, default off, numbered callouts per screen.
5. **Reset demo** — restores seed state from a pure function so no viewer can strand themselves.

## Spec document structure

1. Product summary & thesis (compressed from v1)
2. Locked decisions table
3. Personas & permissions
4. Data model — full TypeScript interfaces, every field typed
5. State machines — task lifecycle, commitment lifecycle, rep/shrinking-ask
6. Design system — exact hex, type scale, spacing, both palettes (ops + warm), component
   primitives (StatusChip, QualBadge, StatCard, TaskRow, PersonCard)
7. Screen specs ×9 — layout, component tree, literal copy, empty/loading/error states
8. Interaction specs — the five behaviors above, with timings
9. File structure & routing, incl. SPA rewrite config for both hosts
10. **Appendix A: seed data** — every record, exhaustively:
    - ~24 residents (plausible Colorado names; quals, equipment, languages, availability, show-rate, streak)
    - All 11 flood tasks, named, with duration + skill + materiel requirements
    - 3 needs across 3 states; 4 squads; ~14 quals; equipment inventory; 1 published AAR
    - Requester orgs and merchants carrying the easter eggs — Tweek Bros. Coffeehouse, City Wok,
      Skeeter's, South Park Elementary, Park County Emergency Management, Stark's Pond
11. Appendix B: build order for Cursor, with a verifiable checkpoint per phase

## Critical files

- **Read:** `PitchIn/PitchIn_spec_v1.md` — source narrative; the thesis language on the landing
  page and the anti-gaming section should be preserved close to verbatim, since it is the
  strongest prose in the project.
- **Write:** `PitchIn/PitchIn_MVP_build_spec.md` — the deliverable.
- Not touching anything under `six-tango-app/` or its worktrees. Unrelated project.

## Verification

The spec is done when it passes these checks — the test is whether Cursor could build it with
zero clarifying questions:

1. **No placeholder survives.** Zero instances of "TBD", "e.g.", "etc.", "Task 1", or "Resident A".
   Grep the finished doc for these.
2. **Copy completeness.** Every heading, button label, empty-state string, and stat label appears
   as a literal quoted string.
3. **Seed completeness.** All 11 flood tasks named. Every resident has quals, equipment,
   availability, show-rate, streak. The registry claims in the spec ("four generators", "one
   bilingual paramedic") are actually satisfiable by counting the seed records.
4. **State coverage.** Every entity state in the machines is reachable in the seed data or via a
   documented demo control.
5. **Internal consistency.** Cross-check the numbers: the gov dashboard's town show-rate must be
   computable from the seeded commitments; squad streaks must match member data.
6. **Deploy correctness.** Spec contains the SPA rewrite config for both Vercel and Netlify, since
   client-side routing 404s on refresh without it and this is the most common way an otherwise
   finished prototype breaks in front of a grader.

Post-build verification (after Cursor runs): `npm run build` succeeds, all 9 routes render, the
decomposition animation completes, all three shrinking-ask states are reachable, reset restores
seed state, and a hard refresh on `/wall` does not 404 on the deployed host.
