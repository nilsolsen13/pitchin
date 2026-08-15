// Persistent chrome for routes 1–8 (spec §7.1). Ops palette.
// Top bar (64px) + status bar (36px). Nav gates by role; the "Viewing as"
// switcher redirects to /board with a toast when the current route becomes
// invisible to the new role (§9.2).

import type { ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import type { Role } from '../types';
import { useDemo } from '../state/DemoState';
import { DEMO_TODAY } from '../data/seed';
import { townShowRate } from '../lib/derive';
import { fmtPct1, fmtStatusDate } from '../lib/format';
import { Toast } from './Toast';

interface NavItem {
  to: string;
  label: string;
  roles: Role[] | 'all';
}

const NAV: NavItem[] = [
  { to: '/board', label: 'Board', roles: 'all' },
  { to: '/post', label: 'Post a Need', roles: ['requester'] },
  { to: '/registry', label: 'Registry', roles: 'all' },
  { to: '/me', label: 'My Rep', roles: ['resident'] },
  { to: '/readiness', label: 'Readiness', roles: ['admin'] },
  { to: '/wall', label: 'The Wall', roles: 'all' },
];

const ROLE_OPTIONS: { role: Role; label: string }[] = [
  { role: 'resident', label: 'Nora Beckett · Resident' },
  { role: 'requester', label: 'Park County EM · Requester' },
  { role: 'admin', label: 'Park County · Administrator' },
];

function isRouteAllowed(path: string, role: Role): boolean {
  if (path.startsWith('/post')) return role === 'requester';
  if (path.startsWith('/me')) return role === 'resident';
  if (path.startsWith('/readiness')) return role === 'admin';
  return true;
}

function navVisible(item: NavItem, role: Role): boolean {
  return item.roles === 'all' || item.roles.includes(role);
}

export function AppShell({ children }: { children: ReactNode }) {
  const { role, setRole, annotationsOn, toggleAnnotations, resetDemo, setToast, people, needs } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();

  const surgeCount = needs.filter((n) => n.mode === 'surge' && n.status !== 'met').length;
  const showRate = fmtPct1(townShowRate(people));

  function onSelectRole(newRole: Role) {
    const allowed = isRouteAllowed(location.pathname, newRole);
    setRole(newRole);
    if (!allowed) {
      navigate('/board');
      setToast(`VIEW CHANGED · ${newRole.toUpperCase()}`);
    }
  }

  function onReset() {
    resetDemo();
    navigate('/board');
  }

  return (
    <div data-surface="ops" className="min-h-screen bg-canvas text-primary">
      {/* Top bar */}
      <header className="sticky top-0 z-40 h-16 border-b border-ops-border bg-ops-surface">
        <div className="mx-auto flex h-16 max-w-content items-center gap-6 px-8">
          <Link to="/" className="text-lg font-semibold text-ops-text">
            PitchIn
          </Link>

          <nav className="flex items-center gap-5">
            {NAV.filter((item) => navVisible(item, role)).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `border-b-2 pb-0.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-ops-accent text-ops-accent'
                      : 'border-transparent text-ops-text-2 hover:text-ops-text'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-5">
            <label className="flex flex-col leading-none">
              <span className="mb-1 font-mono text-[0.65rem] tracking-wider text-ops-text-3">
                VIEWING AS
              </span>
              <select
                value={role}
                onChange={(e) => onSelectRole(e.target.value as Role)}
                className="rounded-ops border border-ops-border bg-ops-raised px-2 py-1 text-sm text-ops-text focus:border-ops-accent focus:outline-none"
              >
                {ROLE_OPTIONS.map((o) => (
                  <option key={o.role} value={o.role}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={toggleAnnotations}
              className="flex items-center gap-2 text-sm text-ops-text-2 hover:text-ops-text"
              aria-pressed={annotationsOn}
            >
              <span
                className={`inline-flex h-4 w-7 items-center rounded-full border transition-colors ${
                  annotationsOn ? 'border-ops-accent bg-ops-accent/30' : 'border-ops-border bg-ops-raised'
                }`}
              >
                <span
                  className={`h-3 w-3 rounded-full transition-transform ${
                    annotationsOn ? 'translate-x-3.5 bg-ops-accent' : 'translate-x-0.5 bg-ops-text-3'
                  }`}
                />
              </span>
              Explain this screen
            </button>

            <button
              type="button"
              onClick={onReset}
              className="rounded-ops border border-ops-border px-3 py-1 text-sm text-ops-text-2 hover:border-ops-text-3 hover:text-ops-text"
            >
              Reset demo
            </button>
          </div>
        </div>
      </header>

      {/* Status bar */}
      <div className="h-9 border-b border-ops-border bg-ops-bg">
        <div className="mx-auto flex h-9 max-w-content items-center px-8 font-mono text-xs text-ops-text-3">
          {`SOUTH PARK, CO  ·  ${fmtStatusDate(DEMO_TODAY)}  ·  TOWN SHOW-RATE ${showRate}  ·  ${surgeCount} ACTIVE SURGE`}
        </div>
      </div>

      <main className="mx-auto max-w-content px-8 py-8">{children}</main>
      <Toast />
    </div>
  );
}
