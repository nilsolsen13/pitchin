# Appendix C — acceptance report

Every box verified by actually running the built app (dev server + production `vite preview`) and
inspecting it in a browser. Nothing is marked complete that was not verified.

| # | Acceptance criterion | Result | Evidence |
|---|---|---|---|
| 1 | All 9 routes render; no console errors | **PASS** | All of `/`, `/board`, `/post`, `/need/:id`, `/me`, `/squad/:id`, `/registry`, `/readiness`, `/wall` render; 0 red console errors observed across every route. |
| 2 | Town show-rate reads 90.7% and reconciles with 915/94 | **PASS** | Phase 1 checkpoint + status bar + Readiness all show 90.7% derived from 915 kept / 94 missed. |
| 3 | Every number in the §4.1 table matches the built app | **PASS** | Phase 1 checkpoint printed all 30 derived values green (PASS) against the table. |
| 4 | Registry headline reads 4 / 9 / 12 / 1 | **PASS** | Registry headline: 4 generators, 9 tow-capable trucks, 12 chainsaw-qualified, 1 bilingual paramedic (all derived). |
| 5 | Equipment utilization reads 61% (19 of 31) | **PASS** | Registry utilization panel and Readiness card both read 61% (19 of 31), computed with a 90-day cutoff. |
| 6 | Need detail reads 16 people committed / 26.75 person-hours | **PASS** | `/need/hansen-flood` stat strip: PEOPLE COMMITTED 16, PERSON-HOURS 26.75 (both derived from task assignees). |
| 7 | The Wall reads 13 commitments, 12 kept, 1 waived — AAR names the waiver | **PASS** | Wall "MET THIS MONTH" line reads 9 residents · 13 commitments · 12 kept, 1 waived; AAR "WHAT IT TOOK" names Duke Hollinger's waiver. |
| 8 | All 11 flood tasks present & named; 3 require a truck; 1 a pump operator; 1 blocked | **PASS** | All 11 named tasks render; decomposition + need detail confirm 3 truck / 1 pump / 1 blocked. |
| 9 | Eleanor Vasquez's need visibly stalled with capacity-gap diagnosis on the board | **PASS** | Board shows the red-bordered stalled card with the §7.2 diagnosis; it is not staffed. |
| 10 | `Verify` disabled for non-requester roles with the exact tooltip | **PASS** | As resident/admin, in-progress tasks show a disabled Verify with tooltip "Only the requester can verify a task." |
| 11 | No individual show-rate on `/wall` or `/readiness` | **PASS** | Both screens show squad-level rankings only; scanned, no individual rates present. |
| 12 | All three shrinking-ask states reachable, with exact prescribed copy | **PASS** | `/me` DEMO control reaches STANDARD / SCOPED_DOWN / KEEP_THE_CHAIN with the §7.5 copy verbatim; "Can't this week" → waived card + toast. |
| 13 | The AAR's "what we'd do differently" appears verbatim | **PASS** | Wall AAR block matches A.10 text, including "We bought lumber we already owned." |
| 14 | Annotations off by default; all present when toggled on | **PASS** (18) | Off by default; toggling on shows all 18 specified markers (Board 3, Post 2, Need 3, My Rep 3, Squad 1, Registry 2, Readiness 2, Wall 2). The spec's "20" is 18 in practice — see NOTES_FOR_NILS.md #2. |
| 15 | Reset restores seed state from every screen | **PASS** | Verified Reset from `/readiness` and `/registry`: returns to `/board`, role → resident, annotations off, rep → KEEP_THE_CHAIN, toast "DEMO RESET". |
| 16 | No lorem ipsum, no "Task 1", no placeholder names anywhere | **PASS** | All copy and names are from Appendix A; no placeholders. |
| 17 | Hard refresh on a deep route does not 404 on the deployed host | **FAILED (not deployable here)** | No Netlify/Vercel credentials are available in this environment, so the app could not be deployed and the *deployed-host* check cannot be verified. The mechanism is in place and verified locally: `vercel.json` and `netlify.toml` SPA rewrites are committed; production `vite preview` returns HTTP 200 for `/wall`, `/need/hansen-flood`, `/registry`, `/readiness`, `/squad/creek-side`; and a hard refresh on `/need/hansen-flood` and `/wall` renders the correct page (no 404, no "Need not found"). |

## Summary

16 of 17 boxes pass. The only failure is #17, and only because deployment credentials are not
available in this environment — the SPA-rewrite configuration and client-side deep-route resolution
are correct and verified locally. To close it, deploy the committed `dist/` (or connect the repo)
to Netlify or Vercel and hard-refresh `/wall` and `/need/hansen-flood` on the live URL.
