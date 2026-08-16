// Eight ribbons (final spec D.3). Catalog only — never stored on a person.

import type { Ribbon, RibbonId } from '../types';

export const RIBBONS: Ribbon[] = [
  {
    id: 'first-rep',
    name: 'First Rep',
    criterion: 'Completed your first weekly rep.',
    note: 'Everybody starts here. It is the only one that is not hard.',
  },
  {
    id: 'twelve-weeks',
    name: 'Twelve Weeks',
    criterion: 'Twelve consecutive weeks kept.',
    note: 'A season of showing up.',
  },
  {
    id: 'half-year',
    name: 'Half Year',
    criterion: 'Twenty-six consecutive weeks kept.',
    note: 'Half a year without a gap. Most volunteer programmes never see this.',
  },
  {
    id: 'full-year',
    name: 'Full Year',
    criterion: 'Fifty-two consecutive weeks kept.',
    note: 'Fifty-two weeks. One person in town holds this.',
  },
  {
    id: 'fifty-kept',
    name: 'Fifty Kept',
    criterion: 'Fifty commitments kept, all time.',
    note: 'Fifty kept promises. Not fifty hours — fifty times somebody could count on you.',
  },
  {
    id: 'surge-responder',
    name: 'Surge Responder',
    criterion: 'Turned out for a surge.',
    note: 'You answered when it was not your scheduled week.',
  },
  {
    id: 'backstop',
    name: 'Backstop',
    criterion: 'Covered a commitment somebody else had to waive.',
    note: 'Somebody could not make it, and you took it. This is the one worth having.',
  },
  {
    id: 'multi-qual',
    name: 'Multi-Qual',
    criterion: 'Holds three or more quals.',
    note: 'Three or more demonstrated capabilities in the registry.',
  },
];

export const RIBBON_MONOGRAM: Record<RibbonId, string> = {
  'first-rep': 'FR',
  'twelve-weeks': '12',
  'half-year': 'HY',
  'full-year': 'FY',
  'fifty-kept': '50',
  'surge-responder': 'SR',
  backstop: 'BS',
  'multi-qual': 'MQ',
};

export function ribbonById(id: RibbonId): Ribbon {
  return RIBBONS.find((r) => r.id === id)!;
}
