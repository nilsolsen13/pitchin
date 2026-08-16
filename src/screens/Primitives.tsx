// Scratch showcase for the §6.5 primitives (Phase 3). Not in nav; route
// /_primitives. Used to verify every chip color and the show-rate ring.

import type { NeedStatus, TaskStatus } from '../types';
import { needs, people, squads, tasks } from '../data/seed';
import { showRate } from '../lib/derive';
import { PAPER } from '../lib/paper';
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
import { Flyer } from '../components/Flyer';
import { Bulletin, Masthead } from '../components/Bulletin';

const TASK_STATUSES: TaskStatus[] = ['open', 'claimed', 'in_progress', 'verified', 'missed', 'blocked'];
const NEED_STATUSES: NeedStatus[] = ['open', 'staffing', 'in_progress', 'met', 'stalled'];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-center font-mono text-xs uppercase tracking-[0.08em] text-[#f4efe4]/80">{title}</h2>
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
    <Bulletin>
      <Masthead title="Primitives" />

      <Section title="StatusChip — TaskStatus">
        <Flyer id="prim-task-status" paper={PAPER.cream}>
          <div className="flex flex-wrap gap-4">
            {TASK_STATUSES.map((s) => (
              <StatusChip key={s} status={s} />
            ))}
          </div>
        </Flyer>
      </Section>

      <Section title="StatusChip — NeedStatus">
        <Flyer id="prim-need-status" paper={PAPER.cream}>
          <div className="flex flex-wrap gap-4">
            {NEED_STATUSES.map((s) => (
              <StatusChip key={s} status={s} />
            ))}
          </div>
        </Flyer>
      </Section>

      <Section title="ModeBadge">
        <Flyer id="prim-mode" paper={PAPER.cream}>
          <div className="flex gap-3">
            <ModeBadge mode="surge" />
            <ModeBadge mode="sustainment" />
          </div>
        </Flyer>
      </Section>

      <Section title="QualBadge (tooltip = demonstration)">
        <Flyer id="prim-quals" paper={PAPER.cream}>
          <div className="flex flex-wrap gap-2">
            <QualBadge qualId="chainsaw" />
            <QualBadge qualId="pump-operator" />
            <QualBadge qualId="spanish-interpreter" />
            <QualBadge qualId="elder-checkin" />
            <QualBadge qualId="heavy-tow" />
          </div>
        </Flyer>
      </Section>

      <Section title="MaterielChip">
        <Flyer id="prim-materiel" paper={PAPER.cream}>
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
        </Flyer>
      </Section>

      <Section title="ShowRateRing (76%)">
        <Flyer id="prim-ring" paper={PAPER.cream} className="inline-block">
          <ShowRateRing value={showRate(nora) * 100} />
        </Flyer>
      </Section>

      <Section title="StatCard">
        <div className="grid max-w-3xl grid-cols-3 gap-6">
          <StatCard label="TOWN SHOW-RATE" value="90.7%" sub="915 kept / 94 missed" />
          <StatCard label="PERSON-HOURS" value="26.75" accent />
          <StatCard label="CAPACITY GAPS" value="1" />
        </div>
      </Section>

      <Section title="SquadStreakBar">
        <Flyer id="prim-streak" paper={PAPER.green} className="max-w-md">
          <SquadStreakBar squad={squads[0]} />
        </Flyer>
      </Section>

      <Section title="PersonCard">
        <div className="max-w-md">
          <PersonCard person={nora} showRate={showRate(nora) * 100} />
        </div>
      </Section>

      <Section title="NeedCard (stalled + surge)">
        <div className="grid max-w-4xl grid-cols-2 gap-6">
          <NeedCard need={vasquez} />
          <NeedCard need={hansen} />
        </div>
      </Section>

      <Section title="TaskRow (normal + blocked)">
        <div className="max-w-3xl space-y-5">
          <TaskRow task={floodTask} people={people} />
          <TaskRow task={blockedTask} people={people} />
        </div>
      </Section>

      <Section title="RepCard — three states">
        <div className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
          <RepCard state="STANDARD" />
          <RepCard state="SCOPED_DOWN" />
          <RepCard state="KEEP_THE_CHAIN" />
        </div>
      </Section>

      <Section title="AnnotationMarker (toggle 'Explain this screen' on)">
        <Flyer id="prim-ann" paper={PAPER.cream} className="relative h-12 w-64">
          <span className="absolute left-3 top-3 text-sm text-warm-ink-2">Anchor element</span>
          <AnnotationMarker n={1} text="This is a sample annotation panel. Click-outside or Esc closes it." className="right-2 top-2" />
        </Flyer>
      </Section>
    </Bulletin>
  );
}
