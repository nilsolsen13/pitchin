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
import { PAPER } from '../lib/paper';
import { StatCard } from '../components/StatCard';
import { ModeBadge } from '../components/ModeBadge';
import { StatusChip } from '../components/StatusChip';
import { Ann } from '../components/Ann';
import { Flyer } from '../components/Flyer';
import { Bulletin, Masthead } from '../components/Bulletin';

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
    <Bulletin>
      <Masthead
        title="Readiness"
        sub="South Park, Park County · Thursday 12 March 2026"
      />

      <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
        <StatCard label="TOWN SHOW-RATE" value={fmtPct1(townShowRate(people))} sub="915 kept / 94 missed" />
        <div className="relative">
          <Ann route="readiness" n={1} className="-left-6 top-2" />
          <StatCard
            label="MEDIAN UNBROKEN WEEKS"
            value={medianStreak(people)}
            sub={`retention at 6 mo: ${fmtPctInt(townHistory.retention6Month)}  ·  12 mo: ${fmtPctInt(townHistory.retention12Month)}`}
          />
        </div>
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

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-[#f4efe4]/80">
            Squad standings
          </h2>
          <Flyer id="readiness-squads" paper={PAPER.cream} className="!p-0 overflow-hidden">
            <table className="paper-table">
              <thead>
                <tr>
                  <th>Squad</th>
                  <th>Show-rate</th>
                  <th>Streak</th>
                  <th>Members</th>
                  <th>Standing</th>
                </tr>
              </thead>
              <tbody>
                {squadRows.map((s) => (
                  <tr key={s.id}>
                    <td className="text-warm-ink">{s.name}</td>
                    <td className="font-mono">{fmtPct1(squadShowRate(s, people))}</td>
                    <td className="font-mono text-warm-ink-2">{s.streakWeeks} wk</td>
                    <td className="font-mono text-warm-ink-2">{s.memberIds.length}</td>
                    <td className="text-warm-ink-2">{s.standing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Flyer>
          <p className="mt-3 text-center font-mono text-[11px] text-[#f4efe4]/80">
            Individual show-rates are not published. Rankings are squad-level by design.
          </p>
        </div>

        <div className="relative lg:col-span-5">
          <Ann route="readiness" n={2} className="-left-6 top-0" />
          <h2 className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-[#f4efe4]/80">
            Capacity gaps
          </h2>
          <div className="space-y-4">
            {CAPACITY_GAPS.map((g) => (
              <Flyer key={g} id={`gap-${g.slice(0, 12)}`} paper={PAPER.rose}>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: '#C4544A' }} />
                  <span className="font-mono text-xs leading-relaxed text-warm-ink">{g}</span>
                </div>
              </Flyer>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-[#f4efe4]/80">
          Participation over 12 weeks
        </h2>
        <Flyer id="readiness-chart" paper={PAPER.cream}>
          <div className="flex items-end gap-2" style={{ height: 160 }}>
            {townHistory.weeklyParticipation.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center justify-end">
                <span className="mb-1 font-mono text-[11px] text-warm-ink-2">{v}</span>
                <div
                  className="w-full rounded-t-[2px] bg-warm-stamp"
                  style={{ height: `${(v / chartMax) * 130}px` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
            RESIDENTS COMPLETING REP
          </div>
        </Flyer>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-[#f4efe4]/80">
          Needs ledger
        </h2>
        <Flyer id="readiness-ledger" paper={PAPER.cream} className="!p-0 overflow-x-auto">
          <table className="paper-table">
            <thead>
              <tr>
                <th>Need</th>
                <th>Requester</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Days open</th>
                <th>Tasks</th>
              </tr>
            </thead>
            <tbody>
              {needs.map((n) => {
                const org = orgs.find((o) => o.id === n.requesterOrgId);
                const total = tasksForNeed(n.id, tasks).length;
                const verified = tasksVerified(n.id, tasks);
                const days = n.metAt ? daysBetween(n.submittedAt, n.metAt) : daysSince(n.submittedAt, DEMO_TODAY);
                return (
                  <tr key={n.id} className="align-top">
                    <td className="text-warm-ink">{n.title}</td>
                    <td className="text-warm-ink-2">{org?.name ?? n.requesterOrgId}</td>
                    <td><ModeBadge mode={n.mode} /></td>
                    <td><StatusChip status={n.status} /></td>
                    <td className="font-mono text-warm-ink-2">{days}</td>
                    <td className="font-mono text-warm-ink-2">{verified}/{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Flyer>
      </div>
    </Bulletin>
  );
}
