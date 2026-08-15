# AGENTS.md — read this before writing any code

This repo builds **PitchIn**, a clickable prototype of a civic readiness platform, set in South
Park, Park County, Colorado.

**The specification is [`PitchIn_MVP_build_spec.md`](./PitchIn_MVP_build_spec.md). It is
authoritative.** Read it in full before your first edit. It contains the data model, three state
machines, both color palettes, nine screen specs with literal copy, and a fully enumerated seed
data appendix.

### The other two markdown files are NOT build targets

Three files in this repo have "spec" in the name. **Only one of them is buildable.** Do not be
misled by the version numbers — `v2` does not supersede `v1`, and neither supersedes the build spec.

| File | What it actually is | Build from it? |
|---|---|---|
| `PitchIn_MVP_build_spec.md` | The specification. Screens, data, copy, seed. | **Yes — this one.** |
| `PitchIn_spec_v1.md` | Original pitch narrative. Read for tone and vocabulary. Describes no screens. | No |
| `PitchIn_spec_v2.md` | Planning notes recording *how* the build spec was scoped. Despite the filename it is **not a spec**, and some of its details (notably the stack row) are stale. | **No — and prefer the build spec wherever they disagree.** |

---

## The five rules that matter most

Everything below is a thing an agent optimizing for a "nice demo" will be tempted to do, and each
one destroys something load-bearing.

### 1. Transcribe Appendix A verbatim. Never regenerate seed data.

The 24 residents, 31 equipment items, 16 quals, 6 needs, and 11 flood tasks are not examples. They
are the data. Every dashboard figure in the app is *derived* from them and has been verified to
reconcile:

| Quantity | Must display as |
|---|---|
| Town show-rate | 90.7% (915 kept / 94 missed) |
| Median unbroken participation | 19.5 weeks |
| Squad show-rates | 90.3 / 91.8 / 92.0 / 87.7 |
| Registry headline | 4 generators · 9 tow trucks · 12 chainsaw-qualified · 1 bilingual paramedic |
| Equipment utilization | 61% (19 of 31) |
| Hansen flood | 16 people committed · 26.75 person-hours · 3 of 11 verified · 1 blocked |
| Duthie ramp | 9 residents · 13 commitments (12 kept, 1 waived) · 29.0 person-hours |

If your build shows different numbers, **the transcription is wrong — fix the seed, never the
displayed number.** Do not hardcode a figure to make a screen look right.

### 2. The stalled need stays stalled.

Eleanor Vasquez's driveway (`need-vasquez-plow`) has been open six days with zero claims, because
both plow-equipped trucks are registered to Kenosha Pass, 22 minutes away. **Do not staff it. Do
not soften the copy. Do not auto-resolve it.**

An all-green board reads as fiction. This one visibly unmet need is what makes the other five
believable, and its diagnosis — a supply failure, not an apathy problem — is the product's central
argument made concrete.

### 3. Enforce the permission rules in the UI, not just in comments.

Three rules are the anti-gaming argument. If they aren't visibly enforced, the argument is a claim:

- **Only the requester who owns a need can verify its tasks.** Other roles see `Verify` disabled
  with the tooltip `"Only the requester can verify a task."`
- **Individual show-rates never appear on `/wall` or `/readiness`.** Rankings there are
  squad-level only. Individual rates appear on `/squad/:id` because you are a squadmate.
- **One rep per week.** No "take another rep" control exists anywhere.

### 4. Never write guilting copy for the shrinking ask.

When a member misses reps, the system *shrinks the ask* — it does not shame, guilt, count down, or
warn. §7.5 of the spec gives the exact approved copy for all three states. Use those strings
exactly. Do not write alternatives, do not add streak-loss warnings, do not add urgency.

This is the most original mechanic in the product and the easiest to ruin with one line of
default-habit-app copy.

### 5. Keep the South Park rule.

The town is the *South Park* of the TV show, **played completely straight**.

- Businesses and landmarks carry the reference: Tweek Bros. Coffeehouse, City Wok, Skeeter's,
  Stark's Pond, South Park Elementary, Hell's Pass Hospital, the South Park Cows.
- **Residents never do.** Every resident is an invented, plausible Colorado name. No character
  from the show appears. No jokes anywhere in resident-facing copy.

**If a copy choice would get a laugh, cut it.** The argument only works if the town is earnest.

---

## Build constraints

**Do not build:** authentication · a database · localStorage or any persistence · API routes or
serverless functions · real LLM calls · a chart library · a component library (shadcn, MUI,
Chakra, Ant) · an animation library · tests · i18n · image assets.

State is in-memory React context. Refresh resets to seed. **This is intended, not a bug** — do not
"fix" it by adding persistence.

The decomposition animation on `/post` is `setTimeout`-driven with no network call. Do not wire it
to an API. It must never be able to fail live.

### Pinned dependencies — do not upgrade

- **Tailwind v3** (`^3.4.19`) with `tailwind.config.ts`. The spec's design tokens are written
  against v3's config file. **Do not migrate to v4's CSS-first `@theme` syntax** — v4 is newer, but
  the whole spec assumes v3 and a migration mid-build costs more than it returns.
- **React 19** + **react-router-dom v7** — already installed and working. Use v7's declarative API
  (`<BrowserRouter><Routes><Route>`), which is the same shape as v6. Do not adopt data routers,
  loaders, or actions; there is no data layer to load from.
- **Vite 8**, **TypeScript 6**.

The lockfile is committed and the scaffold builds clean. **Do not run upgrades, do not change
major versions, and do not swap the build tool.** If something seems to need a newer package, it
almost certainly doesn't.

Adding a dependency not already in `package.json` requires a strong reason. Default to writing the
20 lines yourself. The 12-week participation chart on `/readiness` is deliberately hand-rolled with
divs — do not install a charting library for it.

### Two palettes, not a theme toggle

Ops (dark) for working screens, Warm (light) for `/` and `/wall`. They are **not** light/dark modes
of each other. **Do not add a theme switcher.** Both palettes are always present; which one applies
is a property of the screen.

---

## Working method

Follow **Appendix B** of the spec. It defines ten phases, each with a verifiable checkpoint. Do not
skip ahead — Phase 1's checkpoint (printing the derived stats and confirming they match the table
above) catches a bad seed transcription before it contaminates nine screens.

Commit at each phase boundary with the phase name in the message.

Before claiming any phase is done, actually run the check. `npm run build` must pass. If a
checkpoint fails, fix it before continuing rather than noting it and moving on.

### Definition of done

**Appendix C** of the spec is the acceptance checklist. Every box must be genuinely verified, not
assumed. The last one matters more than it looks:

> Hard refresh directly on `/wall` and `/need/hansen-flood` must return the page, not a 404.

Client-side routing 404s on refresh without a rewrite rule. `vercel.json` and `netlify.toml` are
both in the repo for this reason. It is the most common way an otherwise finished prototype breaks
in front of a reviewer.

---

## Context

This is a class demo submission, reviewed asynchronously by an instructor who will not have anyone
narrating it. It will be deployed as a static site. **The idea matters more than the
functionality** — which is precisely why the copy, the seed data density, and the visible
capacity gaps are the parts to get right, and why a working backend would add nothing.
