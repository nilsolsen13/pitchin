// Annotation copy (spec §8.2 + Increment 2), keyed by {route}:{n}. Verbatim.
// 18 from Increment 1, calendar:1–3 (notes 19–21), wall:3 (note 22) in Phase 8.

export const annotations: Record<string, string> = {
  // §7.2 Board (3)
  'board:1':
    "Unstaffed needs are diagnosed, not scolded. The registry knows exactly why this one hasn't moved: the equipment exists, it's just on the wrong side of the basin. That's a supply failure, not an apathy problem.",
  'board:2':
    'Sustainment is the weekly rep. Surge is the flood, the fire, the funeral. The whole point of drilling weekly is that when a surge comes, the town already knows who has a truck and who answers their phone.',
  'board:3':
    'One rep. Twenty minutes. Fixed time, named partner. Nothing to decide and nothing to organize — the two places civic commitment usually dies.',

  // §7.3 Post a Need (2)
  'post:1':
    "Turning free-text need into structured, staffable tasks is the one genuinely hard technical problem here. Every task carries time, skill, and materiel requirements, because a task nobody is qualified to do isn't a task — it's a wish.",
  'post:2':
    "'Help the Hansens after the flood' becomes eleven tasks, three of which need a truck and one of which needs someone who can operate a pump. That's the difference between a group text and a supply chain.",

  // §7.4 Need Detail (3)
  'need:1':
    'The original words are kept verbatim and shown next to the structured version. Nobody has to trust that the decomposition was faithful — they can check.',
  'need:2':
    'Tasks are verified by the requester, not self-reported. This is the single most important anti-gaming defense in the system, and it costs nothing to enforce.',
  'need:3':
    "A blocked task is inventory intelligence. It tells the town what it doesn't own yet — and it goes on the quarterly task menu that members with standing get to vote on.",

  // §7.5 My Rep (3)
  'me:1':
    "Miss a week and it doesn't guilt you — it shrinks the ask. Miss two and it offers five minutes to keep the chain alive. Every habit system in fitness knows this. No civic system does it.",
  'me:2':
    "Twenty minutes a week for two years beats forty hours once. This number is the whole thesis, and it's why 'commitment' is a first-class record in the data model rather than a side effect of finishing a task.",
  'me:3':
    'Streaks are held by the squad, not the individual. The person having a hard month gets carried instead of shamed, and the social pressure is the good kind — people you know are counting on you.',

  // §7.6 Squad (1)
  'squad:1':
    "Four to eight neighbors. Small enough that you know everyone, large enough to absorb a bad month. The squad is the unit of accountability precisely so the individual isn't.",

  // §7.7 Registry (2)
  'registry:1':
    "Three trash pumps in town and one person qualified to run one. The registry doesn't just find capacity — it finds the places where the town is one person's bad week away from being unable to respond.",
  'registry:2':
    'Percent of registered capacity actually used is a metric no volunteer program tracks, because most of them don\u2019t know what they have.',

  // §7.8 Readiness (2)
  'readiness:1':
    "Retention at 6 and 12 months is the number no volunteer program publishes. It's the only one that predicts whether a town can respond next year.",
  'readiness:2':
    'This is what a government actually buys. Not a volunteer list — a readiness picture, with the gaps named specifically enough to fix with a purchase order.',

  // §7.9 The Wall (2)
  'wall:1':
    'Every completed need gets a short public after-action report. Effort becomes visible and legible, which is what actually produces the next turnout. Most volunteer software has no concept of an outcome at all.',
  'wall:2':
    "An honest AAR names what went wrong. This one says the town bought lumber it already owned — which is exactly the failure the registry exists to prevent, admitted in public.",

  // Increment 2 §2.4 Calendar (3) — notes 19–21
  'calendar:1':
    "A civic system that doesn't appear in your actual calendar is asking you to remember it. Twenty minutes a week survives only if it lives where the rest of your week lives.",
  'calendar:2':
    "You are shown what you're qualified for, not everything that's open. That is the registry doing its job in the other direction — matching capability to need instead of broadcasting to everyone and hoping.",
  'calendar:3':
    "Your record is commitments, not hours. Nine kept weeks and two missed ones is a truer picture of whether a town can count on you than any total ever printed on a volunteer certificate.",

  // Increment 2 §3.6 The Wall (note 22) — wired with the photo in Phase 8
  'wall:3':
    "Photographing the damage is task ten on the flood job — it is work somebody signed up for, not decoration. That is why the record has pictures in it at all: the system asked someone to take them, and it knows who.",

  // Final spec Part B — annotation 23
  'wall:4':
    "The people who most need help are the least likely to use software, so somebody else has to be able to ask on their behalf. That creates a problem — a vulnerable neighbour's name on a public board — and the answer is the same boundary the rest of the system uses: squads see who, the town sees roughly where, and the name is public only if she says so.",
};
