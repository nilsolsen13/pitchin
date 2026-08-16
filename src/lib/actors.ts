// Who "you" are in the demo chrome. Resident is Nora Beckett. Admin is the
// Park County desk. Requester is a relationship to a need, not a role.

import type { Person, Role } from '../types';
import { squads } from '../data/seed';

export interface Actor {
  id: string;
  name: string;
  line: string;
}

export const ACTOR_ADMIN = 'actor-admin';

const DESKS: Record<string, Actor> = {
  [ACTOR_ADMIN]: { id: ACTOR_ADMIN, name: 'Park County', line: 'Administrator' },
};

export function actorForRole(role: Role, people: Person[]): Actor {
  if (role === 'resident') {
    const nora = people.find((p) => p.id === 'p-beckett');
    const squad = squads.find((s) => s.id === nora?.squadId);
    return {
      id: 'p-beckett',
      name: nora?.name ?? 'Nora Beckett',
      line: `${squad?.name ?? 'Creek Side'} · Resident`,
    };
  }
  return DESKS[ACTOR_ADMIN];
}

export function displayName(id: string, people: Person[]): string {
  return DESKS[id]?.name ?? people.find((p) => p.id === id)?.name ?? id;
}
