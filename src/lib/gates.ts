// Role-gated routes. Shared by the top-bar switcher and RequireRole.
// /post is open to both roles. /map is admin-only (Part C).

import type { Role } from '../types';

export function isRouteAllowed(path: string, role: Role): boolean {
  if (path.startsWith('/me') || path.startsWith('/calendar')) return role === 'resident';
  if (path.startsWith('/readiness') || path.startsWith('/map')) return role === 'admin';
  return true;
}
