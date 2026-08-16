// Role-gated routes (spec §9.2). Shared by the top-bar switcher and RequireRole.

import type { Role } from '../types';

export function isRouteAllowed(path: string, role: Role): boolean {
  if (path.startsWith('/post')) return role === 'requester';
  if (path.startsWith('/me') || path.startsWith('/calendar')) return role === 'resident';
  if (path.startsWith('/readiness')) return role === 'admin';
  return true;
}
