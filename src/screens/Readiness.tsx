// Readiness Dashboard (spec §7.8). Admin only. Squad-level rankings only —
// never individuals. Stats derived; townHistory supplies the pre-ledger
// aggregates. The 12-week bar chart is hand-rolled with divs (no chart library).

import { useDemo } from '../state/DemoState';
import { equipment, orgs, squads, townHistory } from '../data/seed';
import {
  equipmentUsedCount, equipmentUtilization, medianStreak, squadShowRate,
  tasksForNeed, tasksVerified, townShowRate,
} from '../lib/derive';
import { DEMO_TODAY } from '../data/seed';
import { daysBetween, daysSince, fmtPct1, fmtPctInt } from '../lib/format';
import { StatCard } from '../components/StatCard';
import { ModeBadge } from '../components/ModeBadge';
import { StatusChip } from '../components/StatusChip';

const CAPACITY_GAPS = [
  'PUMP OPERATOR — 3 pumps registered, 1 qualified operator',
  'PLOW COVERAGE — 2 plow trucks, both registered to Kenosha Pass. Tarryall and Red Hill uncovered.',
  'SPANISH INTERPRETER — 1 qualified. Tuesday county services desk has no backup.',
];

export default function Readiness() {
  const { people, needs, tasks } = useDemo();
  const chartMax = 24; // registered residents — keep the gap to full participation visible

  const squadRows = [...squads].sort((a, b) => squadShowRate(b, people) - squadShowRate(a, people));

  return (
    <div>
      <h1 className="text-3xl font-semibold text-ops-text">Readiness</h1>
      <p className="mt-1 text-ops-text-2">South Park, Park County · Thursday 12 March 2026</p>

      {/* Row 1 — five stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard label="TOWN SHOW-RATE" value={fmtPct1(townShowRate(people))} sub="915 kept / 94 missed" />
        <StatCard
          label="MEDIAN UNBROKEN WEEKS"
          value={medianStreak(people)}
          sub={`retention at 6 mo: ${fmtPctInt(townHistory.retention6Month)}  ·  12 mo: ${fmtPctInt(townHistory.retention12Month)}`}
        />
        <StatCard
          label="MEDIAN TIME TO MET"
          value={townHistory.medianDaysToMet}
          unit="days"
          sub={`last 90 days, ${townHistory.needsClosedLast90Days} needs`}
        />
        <StatCard
          label="CAPACITY UTILIZATION"
          value={fmtPctInt(equipmentUtilization(equipment))}
          sub={`${equipmentUsedCount(equipment)} of ${equipment.length} registered assets, 90 days`}
        />
        <StatCard
          label="SURGE RESPONSE"
          value="4"
          unit="hrs"
          sub={`${townHistory.lastSurge.respondersIn4Hours} residents fielded, ${townHistory.lastSurge.label}`}
        />
      </div>

      {/* Row 2 — squad standings + capacity gaps */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">Squad standings</h2>
          <div className="overflow-hidden rounded-ops border border-ops-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-ops-surface text-left font-mono text-[11px] uppercase tracking-wider text-ops-text-3">
                  <th className="px-3 py-2">Squad</th>
                  <th className="px-3 py-2">Show-rate</th>
                  <th className="px-3 py-2">Streak</th>
                  <th className="px-3 py-2">Members</th>
                  <th className="px-3 py-2">Standing</th>
                </tr>
              </thead>
              <tbody>
                {squadRows.map((s) => (
                  <tr key={s.id} className="border-t border-ops-border">
                    <td className="px-3 py-2 text-ops-text">{s.name}</td>
                    <td className="px-3 py-2 font-mono text-ops-text">{fmtPct1(squadShowRate(s, people))}</td>
                    <td className="px-3 py-2 font-mono text-ops-text-2">{s.streakWeeks} wk</td>
                    <td className="px-3 py-2 font-mono text-ops-text-2">{s.memberIds.length}</td>
                    <td className="px-3 py-2 text-ops-text-2">{s.standing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 font-mono text-[11px] text-ops-text-3">
            Individual show-rates are not published. Rankings are squad-level by design.
          </p>
        </div>

        <div className="lg:col-span-5">
          <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">Capacity gaps</h2>
          <div className="space-y-2">
            {CAPACITY_GAPS.map((g) => (
              <div
                key={g}
                className="flex items-start gap-2 rounded-ops border border-ops-border bg-ops-surface p-3"
              >
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: '#C4544A' }} />
                <span className="font-mono text-xs leading-relaxed text-ops-text-2">{g}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 — participation over 12 weeks */}
      <div className="mt-8">
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">
          Participation over 12 weeks
        </h2>
        <div className="rounded-ops border border-ops-border bg-ops-surface p-4">
          <div className="flex items-end gap-2" style={{ height: 160 }}>
            {townHistory.weeklyParticipation.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center justify-end">
                <span className="mb-1 font-mono text-[11px] text-ops-text-2">{v}</span>
                <div
                  className="w-full rounded-t-[2px] bg-ops-accent"
                  style={{ height: `${(v / chartMax) * 130}px` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-ops-text-3">
            RESIDENTS COMPLETING REP
          </div>
        </div>
      </div>

      {/* Row 4 — needs ledger */}
      <div className="mt-8">
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">Needs ledger</h2>
        <div className="overflow-x-auto rounded-ops border border-ops-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-ops-surface text-left font-mono text-[11px] uppercase tracking-wider text-ops-text-3">
                <th className="px-3 py-2">Need</th>
                <th className="px-3 py-2">Requester</th>
                <th className="px-3 py-2">Mode</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Days open</th>
                <th className="px-3 py-2">Tasks</th>
              </tr>
            </thead>
            <tbody>
              {needs.map((n) => {
                const org = orgs.find((o) => o.id === n.requesterOrgId);
                const total = tasksForNeed(n.id, tasks).length;
                const verified = tasksVerified(n.id, tasks);
                const days = n.metAt ? daysBetween(n.submittedAt, n.metAt) : daysSince(n.submittedAt, DEMO_TODAY);
                return (
                  <tr key={n.id} className="border-t border-ops-border align-top">
                    <td className="px-3 py-2 text-ops-text">{n.title}</td>
                    <td className="px-3 py-2 text-ops-text-2">{org?.name ?? n.requesterOrgId}</td>
                    <td className="px-3 py-2"><ModeBadge mode={n.mode} /></td>
                    <td className="px-3 py-2"><StatusChip status={n.status} /></td>
                    <td className="px-3 py-2 font-mono text-ops-text-2">{days}</td>
                    <td className="px-3 py-2 font-mono text-ops-text-2">{verified}/{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
