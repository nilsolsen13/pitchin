// Profile menu — identity header, My Rep, Creek Side squad, Reset demo
// (Increment 2 §1.1–§1.2). Role switcher and annotations live in the top bar.

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDemo } from '../state/DemoState';
import { actorForRole } from '../lib/actors';
import { Avatar } from './Avatar';

export function ProfileMenu() {
  const { role, resetDemo, people } = useDemo();
  const navigate = useNavigate();
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

          <div className="px-4 py-3">
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
