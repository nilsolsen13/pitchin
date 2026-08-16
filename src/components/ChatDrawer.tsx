// Right-rail direct messages. In-memory only; Reset restores the seed threads.
// Copy is operational — coordination, not social — and never staffs the
// stalled Vasquez driveway.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { squads } from '../data/seed';
import { useDemo } from '../state/DemoState';
import { actorForRole, displayName } from '../lib/actors';
import {
  findThread,
  lastMessage,
  messageablePeople,
  messagesIn,
  otherParticipant,
  previewText,
  sortThreadsByRecent,
  threadsForActor,
  unreadInThread,
} from '../lib/chat';
import { fmtChatStamp } from '../lib/format';
import { Avatar } from './Avatar';

type Pane =
  | { kind: 'list' }
  | { kind: 'compose' }
  | { kind: 'thread'; toId: string };

export function ChatDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { role, people, threads, messages, sendMessage, markThreadRead } = useDemo();
  const actor = actorForRole(role, people);
  const [pane, setPane] = useState<Pane>({ kind: 'list' });
  const [draft, setDraft] = useState('');
  const scrollerRef = useRef<HTMLDivElement>(null);

  const inbox = useMemo(
    () => sortThreadsByRecent(threadsForActor(threads, actor.id), messages),
    [threads, messages, actor.id],
  );

  const thread = pane.kind === 'thread' ? findThread(threads, actor.id, pane.toId) : undefined;
  const toId = pane.kind === 'thread' ? pane.toId : null;
  const threadMessages = thread ? messagesIn(thread.id, messages) : [];

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setPane({ kind: 'list' });
      setDraft('');
    }
  }, [open]);

  useEffect(() => {
    setPane({ kind: 'list' });
    setDraft('');
  }, [actor.id]);

  useEffect(() => {
    if (!thread) return;
    markThreadRead(thread.id, actor.id);
  }, [thread, actor.id, markThreadRead]);

  useEffect(() => {
    if (pane.kind !== 'thread') return;
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [pane, threadMessages.length]);

  if (!open) return null;

  function openThread(otherId: string) {
    setDraft('');
    setPane({ kind: 'thread', toId: otherId });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!toId) return;
    const body = draft.trim();
    if (!body) return;
    sendMessage(actor.id, toId, body, thread?.id ?? null);
    setDraft('');
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        aria-label="Dismiss messages"
        onClick={onClose}
      />
      <aside
        className="animate-drawer-in absolute right-0 top-0 flex h-full w-[22.5rem] flex-col border-l border-[#2a1a0c] bg-[#fbf6ea] text-warm-ink"
        role="dialog"
        aria-modal="true"
        aria-label="Messages"
      >
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-[#2a1a0c] bg-[#5c3a1e] px-4 text-[#f4efe4]">
          {pane.kind !== 'list' ? (
            <button
              type="button"
              onClick={() => {
                setDraft('');
                setPane({ kind: 'list' });
              }}
              className="text-sm text-[#d4c4a8] hover:text-[#f4efe4]"
            >
              ← Inbox
            </button>
          ) : (
            <span className="font-display text-sm font-semibold uppercase tracking-[0.08em]">
              Messages
            </span>
          )}
          <div className="ml-auto flex items-center gap-3">
            {pane.kind === 'list' ? (
              <button
                type="button"
                onClick={() => setPane({ kind: 'compose' })}
                className="font-mono text-[11px] uppercase tracking-wider text-[#d4c4a8] hover:text-[#f6e6a8]"
              >
                New
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-[#d4c4a8] hover:text-[#f4efe4]"
              aria-label="Close messages"
            >
              Close
            </button>
          </div>
        </header>

        {pane.kind === 'list' ? (
          <ul className="min-h-0 flex-1 overflow-y-auto">
            {inbox.length === 0 ? (
              <li className="px-4 py-8 text-sm text-warm-ink-2">
                No messages for this view. Start one with New.
              </li>
            ) : (
              inbox.map((t) => {
                const oid = otherParticipant(t, actor.id);
                const last = lastMessage(t.id, messages);
                const unread = unreadInThread(t.id, messages, actor.id);
                return (
                  <li key={t.id} className="border-b border-warm-rule">
                    <button
                      type="button"
                      onClick={() => openThread(oid)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[#f6e6a8]/40"
                    >
                      <Avatar id={oid} name={displayName(oid, people)} size={36} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-sm font-medium text-warm-ink">
                            {displayName(oid, people)}
                          </span>
                          {last ? (
                            <span className="shrink-0 font-mono text-[10px] text-warm-ink-2">
                              {fmtChatStamp(last.sentAt)}
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-warm-ink-2">
                          {previewText(last)}
                        </span>
                      </span>
                      {unread > 0 ? (
                        <span className="mt-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-warm-stamp px-1.5 font-mono text-[10px] text-[#f4efe4]">
                          {unread}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        ) : null}

        {pane.kind === 'compose' ? (
          <ul className="min-h-0 flex-1 overflow-y-auto">
            {messageablePeople(people, actor.id).map((p) => {
              const squad = squads.find((s) => s.id === p.squadId);
              return (
                <li key={p.id} className="border-b border-warm-rule">
                  <button
                    type="button"
                    onClick={() => openThread(p.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f6e6a8]/40"
                  >
                    <Avatar id={p.id} name={p.name} size={32} />
                    <span>
                      <span className="block text-sm font-medium">{p.name}</span>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
                        {squad?.name}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {pane.kind === 'thread' && toId ? (
          <>
            <div className="flex items-center gap-3 border-b border-warm-rule px-4 py-3">
              <Avatar id={toId} name={displayName(toId, people)} size={32} />
              <div>
                <div className="text-sm font-medium">{displayName(toId, people)}</div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-warm-ink-2">
                  Direct
                </div>
              </div>
            </div>
            <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              {threadMessages.length === 0 ? (
                <p className="text-sm text-warm-ink-2">No messages yet.</p>
              ) : (
                <ol className="space-y-3">
                  {threadMessages.map((m) => {
                    const mine = m.fromId === actor.id;
                    return (
                      <li key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[85%] px-3 py-2 text-sm ${
                            mine
                              ? 'bg-[#5c3a1e] text-[#f4efe4]'
                              : 'border border-warm-rule bg-[#f4efe4] text-warm-ink'
                          }`}
                        >
                          <div>{m.body}</div>
                          <div
                            className={`mt-1 font-mono text-[10px] ${
                              mine ? 'text-[#d4c4a8]' : 'text-warm-ink-2'
                            }`}
                          >
                            {fmtChatStamp(m.sentAt)}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
            <Composer
              draft={draft}
              onChange={setDraft}
              onSubmit={onSubmit}
              suggestions={suggestedReplies(toId)}
            />
          </>
        ) : null}
      </aside>
    </div>
  );
}

function Composer({
  draft,
  onChange,
  onSubmit,
  suggestions,
}: {
  draft: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  suggestions: string[];
}) {
  return (
    <div className="border-t border-warm-rule p-3">
      {suggestions.length > 0 ? (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className="rounded-warm border border-warm-rule px-2 py-1 text-xs text-warm-ink-2 hover:border-warm-ink hover:text-warm-ink"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write a message"
          className="paper-input flex-1"
          aria-label="Message"
        />
        <button type="submit" className="paper-btn shrink-0" disabled={!draft.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

// Suggested replies sit in the composer so a clickable demo doesn't require
// typing. The stalled driveway is the one thread where the wrong suggestion
// would undo the product's argument — so that recipient is called out below.
function suggestedReplies(_toId: string): string[] {
  // TODO: return 0–2 short operational lines for this recipient.
  // If _toId === 'p-vasquez', keep it diagnostic (the gap, the distance).
  // Do not suggest claiming or staffing Eleanor's driveway.
  return [];
}
