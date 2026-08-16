// Temporary Phase 5 checkpoint. Not imported by the app. Delete after the print.
import { commitments, equipment, needs, people, tasks } from './data/seed';
import { historyFor, opportunitiesFor, upcomingFor } from './lib/derive';

const id = 'p-beckett';
const upcoming = upcomingFor(id, commitments, tasks, needs, people);
const history = historyFor(id, commitments, tasks, needs, people);
const opps = opportunitiesFor(id, tasks, needs, people, equipment);

console.log('UPCOMING', upcoming.map((e) => `${e.date} · ${e.kind} · ${e.title} · ${e.id}`));
console.log('HISTORY', history.map((e) => `${e.date} · ${e.outcome} · ${e.title}`));
console.log('OPPORTUNITIES', opps.map((e) => `${e.date ?? 'null'} · ${e.id} · ${e.title}`));
console.log('OPP IDS', opps.map((e) => e.id));

const must = ['t-flood-10', 't-chap-05', 't-chap-06', 't-cows-03', 't-cows-04', 't-cows-05', 't-cows-06', 't-plow-02'];
const mustNot = ['t-flood-05', 't-flood-11', 't-plow-01'];
const ids = new Set(opps.map((e) => e.id));
const missing = must.filter((x) => !ids.has(x));
const extra = mustNot.filter((x) => ids.has(x));
console.log('MISSING (should be empty)', missing);
console.log('FORBIDDEN PRESENT (should be empty)', extra);
console.log('COUNT', opps.length, 'expected 8');
