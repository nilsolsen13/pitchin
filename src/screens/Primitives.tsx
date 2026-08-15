// Scratch showcase for the §6.5 primitives (Phase 3). Not in nav; route
// /_primitives. Used to verify every chip color and the show-rate ring.

import type { NeedStatus, TaskStatus } from '../types';
import { needs, people, squads, tasks } from '../data/seed';
import { showRate } from '../lib/derive';
import { StatusChip } from '../components/StatusChip';
import { ModeBadge } from '../components/ModeBadge';
import { QualBadge } from '../components/QualBadge';
import { MaterielChip } from '../components/MaterielChip';
import { ShowRateRing } from '../components/ShowRateRing';
import { StatCard } from '../components/StatCard';
import { SquadStreakBar } from '../components/SquadStreakBar';
import { PersonCard } from '../components/PersonCard';
import { NeedCard } from '../components/NeedCard';
import { RepCard } from '../components/RepCard';
import { TaskRow } from '../components/TaskRow';
import { AnnotationMarker } from '../components/AnnotationMarker';

const TASK_STATUSES: TaskStatus[] = ['open', 'claimed', 'in_progress', 'verified', 'missed', 'blocked'];
const NEED_STATUSES: NeedStatus[] = ['open', 'staffing', 'in_progress', 'met', 'stalled'];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.08em] text-ops-text-3">{title}</h2>
      {children}
    </section>
  );
}

export default function Primitives() {
  const nora = people.find((p) => p.id === 'p-beckett')!;
  const vasquez = needs.find((n) => n.id === 'need-vasquez-plow')!;
  const hansen = needs.find((n) => n.id === 'need-hansen-flood')!;
  const floodTask = tasks.find((t) => t.id === 't-flood-02')!;
  const blockedTask = tasks.find((t) => t.id === 't-flood-11')!;

  return (
    <div>
      <h1 className="text-3xl font-semibold text-ops-text">Primitives</h1>

      <Section title="StatusChip — TaskStatus">
        <div className="flex flex-wrap gap-4">
          {TASK_STATUSES.map((s) => (
            <StatusChip key={s} status={s} />
          ))}
        </div>
      </Section>

      <Section title="StatusChip — NeedStatus">
        <div className="flex flex-wrap gap-4">
          {NEED_STATUSES.map((s) => (
            <StatusChip key={s} status={s} />
          ))}
        </div>
      </Section>

      <Section title="ModeBadge">
        <div className="flex gap-3">
          <ModeBadge mode="surge" />
          <ModeBadge mode="sustainment" />
        </div>
      </Section>

      <Section title="QualBadge (tooltip = demonstration)">
        <div className="flex flex-wrap gap-2">
          <QualBadge qualId="chainsaw" />
          <QualBadge qualId="pump-operator" />
          <QualBadge qualId="spanish-interpreter" />
          <QualBadge qualId="elder-checkin" />
          <QualBadge qualId="heavy-tow" />
        </div>
      </Section>

      <Section title="MaterielChip">
        <div className="flex flex-wrap gap-2">
          <MaterielChip type="truck-tow" />
          <MaterielChip type="truck-plow" />
          <MaterielChip type="trailer-stock" />
          <MaterielChip type="generator" />
          <MaterielChip type="trash-pump" />
          <MaterielChip type="chainsaw" />
          <MaterielChip type="ham-base" />
          <MaterielChip type="dehumidifier" />
        </div>
      </Section>

      <Section title="ShowRateRing (76%)">
        <ShowRateRing value={showRate(nora) * 100} />
      </Section>

      <Section title="StatCard">
        <div className="grid max-w-3xl grid-cols-3 gap-4">
          <StatCard label="TOWN SHOW-RATE" value="90.7%" sub="915 kept / 94 missed" />
          <StatCard label="PERSON-HOURS" value="26.75" accent />
          <StatCard label="CAPACITY GAPS" value="1" />
        </div>
      </Section>

      <Section title="SquadStreakBar">
        <SquadStreakBar squad={squads[0]} />
      </Section>

      <Section title="PersonCard">
        <div className="max-w-md">
          <PersonCard person={nora} showRate={showRate(nora) * 100} />
        </div>
      </Section>

      <Section title="NeedCard (stalled + surge)">
        <div className="grid max-w-4xl grid-cols-2 gap-4">
          <NeedCard need={vasquez} />
          <NeedCard need={hansen} />
        </div>
      </Section>

      <Section title="TaskRow (normal + blocked)">
        <div className="max-w-3xl space-y-3">
          <TaskRow task={floodTask} people={people} />
          <TaskRow task={blockedTask} people={people} />
        </div>
      </Section>

      <Section title="RepCard — three states">
        <div className="grid max-w-5xl grid-cols-1 gap-4 lg:grid-cols-3">
          <RepCard state="STANDARD" />
          <RepCard state="SCOPED_DOWN" />
          <RepCard state="KEEP_THE_CHAIN" />
        </div>
      </Section>

      <Section title="AnnotationMarker (toggle 'Explain this screen' on)">
        <div className="relative h-12 w-64 rounded-ops border border-ops-border bg-ops-surface">
          <span className="absolute left-3 top-3 text-sm text-ops-text-2">Anchor element</span>
          <AnnotationMarker n={1} text="This is a sample annotation panel. Click-outside or Esc closes it." className="right-2 top-2" />
        </div>
      </Section>
    </div>
  );
}
