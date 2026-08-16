// Who "you" are in the demo chrome. Resident is Nora Beckett (the prescribed
// persona). Requester and admin are org desks, not Appendix A people.

import type { Person, Role } from '../types';
import { squads } from '../data/seed';

export interface Actor {
  id: string;
  name: string;
  line: string;
}

export const ACTOR_EM = 'actor-em';
export const ACTOR_ADMIN = 'actor-admin';

const DESKS: Record<string, Actor> = {
  [ACTOR_EM]: { id: ACTOR_EM, name: 'Park County EM', line: 'Requester' },
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
  if (role === 'requester') return DESKS[ACTOR_EM];
  return DESKS[ACTOR_ADMIN];
}

export function displayName(id: string, people: Person[]): string {
  return DESKS[id]?.name ?? people.find((p) => p.id === id)?.name ?? id;
}
