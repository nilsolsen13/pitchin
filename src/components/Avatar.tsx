// CSS initials avatar — no image assets (spec §9.5). Deterministic color per id.

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

const PALETTE = ['#4C8DD9', '#3FA66A', '#E8A33D', '#D9642E', '#8B98A9', '#B07BD9', '#6E9F8E'];

function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function Avatar({
  id,
  name,
  size = 28,
}: {
  id: string;
  name: string;
  size?: number;
}) {
  const bg = colorFor(id);
  return (
    <span
      title={name}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-mono font-medium text-ops-bg"
      style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.4 }}
    >
      {initials(name)}
    </span>
  );
}
