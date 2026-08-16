// Direct-message seed for the right-rail chat. Not Appendix A — do not mix
// these into people/needs/tasks. Copy stays earnest and does not staff the
// Vasquez driveway (need-vasquez-plow stays stalled).

import type { ChatMessage, ChatThread } from '../types';
import { ACTOR_ADMIN, ACTOR_EM } from '../lib/actors';

function dm(
  a: string,
  b: string,
): ChatThread {
  const [left, right] = [a, b].sort();
  return { id: `dm-${left}-${right}`, participantIds: [a, b] };
}

function msg(
  id: string,
  thread: ChatThread,
  fromId: string,
  sentAt: string,
  body: string,
  unreadFor: string | null,
): ChatMessage {
  const participants = thread.participantIds;
  const readBy = unreadFor
    ? participants.filter((pid) => pid !== unreadFor)
    : [...participants];
  return { id, threadId: thread.id, fromId, body, sentAt, readBy };
}

const tSparks = dm('p-beckett', 'p-sparks');
const tFerrin = dm('p-beckett', 'p-ferrin');
const tVasquez = dm('p-beckett', 'p-vasquez');
const tEmNora = dm(ACTOR_EM, 'p-beckett');
const tEmVega = dm(ACTOR_EM, 'p-vega');
const tEmFerrin = dm(ACTOR_EM, 'p-ferrin');
const tAdminWhitlock = dm(ACTOR_ADMIN, 'p-whitlock');
const tAdminTanaka = dm(ACTOR_ADMIN, 'p-tanaka');

export const seedThreads: ChatThread[] = [
  tSparks,
  tFerrin,
  tVasquez,
  tEmNora,
  tEmVega,
  tEmFerrin,
  tAdminWhitlock,
  tAdminTanaka,
];

export const seedMessages: ChatMessage[] = [
  // Nora · Junie Sparks — weekly rep partners. Current ask is KEEP_THE_CHAIN.
  msg('m-01', tSparks, 'p-sparks', '2026-03-11T17:40:00-07:00', 'Thursday still work? I can do the 6:00 slot at the church lot.', null),
  msg('m-02', tSparks, 'p-beckett', '2026-03-11T17:52:00-07:00', "Yes. I'll be there. Same twenty minutes.", null),
  msg('m-03', tSparks, 'p-sparks', '2026-03-11T18:04:00-07:00', "I'll bring the sign-in sheet from last week.", 'p-beckett'),

  // Nora · Ray Ferrin — flood coordination, already on the board.
  msg('m-04', tFerrin, 'p-ferrin', '2026-03-10T09:15:00-07:00', "Basement's drawn down. Fans are on Tanaka's generator until power's back.", null),
  msg('m-05', tFerrin, 'p-beckett', '2026-03-10T09:28:00-07:00', 'Creek Side has four on sandbags Monday. Tell me if the bank starts cutting again.', null),
  msg('m-06', tFerrin, 'p-ferrin', '2026-03-10T09:31:00-07:00', "Will do. Culvert's holding for now.", null),

  // Nora · Hank Vasquez — the stalled driveway. Diagnosis only; nobody claims it.
  msg('m-07', tVasquez, 'p-vasquez', '2026-03-12T07:18:00-07:00', "Aunt Eleanor's drive drifted in again. County won't do private. I don't have a plow on the truck.", null),
  msg('m-08', tVasquez, 'p-beckett', '2026-03-12T07:26:00-07:00', 'Registry shows both plow trucks on Kenosha Pass — Tanaka and Grange. Twenty-two minutes from Tarryall.', null),
  msg('m-09', tVasquez, 'p-vasquez', '2026-03-12T07:29:00-07:00', "That's the gap then. I'll leave it on the board.", 'p-beckett'),

  // Park County EM · Nora — school chaperone already claimed.
  msg('m-10', tEmNora, ACTOR_EM, '2026-03-11T14:02:00-07:00', 'Field trip chaperone on April 16 is claimed. Thank you.', null),
  msg('m-11', tEmNora, 'p-beckett', '2026-03-11T14:10:00-07:00', 'Confirmed. Child-cleared is current.', null),

  // Park County EM · Marisol Vega — interpreter desk.
  msg('m-12', tEmVega, ACTOR_EM, '2026-03-10T16:40:00-07:00', 'Tuesday desk still covered?', null),
  msg('m-13', tEmVega, 'p-vega', '2026-03-10T16:47:00-07:00', 'Yes. Benefits enrollment, 9 to noon.', ACTOR_EM),

  // Park County EM · Ray Ferrin — Hansen flood status.
  msg('m-14', tEmFerrin, ACTOR_EM, '2026-03-11T08:05:00-07:00', 'Hansen basement — pump verified. Need a status on the culvert bags.', null),
  msg('m-15', tEmFerrin, 'p-ferrin', '2026-03-11T08:12:00-07:00', "Holding. Six on the bank Monday. I'll flag if runoff picks up.", ACTOR_EM),

  // Admin · Dana Whitlock — registry, not a ranking.
  msg('m-16', tAdminWhitlock, ACTOR_ADMIN, '2026-03-09T11:20:00-07:00', 'Equipment check: your F-250 last used March 10. Still the 12,000 lb rating?', null),
  msg('m-17', tAdminWhitlock, 'p-whitlock', '2026-03-09T11:33:00-07:00', 'Yes. Available Thursdays and Saturday mornings.', ACTOR_ADMIN),

  // Admin · Bud Tanaka — capacity gap stays open. Do not staff the plow need.
  msg('m-18', tAdminTanaka, ACTOR_ADMIN, '2026-03-12T08:40:00-07:00', 'Vasquez driveway is six days open. Both plows are registered to Kenosha Pass.', null),
  msg('m-19', tAdminTanaka, 'p-tanaka', '2026-03-12T08:48:00-07:00', "We're 22 minutes out. I can run it if the county wants to wait on travel, but I won't claim it from here and miss a window.", null),
  msg('m-20', tAdminTanaka, ACTOR_ADMIN, '2026-03-12T08:51:00-07:00', 'Leave it stalled. The gap is the point until we have a plow on Tarryall.', null),
];
