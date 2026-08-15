// Formatting + civil-day date math.
// DEMO_TODAY is fixed (spec §2). We never call new Date() for display logic;
// all date arithmetic is done on the calendar (Y-M-D) parts directly.

const MON_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];
const MON_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
// Index 0 corresponds to the civil day number 0 (1970-01-01), a Thursday.
const WEEKDAYS = ['THU', 'FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED'];

interface Ymd {
  y: number;
  m: number; // 1-12
  d: number;
}

export function parseISODate(iso: string): Ymd {
  const datePart = iso.slice(0, 10);
  const [y, m, d] = datePart.split('-').map(Number);
  return { y, m, d };
}

// Days since 1970-01-01 (Howard Hinnant's days_from_civil). Pure integer math.
export function daysFromCivil(y: number, m: number, d: number): number {
  const yy = m <= 2 ? y - 1 : y;
  const era = Math.floor((yy >= 0 ? yy : yy - 399) / 400);
  const yoe = yy - era * 400;
  const doy = Math.floor((153 * (m > 2 ? m - 3 : m + 9) + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

export function dayNumber(iso: string): number {
  const { y, m, d } = parseISODate(iso);
  return daysFromCivil(y, m, d);
}

export function daysBetween(aIso: string, bIso: string): number {
  return dayNumber(bIso) - dayNumber(aIso);
}

export function weekday(iso: string): string {
  const n = dayNumber(iso);
  return WEEKDAYS[((n % 7) + 7) % 7];
}

// "THU 12 MAR 2026"
export function fmtStatusDate(iso: string): string {
  const { y, m, d } = parseISODate(iso);
  return `${weekday(iso)} ${d} ${MON_SHORT[m - 1]} ${y}`;
}

// "12 MAR 2026" / "14 JUN 2024"
export function fmtShort(iso: string): string {
  const { y, m, d } = parseISODate(iso);
  return `${d} ${MON_SHORT[m - 1]} ${y}`;
}

// "24 February" (no year)
export function fmtLongNoYear(iso: string): string {
  const { m, d } = parseISODate(iso);
  return `${d} ${MON_LONG[m - 1]}`;
}

// "5 March 2026"
export function fmtLongYear(iso: string): string {
  const { y, m, d } = parseISODate(iso);
  return `${d} ${MON_LONG[m - 1]} ${y}`;
}

// "MARCH 2026"
export function fmtMonthYearUpper(iso: string): string {
  const { y, m } = parseISODate(iso);
  return `${MON_LONG[m - 1].toUpperCase()} ${y}`;
}

// Compact operational duration: "45 MIN", "1 HR", "3 HR", "1H 30M".
export function fmtDuration(min: number): string {
  if (min < 60) return `${min} MIN`;
  const h = Math.floor(min / 60);
  const rem = min % 60;
  if (rem === 0) return `${h} HR`;
  return `${h}H ${rem}M`;
}

// Percentage from a 0..1 fraction, one decimal place: "90.7%"
export function fmtPct1(fraction: number): string {
  return `${(fraction * 100).toFixed(1)}%`;
}

// Percentage from a 0..1 fraction, integer: "76%"
export function fmtPctInt(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

// "posted N days ago" helper — pure calendar difference against a fixed today.
export function daysSince(iso: string, todayIso: string): number {
  return daysBetween(iso, todayIso);
}
