// Persistent chrome for routes 1–8 (spec §7.1). Wood hallway trim around
// the cork bulletin. Top bar (64px) + status bar (36px). Nav gates by role.
// Profile menu holds identity, My Rep, Creek Side squad, and reset.
// Role change still redirects off gated routes (§9.2).

import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { Role } from '../types';
import { useDemo } from '../state/DemoState';
import { DEMO_TODAY } from '../data/seed';
import { townShowRate } from '../lib/derive';
import { fmtPct1, fmtStatusDate } from '../lib/format';
import { actorForRole } from '../lib/actors';
import { Toast } from './Toast';
import { ProfileMenu } from './ProfileMenu';
import { AnnotationsSwitch, RoleSwitcher } from './DemoControls';
import { Wordmark } from './Wordmark';

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

function navVisible(item: NavItem, role: Role): boolean {
  return item.roles === 'all' || item.roles.includes(role);
}

export function AppShell({ children }: { children: ReactNode }) {
  const { role, people, needs } = useDemo();

  const surgeCount = needs.filter((n) => n.mode === 'surge' && n.status !== 'met').length;
  const showRate = fmtPct1(townShowRate(people));
  const actor = actorForRole(role, people);

  return (
    <div className="min-h-screen bg-[#3a2410] text-[#f4efe4]">
      <header className="sticky top-0 z-40 h-16 overflow-visible border-b border-[#2a1a0c] bg-[#5c3a1e]">
        <div className="mx-auto flex h-16 max-w-content flex-nowrap items-center gap-6 overflow-visible px-8">
          <Link to="/" className="text-xl text-[#f4efe4]">
            <Wordmark />
          </Link>

          <nav className="flex min-w-0 items-center gap-5 overflow-hidden whitespace-nowrap">
            {NAV.filter((item) => navVisible(item, role)).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `border-b-2 pb-0.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-[#f6e6a8] text-[#f6e6a8]'
                      : 'border-transparent text-[#d4c4a8] hover:text-[#f4efe4]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div
            className="ml-auto flex shrink-0 items-center gap-3"
            aria-label={`Demo controls, viewing as ${actor.name}`}
          >
            <RoleSwitcher />
            <AnnotationsSwitch />
            <ProfileMenu />
          </div>
        </div>
      </header>

      <div className="h-9 border-b border-[#2a1a0c] bg-[#3a2410]">
        <div className="mx-auto flex h-9 max-w-content items-center px-8 font-mono text-xs text-[#d4c4a8]">
          {`SOUTH PARK, CO  ·  ${fmtStatusDate(DEMO_TODAY)}  ·  TOWN SHOW-RATE ${showRate}  ·  ${surgeCount} ACTIVE SURGE`}
        </div>
      </div>

      <main className="mx-auto max-w-content px-8 py-8">{children}</main>
      <Toast />
    </div>
  );
}
