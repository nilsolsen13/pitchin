// Civic slogan. Lives next to the masthead and in the site footer —
// never inside the logo lockup (PitchIn_logo_spec.md).

export const TAGLINE =
  'See a Need, Meet a Need. One Community - Small Acts, Lasting Impacts';

export function SiteFooter({ surface }: { surface: 'warm' | 'wood' }) {
  return (
    <footer
      className={
        surface === 'warm'
          ? 'mt-8 text-center font-mono text-sm text-warm-ink-2'
          : 'border-t border-[#2a1a0c] bg-[#3a2410] py-4 text-center font-mono text-xs text-[#d4c4a8]'
      }
    >
      {TAGLINE}
    </footer>
  );
}
