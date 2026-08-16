// AnnotationMarker (spec §6.5, §8.2). Numbered dot; click opens a panel with
// "NOTE {n}" + text. Click-outside or Esc closes. Hidden when annotations off.
// Ops markers are amber; warm screens pass warm to use the letterpress red.

import { useEffect, useRef, useState } from 'react';
import { useDemo } from '../state/DemoState';

export function AnnotationMarker({
  n,
  text,
  className = '',
  warm = false,
}: {
  n: number;
  text: string;
  className?: string;
  warm?: boolean;
}) {
  const { annotationsOn } = useDemo();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  if (!annotationsOn) return null;

  const dot = warm ? '#A63D2E' : '#E8A33D';
  const dotText = warm ? '#F4EFE4' : '#0E1116';

  return (
    <div ref={ref} className={`absolute z-30 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Note ${n}`}
        className="flex h-5 w-5 items-center justify-center rounded-full font-mono text-[11px] font-medium shadow"
        style={{ backgroundColor: dot, color: dotText }}
      >
        {n}
      </button>
      {open ? (
        <div
          className={`absolute left-7 top-0 w-[22rem] max-w-[80vw] rounded-ops border p-3 text-sm leading-relaxed shadow-lg ${
            warm
              ? 'border-warm-rule bg-warm-paper-deep text-warm-ink'
              : 'border-ops-border bg-ops-raised text-ops-text'
          }`}
        >
          <div
            className="mb-1 font-mono text-[11px] uppercase tracking-[0.08em]"
            style={{ color: dot }}
          >
            NOTE {n}
          </div>
          {text}
        </div>
      ) : null}
    </div>
  );
}
