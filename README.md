# PitchIn

A readiness system for local service — clickable prototype.

> Turns a town's unmet needs into taskable units, matches them to the capabilities its residents
> actually have, and rewards the one thing civic life never measures: showing up when you said you
> would, week after week.

Set in **South Park, Park County, Colorado**. Pop. 4,187. Frozen at Thursday, 12 March 2026.

---

## Read these in order

| File | What it is |
|---|---|
| **[`AGENTS.md`](./AGENTS.md)** | **Start here if you are an AI agent.** Constraints, pinned deps, and the five rules that must not be broken. |
| [`PitchIn_MVP_build_spec.md`](./PitchIn_MVP_build_spec.md) | The authoritative build spec. Data model, state machines, design system, nine screen specs with literal copy, full seed data, ten-phase build order, acceptance checklist. |
| [`PitchIn_logo_spec.md`](./PitchIn_logo_spec.md) | Mark + wordmark brief. Draw from this; do not copy `logo-mockups/`. Does not supersede the build spec. |
| [`PitchIn_spec_v1.md`](./PitchIn_spec_v1.md) | The original pitch narrative. Read for tone and vocabulary — it describes no screens, so do not build from it. |
| [`PitchIn_spec_v2.md`](./PitchIn_spec_v2.md) | Planning notes on how the build spec was scoped. **Not a spec despite the filename**, and partly stale — the build spec wins wherever they disagree. |

> **Note on the filenames:** `v2` does not supersede `v1`, and neither supersedes the build spec.
> `PitchIn_MVP_build_spec.md` is the product spec. `PitchIn_logo_spec.md` is the mark brief only.

## Run it

```bash
npm install
npm run dev
```

Build: `npm run build` · Preview the build: `npm run preview`

## What this is

A **prototype**, not an application. Mock data only — no backend, no auth, no database, no
persistence, no network calls. State lives in React context and resets on refresh, deliberately.

It is a class demo submission, reviewed asynchronously without anyone narrating it. The idea
matters more than the functionality, which is why the copy, the seed-data density, and the visible
capacity gaps are the parts that have to be right.

## Screens

| Route | Screen | Palette |
|---|---|---|
| `/` | Landing — the thesis | Warm |
| `/board` | Needs board | Ops |
| `/post` | Post a need + decomposition | Ops |
| `/need/:id` | Need detail | Ops |
| `/me` | Weekly rep | Ops |
| `/squad/:id` | Squad detail | Ops |
| `/registry` | Capability registry | Ops |
| `/readiness` | Government readiness dashboard | Ops |
| `/wall` | The public wall + AAR | Warm |

## Numbers that must reconcile

Every figure in the app derives from the seed data in Appendix A of the spec. These are verified —
if a build shows anything different, the seed transcription is wrong:

- Town show-rate **90.7%** (915 kept / 94 missed) · median unbroken participation **19.5 weeks**
- Registry: **4** generators · **9** tow trucks · **12** chainsaw-qualified · **1** bilingual paramedic
- Equipment utilization **61%** (19 of 31)
- Hansen flood: **16** people committed · **26.75** person-hours · 3 of 11 verified · 1 blocked

## Deploy

Static build, zero config on either host. The SPA rewrite in `vercel.json` / `netlify.toml` is
required — without it, a hard refresh on a deep route 404s.

```bash
npm run build   # → dist/
```
