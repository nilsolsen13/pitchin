// County map geography and findings (final spec Part C).
// Coordinates are schematic. Findings are derived from seed, never hardcoded.

import type { Need, Person, Qual, QualId, Squad, Task } from '../types';
import { tasksForNeed, tasksVerified } from './derive';

export type MapPoint = { x: number; y: number };

export function parsePath(d: string): MapPoint[] {
  const pts: MapPoint[] = [];
  const re = /[ML]\s*([\d.]+)\s*,\s*([\d.]+)/gi;
  let match = re.exec(d);
  while (match) {
    pts.push({ x: Number(match[1]), y: Number(match[2]) });
    match = re.exec(d);
  }
  return pts;
}

export function pointInPolygon(p: MapPoint, d: string): boolean {
  const pts = parsePath(d);
  if (pts.length < 3) return false;
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i].x;
    const yi = pts[i].y;
    const xj = pts[j].x;
    const yj = pts[j].y;
    const intersect = yi > p.y !== yj > p.y && p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function squadContaining(point: MapPoint, squads: Squad[]): Squad | null {
  const hit = squads.find((s) => pointInPolygon(point, s.territory.path));
  if (hit) return hit;
  // Gaps between polygons: nearest centroid, so a pin in the gutter still belongs somewhere.
  let best: Squad | null = null;
  let bestD = Infinity;
  for (const s of squads) {
    const dx = point.x - s.territory.cx;
    const dy = point.y - s.territory.cy;
    const d = dx * dx + dy * dy;
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return best;
}

export function holdersOfQual(qualId: QualId, people: Person[]): Person[] {
  return people.filter((p) => p.quals.includes(qualId));
}

export function squadsHolding(qualId: QualId, squads: Squad[], people: Person[]): Squad[] {
  return squads.filter((s) =>
    people.some((p) => p.squadId === s.id && p.quals.includes(qualId)),
  );
}

export interface SingleTerritoryQual {
  qual: Qual;
  squad: Squad;
  uncovered: number;
  line: string;
}

export function singleTerritoryQuals(
  quals: Qual[],
  squads: Squad[],
  people: Person[],
): SingleTerritoryQual[] {
  const rows: SingleTerritoryQual[] = [];
  for (const qual of quals) {
    const held = squadsHolding(qual.id, squads, people);
    if (held.length !== 1) continue;
    const uncovered = squads.length - 1;
    rows.push({
      qual,
      squad: held[0],
      uncovered,
      line: `${qual.name} — ${held[0].name} only. ${uncovered} territories uncovered.`,
    });
  }
  return rows;
}

export function requiredQualsForNeed(needId: string, tasks: Task[]): QualId[] {
  const ids = new Set<QualId>();
  for (const t of tasksForNeed(needId, tasks)) {
    t.requiredQuals.forEach((q) => ids.add(q));
  }
  return [...ids];
}

export interface UncoveredNeedRow {
  need: Need;
  territory: Squad;
  missingQual: Qual;
  nearest: Squad;
  line: string;
}

function qualShortName(qual: Qual): string {
  const parts = qual.name.split(' — ');
  return (parts[parts.length - 1] ?? qual.name).toLowerCase();
}

export function uncoveredNeeds(
  needs: Need[],
  tasks: Task[],
  quals: Qual[],
  squads: Squad[],
  people: Person[],
): UncoveredNeedRow[] {
  const rows: UncoveredNeedRow[] = [];
  for (const need of needs) {
    if (need.status !== 'open' && need.status !== 'stalled') continue;
    if (!need.mapPoint) continue;
    const territory = squadContaining(need.mapPoint, squads);
    if (!territory) continue;
    const required = requiredQualsForNeed(need.id, tasks);
    for (const qid of required) {
      const heldHere = people.some(
        (p) => p.squadId === territory.id && p.quals.includes(qid),
      );
      if (heldHere) continue;
      const qual = quals.find((q) => q.id === qid);
      const nearest = squadsHolding(qid, squads, people)[0];
      if (!qual || !nearest) continue;
      const titleShort = need.title.split(' — ')[0];
      const who = need.onBehalfOf?.name ?? titleShort;
      const minutes = need.stallReason?.match(/(\d+)\s*min/i)?.[1];
      const travel = minutes ? `, ${minutes} minutes` : '';
      rows.push({
        need,
        territory,
        missingQual: qual,
        nearest,
        line: `${titleShort} — ${who}. ${territory.name} has no ${qualShortName(qual)}. Nearest is ${nearest.name}${travel}.`,
      });
      break;
    }
  }
  return rows;
}

export function needsClusteredByTerritory(
  needs: Need[],
  squads: Squad[],
): { squad: Squad; count: number }[] {
  return squads.map((squad) => ({
    squad,
    count: needs.filter(
      (n) => n.mapPoint !== null && squadContaining(n.mapPoint, squads)?.id === squad.id,
    ).length,
  }));
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function holderDot(i: number, n: number, cx: number, cy: number): MapPoint {
  const angle = (i / Math.max(n, 1)) * Math.PI * 2 - Math.PI / 2;
  const r = 26 + (i % 3) * 10;
  return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
}

export function pinHover(need: Need, tasks: Task[], requester: string, daysOpen: number): string {
  const total = tasksForNeed(need.id, tasks).length;
  const verified = tasksVerified(need.id, tasks);
  return `${need.title}\n${requester} · ${daysOpen} day${daysOpen === 1 ? '' : 's'} open · ${verified} of ${total} verified`;
}

export function needRequiresQual(needId: string, tasks: Task[], qualId: QualId): boolean {
  return tasksForNeed(needId, tasks).some((t) => t.requiredQuals.includes(qualId));
}
