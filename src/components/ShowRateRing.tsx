// ShowRateRing (spec §6.5). SVG circular arc, mono % in the center.
// value is a percentage number (0–100).

export function ShowRateRing({ value, size = 96 }: { value: number; size?: number }) {
  const stroke = Math.max(4, Math.round(size * 0.08));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (clamped / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2A3441" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#3FA66A"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <span
        className="absolute font-mono font-medium text-ops-text"
        style={{ fontSize: size * 0.24 }}
      >
        {Math.round(clamped)}%
      </span>
    </div>
  );
}
