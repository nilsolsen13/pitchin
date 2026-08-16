// Product wordmark. Handwriting (Kalam) so "PitchIn" reads as mixed case —
// Oswald + uppercase collapsed it to PITCHIN, which hides the camelCase.

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`.trim()}>
      PitchIn
    </span>
  );
}
