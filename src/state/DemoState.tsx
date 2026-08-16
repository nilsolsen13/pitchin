// Global demo state (spec §8.1). One context, in-memory only.
// resetDemo re-clones the seed; every action produces new arrays so the seed
// module is never mutated (§8.1) and Reset actually restores state.

import { createContext, useContext, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { ChatMessage, ChatThread, Commitment, Need, Person, RepState, Role, Task } from '../types';
import { DEMO_TODAY, initialState } from '../data/seed';
import { seedMessages, seedThreads } from '../data/messages';
import { findThread, stampOutbound } from '../lib/chat';

interface DemoState {
  role: Role;
  annotationsOn: boolean;
  people: Person[];
  needs: Need[];
  tasks: Task[];
  commitments: Commitment[];
  repState: RepState;
  threads: ChatThread[];
  messages: ChatMessage[];
  messageSeq: number;
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
  | { type: 'SET_TOAST'; toast: string | null }
  | { type: 'SEND_MESSAGE'; threadId: string | null; fromId: string; toId: string; body: string }
  | { type: 'MARK_THREAD_READ'; threadId: string; readerId: string };

function freshSeed() {
  const s = structuredClone(initialState);
  return s;
}

function freshChat() {
  return {
    threads: structuredClone(seedThreads),
    messages: structuredClone(seedMessages),
    messageSeq: 0,
  };
}

function makeInitial(): DemoState {
  const s = freshSeed();
  const chat = freshChat();
  return {
    role: 'resident',
    annotationsOn: false,
    people: s.people,
    needs: s.needs,
    tasks: s.tasks,
    commitments: s.commitments,
    repState: 'KEEP_THE_CHAIN',
    threads: chat.threads,
    messages: chat.messages,
    messageSeq: chat.messageSeq,
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

    case 'SEND_MESSAGE': {
      const body = action.body.trim();
      if (!body) return state;
      const existing = action.threadId
        ? state.threads.find((t) => t.id === action.threadId)
        : findThread(state.threads, action.fromId, action.toId);
      const thread = existing ?? {
        id: `dm-${[action.fromId, action.toId].slice().sort().join('-')}`,
        participantIds: [action.fromId, action.toId] as [string, string],
      };
      const threads = existing ? state.threads : [...state.threads, thread];
      const message: ChatMessage = {
        id: `m-live-${state.messageSeq}`,
        threadId: thread.id,
        fromId: action.fromId,
        body,
        sentAt: stampOutbound(state.messageSeq),
        readBy: [action.fromId],
      };
      return {
        ...state,
        threads,
        messages: [...state.messages, message],
        messageSeq: state.messageSeq + 1,
      };
    }

    case 'MARK_THREAD_READ': {
      let changed = false;
      const messages = state.messages.map((m) => {
        if (m.threadId === action.threadId && !m.readBy.includes(action.readerId)) {
          changed = true;
          return { ...m, readBy: [...m.readBy, action.readerId] };
        }
        return m;
      });
      return changed ? { ...state, messages } : state;
    }

    case 'RESET': {
      const s = freshSeed();
      const chat = freshChat();
      return {
        role: 'resident',
        annotationsOn: false,
        people: s.people,
        needs: s.needs,
        tasks: s.tasks,
        commitments: s.commitments,
        repState: 'KEEP_THE_CHAIN',
        threads: chat.threads,
        messages: chat.messages,
        messageSeq: chat.messageSeq,
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
  sendMessage: (fromId: string, toId: string, body: string, threadId?: string | null) => void;
  markThreadRead: (threadId: string, readerId: string) => void;
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
    sendMessage: (fromId, toId, body, threadId = null) =>
      dispatch({ type: 'SEND_MESSAGE', threadId, fromId, toId, body }),
    markThreadRead: (threadId, readerId) =>
      dispatch({ type: 'MARK_THREAD_READ', threadId, readerId }),
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoStateProvider');
  return ctx;
}
