// Global demo state (spec §8.1). One context, in-memory only.
// resetDemo re-clones the seed; every action produces new arrays so the seed
// module is never mutated (§8.1) and Reset actually restores state.

import { createContext, useContext, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Commitment, Need, Person, RepState, Role, Task } from '../types';
import { DEMO_TODAY, initialState } from '../data/seed';

interface DemoState {
  role: Role;
  annotationsOn: boolean;
  people: Person[];
  needs: Need[];
  tasks: Task[];
  commitments: Commitment[];
  repState: RepState;
  toast: string | null;
  toastNonce: number;
}

type Action =
  | { type: 'SET_ROLE'; role: Role }
  | { type: 'TOGGLE_ANNOTATIONS' }
  | { type: 'CLAIM_TASK'; taskId: string; personId: string; toast: string }
  | { type: 'VERIFY_TASK'; taskId: string }
  | { type: 'SET_REP_STATE'; repState: RepState }
  | { type: 'ACCEPT_REP' }
  | { type: 'WAIVE_REP' }
  | { type: 'RESET' }
  | { type: 'SET_TOAST'; toast: string | null };

function freshSeed() {
  const s = structuredClone(initialState);
  return s;
}

function makeInitial(): DemoState {
  const s = freshSeed();
  return {
    role: 'resident',
    annotationsOn: true,
    people: s.people,
    needs: s.needs,
    tasks: s.tasks,
    commitments: s.commitments,
    repState: 'KEEP_THE_CHAIN',
    toast: null,
    toastNonce: 0,
  };
}

function withToast(state: DemoState, toast: string | null): DemoState {
  return { ...state, toast, toastNonce: state.toastNonce + 1 };
}

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.role };

    case 'TOGGLE_ANNOTATIONS':
      return { ...state, annotationsOn: !state.annotationsOn };

    case 'CLAIM_TASK': {
      const tasks = state.tasks.map((t) =>
        t.id === action.taskId && !t.assigneeIds.includes(action.personId)
          ? { ...t, status: 'claimed' as const, assigneeIds: [...t.assigneeIds, action.personId] }
          : t,
      );
      const commitment: Commitment = {
        id: `c-claim-${action.taskId}-${action.personId}`,
        personId: action.personId,
        taskId: action.taskId,
        madeAt: `${DEMO_TODAY}T12:00:00-07:00`,
        dueAt: `${DEMO_TODAY}T12:00:00-07:00`,
        outcome: 'pending',
        isWeeklyRep: false,
        scopeMinutes: 20,
      };
      const commitments = state.commitments.some((c) => c.id === commitment.id)
        ? state.commitments
        : [...state.commitments, commitment];
      return withToast({ ...state, tasks, commitments }, action.toast);
    }

    case 'VERIFY_TASK': {
      const tasks = state.tasks.map((t) =>
        t.id === action.taskId
          ? {
              ...t,
              status: 'verified' as const,
              verifiedById: 'p-vega',
              verifiedAt: `${DEMO_TODAY}T12:00:00-07:00`,
            }
          : t,
      );
      return withToast({ ...state, tasks }, 'TASK VERIFIED');
    }

    case 'SET_REP_STATE':
      return { ...state, repState: action.repState };

    case 'ACCEPT_REP':
      return withToast({ ...state, repState: 'ACCEPTED' }, 'REP ACCEPTED');

    case 'WAIVE_REP':
      return withToast(
        { ...state, repState: 'WAIVED' },
        'WAIVED · DOES NOT COUNT AGAINST YOUR SHOW-RATE',
      );

    case 'RESET': {
      const s = freshSeed();
      return {
        role: 'resident',
        annotationsOn: true,
        people: s.people,
        needs: s.needs,
        tasks: s.tasks,
        commitments: s.commitments,
        repState: 'KEEP_THE_CHAIN',
        toast: 'DEMO RESET',
        toastNonce: state.toastNonce + 1,
      };
    }

    case 'SET_TOAST':
      return withToast(state, action.toast);

    default:
      return state;
  }
}

interface DemoContextValue extends DemoState {
  setRole: (role: Role) => void;
  toggleAnnotations: () => void;
  claimTask: (taskId: string, personId: string, toast: string) => void;
  verifyTask: (taskId: string) => void;
  setRepState: (repState: RepState) => void;
  acceptRep: () => void;
  waiveRep: () => void;
  resetDemo: () => void;
  setToast: (toast: string | null) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitial);

  // Auto-dismiss toasts after 4s (spec §8.3). Keyed on the nonce so identical
  // consecutive messages still re-arm the timer.
  useEffect(() => {
    if (state.toast === null) return;
    const id = setTimeout(() => dispatch({ type: 'SET_TOAST', toast: null }), 4000);
    return () => clearTimeout(id);
  }, [state.toast, state.toastNonce]);

  const value: DemoContextValue = {
    ...state,
    setRole: (role) => dispatch({ type: 'SET_ROLE', role }),
    toggleAnnotations: () => dispatch({ type: 'TOGGLE_ANNOTATIONS' }),
    claimTask: (taskId, personId, toast) => dispatch({ type: 'CLAIM_TASK', taskId, personId, toast }),
    verifyTask: (taskId) => dispatch({ type: 'VERIFY_TASK', taskId }),
    setRepState: (repState) => dispatch({ type: 'SET_REP_STATE', repState }),
    acceptRep: () => dispatch({ type: 'ACCEPT_REP' }),
    waiveRep: () => dispatch({ type: 'WAIVE_REP' }),
    resetDemo: () => dispatch({ type: 'RESET' }),
    setToast: (toast) => dispatch({ type: 'SET_TOAST', toast }),
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoStateProvider');
  return ctx;
}
