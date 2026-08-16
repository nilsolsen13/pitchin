// Inbox helpers. Threads are 1:1; "you" is the demo actor for the current role.

import type { ChatMessage, ChatThread, Person } from '../types';
import { isDesk } from './actors';

export function otherParticipant(thread: ChatThread, actorId: string): string {
  return thread.participantIds[0] === actorId
    ? thread.participantIds[1]
    : thread.participantIds[0];
}

export function messagesIn(threadId: string, messages: ChatMessage[]): ChatMessage[] {
  return messages
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}

export function lastMessage(threadId: string, messages: ChatMessage[]): ChatMessage | null {
  const list = messagesIn(threadId, messages);
  return list[list.length - 1] ?? null;
}

export function isUnreadFor(message: ChatMessage, actorId: string): boolean {
  return message.fromId !== actorId && !message.readBy.includes(actorId);
}

export function unreadInThread(threadId: string, messages: ChatMessage[], actorId: string): number {
  return messages.filter((m) => m.threadId === threadId && isUnreadFor(m, actorId)).length;
}

export function unreadTotal(threads: ChatThread[], messages: ChatMessage[], actorId: string): number {
  return threadsForActor(threads, actorId).reduce(
    (n, t) => n + unreadInThread(t.id, messages, actorId),
    0,
  );
}

export function threadsForActor(threads: ChatThread[], actorId: string): ChatThread[] {
  return threads.filter((t) => t.participantIds.includes(actorId));
}

export function sortThreadsByRecent(
  threads: ChatThread[],
  messages: ChatMessage[],
): ChatThread[] {
  return [...threads].sort((a, b) => {
    const aAt = lastMessage(a.id, messages)?.sentAt ?? '';
    const bAt = lastMessage(b.id, messages)?.sentAt ?? '';
    return bAt.localeCompare(aAt);
  });
}

export function findThread(
  threads: ChatThread[],
  a: string,
  b: string,
): ChatThread | undefined {
  return threads.find(
    (t) => t.participantIds.includes(a) && t.participantIds.includes(b),
  );
}

export function previewText(message: ChatMessage | null): string {
  if (!message) return 'No messages yet.';
  const text = message.body.trim();
  return text.length > 72 ? `${text.slice(0, 69)}…` : text;
}

// Residents you can start a thread with — desks are not in the picker;
// you reach them by switching role.
export function messageablePeople(people: Person[], actorId: string): Person[] {
  return people
    .filter((p) => p.id !== actorId && !isDesk(p.id))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Demo clock stays on 12 Mar 2026. Sequence is minutes past 12:00.
export function stampOutbound(sequence: number): string {
  const mins = 12 * 60 + sequence;
  const h = String(Math.floor(mins / 60)).padStart(2, '0');
  const m = String(mins % 60).padStart(2, '0');
  return `2026-03-12T${h}:${m}:00-07:00`;
}
