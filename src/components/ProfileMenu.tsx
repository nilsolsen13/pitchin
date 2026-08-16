// Profile menu — identity + the demo controls that used to sit in the header
// cluster (spec §7.1 Viewing as / annotations / reset). Individual show-rates
// stay off this menu; they belong on /me and /squad/:id.

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Role } from '../types';
import { useDemo } from '../state/DemoState';
import { actorForRole } from '../lib/actors';
import { Avatar } from './Avatar';

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

export function ProfileMenu() {
  const {
    role,
    setRole,
    annotationsOn,
    toggleAnnotations,
    resetDemo,
    setToast,
    people,
  } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const actor = actorForRole(role, people);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function onSelectRole(newRole: Role) {
    const allowed = isRouteAllowed(location.pathname, newRole);
    setRole(newRole);
    if (!allowed) {
      navigate('/board');
      setToast(`VIEW CHANGED · ${newRole.toUpperCase()}`);
    }
  }

  function onReset() {
    setOpen(false);
    resetDemo();
    navigate('/board');
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-[#c9bfa9]/40 p-0.5 hover:border-[#f6e6a8]"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Profile and settings, ${actor.name}`}
      >
        <Avatar id={actor.id} name={actor.name} size={36} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-80 border border-[#2a1a0c] bg-[#fbf6ea] text-warm-ink"
        >
          <div className="flex gap-3 border-b border-warm-rule px-4 py-3">
            <Avatar id={actor.id} name={actor.name} size={44} />
            <div className="min-w-0">
              <div className="font-medium text-warm-ink">{actor.name}</div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
                {actor.line}
              </div>
            </div>
          </div>

          <div className="border-b border-warm-rule px-2 py-2">
            {role === 'resident' ? (
              <>
                <MenuLink to="/me" onClick={() => setOpen(false)}>
                  My Rep
                </MenuLink>
                <MenuLink to="/squad/creek-side" onClick={() => setOpen(false)}>
                  Creek Side squad
                </MenuLink>
              </>
            ) : null}
            {role === 'requester' ? (
              <MenuLink to="/post" onClick={() => setOpen(false)}>
                Post a Need
              </MenuLink>
            ) : null}
            {role === 'admin' ? (
              <>
                <MenuLink to="/readiness" onClick={() => setOpen(false)}>
                  Readiness
                </MenuLink>
                <MenuLink to="/registry" onClick={() => setOpen(false)}>
                  Registry
                </MenuLink>
              </>
            ) : null}
          </div>

          <div className="space-y-3 px-4 py-3">
            <div className="font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
              Settings
            </div>

            <label className="flex flex-col">
              <span className="mb-1 font-mono text-[0.65rem] tracking-wider text-warm-ink-2">
                VIEWING AS
              </span>
              <select
                value={role}
                onChange={(e) => onSelectRole(e.target.value as Role)}
                className="paper-select"
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
              className="flex w-full items-center justify-between text-sm text-warm-ink"
              aria-pressed={annotationsOn}
            >
              <span>Explain this screen</span>
              <span
                className={`inline-flex h-4 w-7 items-center rounded-full border transition-colors ${
                  annotationsOn
                    ? 'border-warm-stamp bg-warm-stamp/20'
                    : 'border-warm-rule bg-[#f4efe4]'
                }`}
              >
                <span
                  className={`h-3 w-3 rounded-full transition-transform ${
                    annotationsOn
                      ? 'translate-x-3.5 bg-warm-stamp'
                      : 'translate-x-0.5 bg-warm-ink-2'
                  }`}
                />
              </span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="paper-btn-ghost w-full text-left"
            >
              Reset demo
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: string;
}) {
  return (
    <Link
      to={to}
      role="menuitem"
      onClick={onClick}
      className="block rounded-warm px-2 py-1.5 text-sm text-warm-ink hover:bg-[#f6e6a8]/50"
    >
      {children}
    </Link>
  );
}
