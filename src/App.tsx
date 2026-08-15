// TEMPORARY Phase 1 checkpoint page (spec Appendix B, Phase 1).
// Prints derived values and PASS/FAIL vs the §4.1 expected-values table.
// Replaced by the real router in Phase 2.

import {
  bilingualParamedics, capacityGaps, commitmentsForNeed, equipmentCount,
  equipmentUsedCount, equipmentUtilization, medianStreak, outcomeCount,
  peopleCommitted, personHours, qualHolders, squadShowRate, tasksVerified,
  townShowRate,
} from './lib/derive';
import { fmtPct1 } from './lib/format';
import {
  commitments, equipment, people, squads, tasks,
} from './data/seed';

interface Check {
  label: string;
  got: string;
  want: string;
}

function build(): Check[] {
  const keptSum = people.reduce((a, p) => a + p.keptCount, 0);
  const missedSum = people.reduce((a, p) => a + p.missedCount, 0);
  const util = equipmentUtilization(equipment);
  const hansen = 'need-hansen-flood';
  const duthie = 'need-duthie-ramp';
  const duthieCommits = commitmentsForNeed(duthie, commitments, tasks);
  const c = (label: string, got: string | number, want: string | number): Check => ({
    label, got: String(got), want: String(want),
  });

  return [
    c('Registered residents', people.length, 24),
    c('Registered equipment', equipment.length, 31),
    c('Town kept / missed', `${keptSum} / ${missedSum}`, '915 / 94'),
    c('Town show-rate', fmtPct1(townShowRate(people)), '90.7%'),
    c('Median unbroken weeks', medianStreak(people), 19.5),
    c('Chainsaw-qualified', qualHolders('chainsaw', people).length, 12),
    c('Pump operators', qualHolders('pump-operator', people).length, 1),
    c('Spanish interpreters', qualHolders('spanish-interpreter', people).length, 1),
    c('Plow-qualified', qualHolders('plow', people).length, 2),
    c('Generators (equipment)', equipmentCount('generator', equipment), 4),
    c('Tow-capable trucks', equipmentCount('truck-tow', equipment), 9),
    c('Plow trucks', equipmentCount('truck-plow', equipment), 2),
    c('Trash pumps', equipmentCount('trash-pump', equipment), 3),
    c('Chainsaws (equipment)', equipmentCount('chainsaw', equipment), 8),
    c('Bilingual paramedic', bilingualParamedics(people).length, 1),
    c('Assets used / total', `${equipmentUsedCount(equipment)} / ${equipment.length}`, '19 / 31'),
    c('Equipment utilization', fmtPct1(util), '61.3%'),
    c('Hansen — people committed', peopleCommitted(hansen, tasks), 16),
    c('Hansen — person-hours', personHours(hansen, tasks), 26.75),
    c('Hansen — tasks verified', tasksVerified(hansen, tasks), 3),
    c('Hansen — capacity gaps', capacityGaps(hansen, tasks), 1),
    c('Duthie — residents', peopleCommitted(duthie, tasks), 9),
    c('Duthie — commitments', duthieCommits.length, 13),
    c('Duthie — kept', outcomeCount(duthieCommits, 'kept'), 12),
    c('Duthie — waived', outcomeCount(duthieCommits, 'waived'), 1),
    c('Duthie — person-hours', personHours(duthie, tasks), 29),
    c('Creek Side show-rate', fmtPct1(squadShowRate(squads[0], people)), '90.3%'),
    c('Kenosha Pass show-rate', fmtPct1(squadShowRate(squads[1], people)), '91.8%'),
    c('Red Hill show-rate', fmtPct1(squadShowRate(squads[2], people)), '92.0%'),
    c('Tarryall show-rate', fmtPct1(squadShowRate(squads[3], people)), '87.7%'),
  ];
}

export default function App() {
  const checks = build();
  const failed = checks.filter((x) => x.got !== x.want).length;

  return (
    <div data-surface="ops" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div className="mx-auto max-w-content">
        <h1 className="text-3xl font-semibold text-primary">Phase 1 checkpoint</h1>
        <p className="mt-1 font-mono text-sm text-secondary">
          Derived values vs the §4.1 expected-values table.
        </p>
        <p className={`mt-3 font-mono text-lg ${failed === 0 ? 'text-status-verified' : 'text-status-missed'}`}>
          {failed === 0 ? `ALL ${checks.length} CHECKS PASS` : `${failed} OF ${checks.length} CHECKS FAILED`}
        </p>

        <table className="mt-6 w-full border-collapse font-mono text-sm">
          <thead>
            <tr className="border-b border-rule text-left text-secondary">
              <th className="py-2 pr-4">Quantity</th>
              <th className="py-2 pr-4">Derived</th>
              <th className="py-2 pr-4">Expected</th>
              <th className="py-2">Result</th>
            </tr>
          </thead>
          <tbody>
            {checks.map((x) => {
              const pass = x.got === x.want;
              return (
                <tr key={x.label} className="border-b border-rule/50">
                  <td className="py-1.5 pr-4 text-primary">{x.label}</td>
                  <td className="py-1.5 pr-4 text-primary">{x.got}</td>
                  <td className="py-1.5 pr-4 text-muted">{x.want}</td>
                  <td className={`py-1.5 ${pass ? 'text-status-verified' : 'text-status-missed'}`}>
                    {pass ? 'PASS' : 'FAIL'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
