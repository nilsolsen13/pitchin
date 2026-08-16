// County Map (final spec Part C). Hand-drawn SVG schematic — no mapping
// library, no tiles, no network. Capability clustered by territory.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Need, NeedStatus, QualId } from '../types';
import { useDemo } from '../state/DemoState';
import { orgs, quals, squads } from '../data/seed';
import { DEMO_TODAY } from '../data/seed';
import { daysSince } from '../lib/format';
import { PAPER } from '../lib/paper';
import { Ann } from '../components/Ann';
import { Flyer } from '../components/Flyer';
import { Bulletin, Masthead, PaperTab } from '../components/Bulletin';
import {
  holderDot,
  holdersOfQual,
  initials,
  needRequiresQual,
  needsClusteredByTerritory,
  pinHover,
  singleTerritoryQuals,
  squadsHolding,
  uncoveredNeeds,
} from '../lib/map';

const HONESTY =
  'SCHEMATIC — RELATIVE POSITIONS ONLY, NOT A SURVEY. SOUTH PARK IS FICTIONAL; PARK COUNTY IS NOT.';

const CLOSING =
  'Two plough trucks is a number. Both plough trucks on the same side of the basin is a decision nobody made on purpose.';

const PIN_R = 8;

const PIN_FILL: Record<NeedStatus, string> = {
  open: '#6E7C8C',
  staffing: '#4C8DD9',
  in_progress: '#E8A33D',
  met: '#3FA66A',
  stalled: '#C4544A',
};

function needHref(id: string): string {
  return `/need/${id.replace(/^need-/, '')}`;
}

function requesterOf(need: Need): string {
  if (need.postedByResident) return 'Nora Beckett';
  return orgs.find((o) => o.id === need.requesterOrgId)?.name ?? need.requesterOrgId;
}

