// Thin wrapper that looks up annotation copy by {route}:{n} and renders a marker.
// Place inside a `relative` container; positions via className.

import { annotations } from '../data/annotations';
import { AnnotationMarker } from './AnnotationMarker';

export function Ann({
  route,
  n,
  className,
  warm = true,
}: {
  route: string;
  n: number;
  className?: string;
  warm?: boolean;
}) {
  const text = annotations[`${route}:${n}`];
  if (!text) return null;
  return <AnnotationMarker n={n} text={text} className={className} warm={warm} />;
}
