// Toast host (spec §8.3). Bottom-right, raised surface, amber left border,
// mono uppercase, slides up + fades. Auto-dismiss is handled in DemoState.

import { useDemo } from '../state/DemoState';

export function Toast() {
  const { toast, toastNonce } = useDemo();
  if (toast === null) return null;
  return (
    <div
      // key on the nonce so re-fired toasts replay the entrance animation
      key={toastNonce}
      className="animate-toast-in fixed bottom-6 right-6 z-50 max-w-sm border border-ops-border border-l-[3px] border-l-ops-accent bg-ops-raised px-4 py-3 font-mono text-xs uppercase tracking-wider text-ops-text"
      role="status"
    >
      {toast}
    </div>
  );
}
