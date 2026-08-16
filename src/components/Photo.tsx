// Polaroid-style print pinned to the cork board (Increment 2 §3.2).
// Photographs are evidence in the record, not stock. If the file is not in
// SHIPPED_PHOTOS, render nothing — no placeholder, no broken-image icon.

interface PhotoProps {
  src: string;
  alt: string;
  caption: string;
  tilt?: number;
  width?: 'sm' | 'md' | 'lg';
  fastener?: 'pin' | 'tape' | 'none';
}

const WIDTH_PX = { sm: 180, md: 260, lg: 420 } as const;

// Filenames that actually ship in public/photos/. ramp-finished.jpg is reserved
// and deliberately absent; adding its name here is the only change needed later.
const SHIPPED_PHOTOS = new Set([
  'flood-interior.jpg',
  'muckout.jpg',
  'debris-carry.jpg',
  'debris-haul.jpg',
  'sandbag-line.jpg',
]);

function filenameOf(src: string): string {
  const slash = src.lastIndexOf('/');
  return slash === -1 ? src : src.slice(slash + 1);
}

export function Photo({
  src,
  alt,
  caption,
  tilt = 0,
  width = 'md',
  fastener = 'pin',
}: PhotoProps) {
  if (!SHIPPED_PHOTOS.has(filenameOf(src))) return null;

  const w = WIDTH_PX[width];
  const inner = w - 24;
  const innerH = Math.round((inner * 3) / 4);

  return (
    <figure
      className="board-flyer relative inline-block shrink-0"
      style={{
        width: w,
        backgroundColor: '#F4EFE4',
        padding: '12px 12px 0',
        ['--flyer-tilt' as string]: `${tilt}deg`,
        ['--photo-tilt' as string]: `${tilt}deg`,
      }}
    >
      {fastener === 'pin' ? (
        <span className="board-pin" style={{ backgroundColor: '#C4544A' }} aria-hidden />
      ) : null}
      {fastener === 'tape' ? <span className="board-tape" aria-hidden /> : null}
      <img
        src={src}
        alt={alt}
        width={inner}
        height={innerH}
        loading="lazy"
        className="aspect-[4/3] w-full object-cover"
        style={{ filter: 'sepia(0.18) saturate(0.85) contrast(1.04) brightness(1.02)' }}
      />
      <figcaption className="font-hand flex h-[44px] items-center justify-center px-2 text-center text-[0.8125rem] font-normal leading-tight text-warm-ink-2">
        {caption}
      </figcaption>
    </figure>
  );
}
