import type { Config } from 'tailwindcss';

/**
 * PitchIn design tokens — see PitchIn_MVP_build_spec.md §6.
 *
 * Two palettes, NOT light/dark modes of each other:
 *   ops  — dark, operational. Every screen except / and /wall.
 *   warm — light, letterpress. Landing page and The Wall only.
 *
 * Semantic tokens (surface, primary, rule, …) are driven by CSS custom
 * properties scoped to [data-surface="ops"|"warm"] in src/index.css, so a
 * single component renders correctly on either palette without branching.
 *
 * Do not add a theme toggle. Do not migrate to Tailwind v4.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ─── Palette-aware semantic tokens (preferred in components) ───
        surface: 'var(--surface)',
        raised: 'var(--raised)',
        canvas: 'var(--canvas)',
        rule: 'var(--rule)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        accent: 'var(--accent)',

        // ─── Ops palette (literal, §6.1) ───
        ops: {
          bg: '#0E1116',
          surface: '#161B22',
          raised: '#1C232D',
          border: '#2A3441',
          text: '#E6EDF3',
          'text-2': '#8B98A9',
          'text-3': '#5E6B7D',
          accent: '#E8A33D',
          'accent-dim': '#6B4D1C',
        },

        // ─── Warm palette (literal, §6.2) ───
        warm: {
          paper: '#F4EFE4',
          'paper-deep': '#EAE2D2',
          ink: '#2A2620',
          'ink-2': '#6B6250',
          rule: '#C9BFA9',
          stamp: '#A63D2E',
          green: '#47643F',
        },

        // ─── Status colors (§6.1) ───
        status: {
          open: '#6E7C8C',
          claimed: '#4C8DD9',
          progress: '#E8A33D',
          verified: '#3FA66A',
          missed: '#C4544A',
          blocked: '#C4544A',
        },
        mode: {
          surge: '#D9642E',
          sustainment: '#4C8DD9',
        },
      },

      fontFamily: {
        // Ops UI and warm body
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Every MEASUREMENT renders in mono — show-rate, counts, durations,
        // streak weeks, timestamps, IDs. This single rule does most of the
        // work of making the product read as operational. (§6.3)
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        // The Wall + landing headings only
        display: ['Oswald', 'ui-sans-serif', 'sans-serif'],
        // Wordmark only — mixed-case handwriting so PitchIn ≠ PITCHIN
        hand: ['Kalam', 'cursive'],
      },

      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.375rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },

      borderRadius: {
        ops: '6px',
        warm: '2px',
      },

      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
} satisfies Config;
