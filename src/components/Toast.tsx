// Toast host (spec §8.3). Bottom-right paper flyer, stamp left border,
// mono uppercase, slides up + fades. Auto-dismiss is handled in DemoState.

import { useDemo } from '../state/DemoState';

export function Toast() {
  const { toast, toastNonce } = useDemo();
  if (toast === null) return null;
  return (
    <div
      // key on the nonce so re-fired toasts replay the entrance animation
      key={toastNonce}
      className="animate-toast-in fixed bottom-6 right-6 z-50 max-w-sm border border-warm-rule border-l-[3px] border-l-warm-stamp bg-[#fbf6ea] px-4 py-3 font-mono text-xs uppercase tracking-wider text-warm-ink shadow-lg"
      role="status"
    >
      {toast}
    </div>
  );
}
