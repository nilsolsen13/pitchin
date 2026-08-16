// Cork bulletin wrapper used by every screen. Visual only.

import type { ReactNode } from 'react';
import { Flyer } from './Flyer';
import { PAPER } from '../lib/paper';

export function Bulletin({
  children,
  full = false,
}: {
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div
      data-surface="warm"
      className={
        full
          ? 'board-cork min-h-screen px-8 py-12 text-warm-ink'
          : 'board-cork -mx-8 -my-8 min-h-[calc(100vh-100px)] px-8 py-10 text-warm-ink'
      }
    >
      <div className="mx-auto max-w-content">{children}</div>
    </div>
  );
}

export function Masthead({
  title,
  sub,
  id,
}: {
  title: string;
  sub?: ReactNode;
  id?: string;
}) {
  return (
    <header className="mx-auto max-w-2xl">
      <Flyer id={id ?? `mast-${title}`} paper={PAPER.masthead} className="text-center">
        <h1 className="font-display text-4xl font-bold uppercase tracking-[0.08em] text-warm-ink">
          {title}
        </h1>
        {sub ? <div className="mt-2 text-warm-ink-2">{sub}</div> : null}
      </Flyer>
    </header>
  );
}

export function PaperTab({
  active,
  onClick,
  children,
  tilt = '0.3deg',
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  tilt?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`board-flyer cursor-pointer px-3 py-1.5 font-mono text-xs uppercase tracking-wider ${
        active ? 'text-warm-stamp' : 'text-warm-ink-2 hover:text-warm-ink'
      }`}
      style={{
        backgroundColor: active ? PAPER.yellow : PAPER.cream,
        ['--flyer-tilt' as string]: tilt,
      }}
    >
      {children}
    </button>
  );
}