export default function CountyMap() {
  const { needs, tasks, people } = useDemo();
  const navigate = useNavigate();
  const [layer, setLayer] = useState<'needs' | 'coverage'>('needs');
  const [qualId, setQualId] = useState<QualId>('plow');
  const [hoverId, setHoverId] = useState<string | null>(null);

  const coverage = layer === 'coverage';
  const heldSquads = squadsHolding(qualId, squads, people);
  const heldIds = new Set(heldSquads.map((s) => s.id));
  const holders = holdersOfQual(qualId, people);
  const singles = singleTerritoryQuals(quals, squads, people);
  const uncovered = uncoveredNeeds(needs, tasks, quals, squads, people);
  const clusters = needsClusteredByTerritory(needs, squads);

  const kenosha = squads.find((s) => s.id === 'kenosha-pass')!;
  const vasquez = needs.find((n) => n.id === 'need-vasquez-plow');
  const showGapLine = coverage && qualId === 'plow' && vasquez?.mapPoint;

  const hover = hoverId ? needs.find((n) => n.id === hoverId) : undefined;
  const pins = needs.filter((n) => n.mapPoint !== null);
  const visiblePins = coverage
    ? pins.filter((n) => needRequiresQual(n.id, tasks, qualId))
    : pins;

  return (
    <Bulletin>
      <Masthead title="The Map" sub="Park County · schematic of the South Park basin" />

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <PaperTab active={layer === 'needs'} onClick={() => setLayer('needs')} tilt="-0.5deg">
          NEEDS
        </PaperTab>
        <PaperTab active={layer === 'coverage'} onClick={() => setLayer('coverage')} tilt="0.6deg">
          COVERAGE
        </PaperTab>
      </div>

      {coverage ? (
        <div className="mt-4 flex justify-center">
          <label className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#f4efe4]/80">Qual</span>
            <select
              className="paper-select"
              value={qualId}
              onChange={(e) => setQualId(e.target.value as QualId)}
            >
              {quals.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Flyer id="map-basin" paper={PAPER.cream} className="!p-3">
            <div className="relative">
              <svg
                viewBox="0 0 1000 700"
                className="h-auto w-full"
                role="img"
                aria-label="Schematic of the South Park basin"
              >
                <rect width="1000" height="700" fill="#EAE2D2" />

                {/* Soft mountain edge */}
                <path
                  d="M 0,90 L 70,48 L 140,78 L 210,32 L 290,62 L 370,22 L 455,55 L 540,18 L 620,50 L 700,24 L 780,58 L 860,28 L 940,52 L 1000,36 L 1000,0 L 0,0 Z"
                  fill="#5a6a58"
                  fillOpacity="0.35"
                />
                <path
                  d="M 0,90 L 70,48 L 140,78 L 210,32 L 290,62 L 370,22 L 455,55 L 540,18 L 620,50 L 700,24 L 780,58 L 860,28 L 940,52 L 1000,36"
                  fill="none"
                  stroke="#3a4a38"
                  strokeWidth="2"
                />

                {squads.map((s) => {
                  const covered = heldIds.has(s.id);
                  const nHold = holders.filter((p) => p.squadId === s.id).length;
                  const fill = coverage
                    ? covered
                      ? '#47643F'
                      : '#C4544A'
                    : '#F4EFE4';
                  const opacity = coverage ? (covered ? 0.18 : 0.14) : 0.55;
                  return (
                    <g key={s.id}>
                      <path
                        d={s.territory.path}
                        fill={fill}
                        fillOpacity={opacity}
                        stroke="#6B6250"
                        strokeWidth="1.5"
                      />
                      {coverage ? (
                        <text
                          x={s.territory.cx}
                          y={s.territory.cy + 28}
                          textAnchor="middle"
                          fill="#6B6250"
                          fontFamily="JetBrains Mono, ui-monospace, monospace"
                          fontSize="11"
                          letterSpacing="0.08em"
                        >
                          {covered
                            ? `COVERED · ${nHold} holder${nHold === 1 ? '' : 's'}`
                            : 'NO COVERAGE'}
                        </text>
                      ) : null}
                      <text
                        x={s.territory.cx}
                        y={s.territory.cy - (coverage ? 8 : 0)}
                        textAnchor="middle"
                        fill="#6B6250"
                        fontFamily="Oswald, ui-sans-serif, sans-serif"
                        fontSize="18"
                        fontWeight="600"
                        letterSpacing="0.08em"
                      >
                        {s.territory.label}
                      </text>
                    </g>
                  );
                })}

                {/* Roads */}
                <path d="M 90,430 L 340,425 L 700,410 L 940,395" fill="none" stroke="#8a7a62" strokeWidth="1.5" />
                <path d="M 340,425 L 490,160" fill="none" stroke="#8a7a62" strokeWidth="1.25" />
                <path d="M 200,620 L 340,425" fill="none" stroke="#8a7a62" strokeWidth="1.25" />

                {/* Middle Fork */}
                <path
                  d="M 305,55 C 300,140 312,210 295,300 C 280,390 275,460 268,540"
                  fill="none"
                  stroke="#5a7a9a"
                  strokeWidth="2.5"
                />
                <text
                  x="230"
                  y="210"
                  fill="#5a7a9a"
                  fontFamily="Oswald, ui-sans-serif, sans-serif"
                  fontSize="12"
                  letterSpacing="0.12em"
                  transform="rotate(-72 230 210)"
                >
                  MIDDLE FORK
                </text>

                {/* Town centre */}
                <rect x="332" y="422" width="16" height="16" fill="#2A2620" />
                <text
                  x="352"
                  y="416"
                  fill="#2A2620"
                  fontFamily="Oswald, ui-sans-serif, sans-serif"
                  fontSize="13"
                  fontWeight="600"
                  letterSpacing="0.1em"
                >
                  SOUTH PARK
                </text>

                {coverage
                  ? holders.map((p) => {
                      const squad = squads.find((s) => s.id === p.squadId);
                      if (!squad) return null;
                      const among = holders.filter((h) => h.squadId === p.squadId);
                      const localI = among.findIndex((h) => h.id === p.id);
                      const pt = holderDot(localI, among.length, squad.territory.cx, squad.territory.cy);
                      return (
                        <g key={p.id}>
                          <circle cx={pt.x} cy={pt.y} r="7" fill="#2A2620" />
                          <text
                            x={pt.x}
                            y={pt.y + 3}
                            textAnchor="middle"
                            fill="#F4EFE4"
                            fontFamily="JetBrains Mono, ui-monospace, monospace"
                            fontSize="7"
                          >
                            {initials(p.name)}
                          </text>
                        </g>
                      );
                    })
                  : null}

                {showGapLine && vasquez?.mapPoint ? (
                  <g>
                    <line
                      x1={kenosha.territory.cx}
                      y1={kenosha.territory.cy}
                      x2={vasquez.mapPoint.x}
                      y2={vasquez.mapPoint.y}
                      stroke="#C4544A"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                    />
                    <text
                      x={(kenosha.territory.cx + vasquez.mapPoint.x) / 2 + 18}
                      y={(kenosha.territory.cy + vasquez.mapPoint.y) / 2 - 8}
                      fill="#C4544A"
                      fontFamily="Oswald, ui-sans-serif, sans-serif"
                      fontSize="16"
                      fontWeight="700"
                      letterSpacing="0.08em"
                    >
                      22 MIN
                    </text>
                  </g>
                ) : null}

                {visiblePins.map((need) => {
                  const pt = need.mapPoint!;
                  const outlined = coverage && needRequiresQual(need.id, tasks, qualId);
                  return (
                    <g
                      key={need.id}
                      transform={`translate(${pt.x}, ${pt.y})`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoverId(need.id)}
                      onMouseLeave={() => setHoverId(null)}
                      onClick={() => navigate(needHref(need.id))}
                    >
                      <title>
                        {pinHover(need, tasks, requesterOf(need), daysSince(need.submittedAt, DEMO_TODAY))}
                      </title>
                      <circle
                        r={PIN_R}
                        fill={PIN_FILL[need.status]}
                        stroke={outlined ? '#C4544A' : '#2A2620'}
                        strokeWidth={outlined ? 2.5 : 1}
                      />
                    </g>
                  );
                })}
              </svg>

              {hover?.mapPoint ? (
                <div
                  className="pointer-events-none absolute z-10 max-w-[16rem] border border-warm-rule bg-warm-paper px-2 py-1.5 text-xs text-warm-ink shadow-sm"
                  style={{
                    left: `${(hover.mapPoint.x / 1000) * 100}%`,
                    top: `${(hover.mapPoint.y / 700) * 100}%`,
                    transform: 'translate(12px, 8px)',
                  }}
                >
                  <div className="font-medium">{hover.title}</div>
                  <div className="mt-0.5 font-mono text-[0.6875rem] text-warm-ink-2">
                    {requesterOf(hover)} · {daysSince(hover.submittedAt, DEMO_TODAY)} days open ·{' '}
                    {tasks.filter((t) => t.needId === hover.id && t.status === 'verified').length} of{' '}
                    {tasks.filter((t) => t.needId === hover.id).length} verified
                  </div>
                </div>
              ) : null}
            </div>
            <p className="mt-2 font-mono text-[0.6875rem] text-warm-ink-2">{HONESTY}</p>
          </Flyer>
        </div>

        <div className="relative lg:col-span-4">
          <Ann route="map" n={1} className="-left-5 top-2" />
          <Flyer id="map-findings" paper={PAPER.cream}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-warm-ink-2">
              WHAT THE MAP SHOWS
            </h2>

            <h3 className="mt-5 font-mono text-[11px] uppercase tracking-[0.08em] text-warm-ink">
              SINGLE-TERRITORY CAPABILITIES
            </h3>
            <ul className="mt-2 space-y-2">
              {singles.map((row) => (
                <li key={row.qual.id}>
                  <button
                    type="button"
                    className="text-left text-sm text-warm-ink hover:text-warm-stamp"
                    onClick={() => {
                      setLayer('coverage');
                      setQualId(row.qual.id);
                    }}
                  >
                    {row.line}
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="mt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-warm-ink">
              NEEDS IN UNCOVERED TERRITORY
            </h3>
            <ul className="mt-2 space-y-2">
              {uncovered.map((row) => (
                <li key={row.need.id}>
                  <button
                    type="button"
                    className="text-left text-sm text-warm-ink hover:text-warm-stamp"
                    onClick={() => navigate(needHref(row.need.id))}
                  >
                    {row.line}
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="mt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-warm-ink">
              WHERE NEEDS CLUSTER
            </h3>
            <ul className="mt-2 space-y-1">
              {clusters.map((row) => (
                <li key={row.squad.id} className="text-sm text-warm-ink">
                  {row.squad.name} — {row.count}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-warm-ink-2">{CLOSING}</p>
          </Flyer>
        </div>
      </div>
    </Bulletin>
  );
}
