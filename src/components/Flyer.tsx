// Paper flyer chrome for the Needs Board cork bulletin.
// Visual only — does not change copy or data.

import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';

const PINS = ['#C4544A', '#2A4A7A', '#E8A33D', '#F4EFE4', '#2A2620', '#47643F'];

function pinColor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return PINS[Math.abs(h) % PINS.length];
}

function flyerTilt(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 17 + id.charCodeAt(i)) | 0;
  const tilts = [-1.5, 1.1, -0.8, 1.4, 0.6, -1.2, 0.9, -0.5];
  return tilts[Math.abs(h) % tilts.length];
}

export function Flyer({
  id,
  paper,
  children,
  className = '',
  tape = false,
  to,
  style,
}: {
  id: string;
  paper: string;
  children: ReactNode;
  className?: string;
  tape?: boolean;
  to?: string;
  style?: CSSProperties;
}) {
  const tilt = flyerTilt(id);
  const merged: CSSProperties = {
    backgroundColor: paper,
    ['--flyer-tilt' as string]: `${tilt}deg`,
    ...style,
  };
  const cls = `board-flyer p-4 ${className}`;

  const body = (
    <>
      <span className="board-pin" style={{ backgroundColor: pinColor(id) }} aria-hidden />
      {tape ? <span className="board-tape" aria-hidden /> : null}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${cls} block text-inherit no-underline`} style={merged}>
        {body}
      </Link>
    );
  }

  return (
    <div className={cls} style={merged}>
      {body}
    </div>
  );
}
