// Capability Registry (spec §7.7). Headline strip + searchable People / Quals /
// Equipment views. Every headline is derived; holders===1 flags a single point
// of failure. Utilization is computed, not hardcoded.

import { useState } from 'react';
import type { EquipmentType, QualId } from '../types';
import { useDemo } from '../state/DemoState';
import { equipment, orgs, quals } from '../data/seed';
import {
  bilingualParamedics, equipmentCount, equipmentUsedCount, equipmentUtilization,
  qualHolders,
} from '../lib/derive';
import { fmtPctInt, fmtShort } from '../lib/format';
import { Avatar } from '../components/Avatar';
import { StatCard } from '../components/StatCard';
import { PersonCard } from '../components/PersonCard';
import { MaterielChip } from '../components/MaterielChip';

type View = 'PEOPLE' | 'QUALS' | 'EQUIPMENT';
const VIEWS: View[] = ['PEOPLE', 'QUALS', 'EQUIPMENT'];

const EQUIP_TYPES: EquipmentType[] = [
  'truck-tow', 'truck-plow', 'trailer-stock', 'generator', 'trash-pump', 'chainsaw', 'ham-base', 'dehumidifier',
];

export default function Registry() {
  const { people } = useDemo();
  const [view, setView] = useState<View>('QUALS');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const used = equipmentUsedCount(equipment);
  const util = fmtPctInt(equipmentUtilization(equipment));

  function ownerName(ownerId: string | null, ownerOrgId: string | null): string {
    if (ownerId) return people.find((p) => p.id === ownerId)?.name ?? ownerId;
    if (ownerOrgId) return orgs.find((o) => o.id === ownerOrgId)?.name ?? ownerOrgId;
    return 'Organization';
  }

  const filteredPeople = people.filter((p) => {
    if (!q) return true;
    if (p.name.toLowerCase().includes(q)) return true;
    if (p.languages.some((l) => l.toLowerCase().includes(q))) return true;
    return p.quals.some((qid) => quals.find((x) => x.id === qid)?.name.toLowerCase().includes(q));
  });

  const filteredQuals = quals.filter((x) => !q || x.name.toLowerCase().includes(q));
  const filteredEquip = equipment.filter((e) => !q || e.label.toLowerCase().includes(q));

  return (
    <div>
      <h1 className="text-3xl font-semibold text-ops-text">Capability Registry</h1>
      <p className="mt-1 text-ops-text-2">What the town actually has. Capability, not intention.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="GENERATORS" value={equipmentCount('generator', equipment)} />
        <StatCard label="TOW-CAPABLE TRUCKS" value={equipmentCount('truck-tow', equipment)} />
        <StatCard label="CHAINSAW-QUALIFIED" value={qualHolders('chainsaw', people).length} />
        <StatCard label="BILINGUAL PARAMEDIC" value={bilingualParamedics(people).length} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a skill, a language, a piece of equipment…"
          className="w-full max-w-md rounded-ops border border-ops-border bg-ops-surface px-3 py-2 text-sm text-ops-text placeholder:text-ops-text-3 focus:border-ops-accent focus:outline-none"
        />
        <div className="flex gap-2">
          {VIEWS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider transition-colors ${
                view === v
                  ? 'border-ops-accent bg-ops-accent/15 text-ops-accent'
                  : 'border-ops-border text-ops-text-2 hover:text-ops-text'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {view === 'QUALS' ? (
            <div className="space-y-3">
              {filteredQuals.map((qual) => {
                const holders = qualHolders(qual.id as QualId, people);
                const spof = holders.length === 1;
                return (
                  <div key={qual.id} className="rounded-ops border border-ops-border bg-ops-surface p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-ops-text">{qual.name}</span>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-ops-text-3">
                        {qual.category} · {holders.length} {holders.length === 1 ? 'HOLDER' : 'HOLDERS'}
                      </span>
                      {spof ? (
                        <span
                          className="rounded-ops px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider"
                          style={{ color: '#C4544A', border: '1px solid #C4544A55' }}
                        >
                          SINGLE POINT OF FAILURE
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-sm text-ops-text-2">{qual.demonstration}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {holders.map((p) => (
                        <Avatar key={p.id} id={p.id} name={p.name} size={24} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {view === 'PEOPLE' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredPeople.map((p) => (
                <PersonCard key={p.id} person={p} />
              ))}
            </div>
          ) : null}

          {view === 'EQUIPMENT' ? (
            <div className="space-y-6">
              {EQUIP_TYPES.map((type) => {
                const items = filteredEquip.filter((e) => e.type === type);
                if (items.length === 0) return null;
                return (
                  <div key={type}>
                    <div className="mb-2 flex items-center gap-2">
                      <MaterielChip type={type} />
                      <span className="font-mono text-[11px] text-ops-text-3">{items.length}</span>
                    </div>
                    <div className="space-y-2">
                      {items.map((e) => (
                        <div
                          key={e.id}
                          className="flex items-center justify-between gap-4 rounded-ops border border-ops-border bg-ops-surface px-3 py-2"
                        >
                          <div>
                            <div className="text-sm text-ops-text">{e.label}</div>
                            <div className="font-mono text-[11px] uppercase tracking-wider text-ops-text-3">
                              {ownerName(e.ownerId, e.ownerOrgId)}
                            </div>
                          </div>
                          {e.lastUsed === null ? (
                            <span className="font-mono text-[11px] uppercase tracking-wider text-ops-text-3">
                              NEVER USED
                            </span>
                          ) : (
                            <span className="font-mono text-[11px] uppercase tracking-wider text-ops-text-2">
                              {fmtShort(e.lastUsed)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <aside className="lg:col-span-4">
          <div className="rounded-ops border border-ops-border bg-ops-surface p-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ops-text-3">Utilization</div>
            <p className="mt-2 font-mono text-sm text-ops-text">
              {used} of {equipment.length} registered assets used in the last 90 days — {util}
            </p>
            <p className="mt-2 text-sm text-ops-text-2">
              An idle welder is a supply failure, not an apathy problem.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
