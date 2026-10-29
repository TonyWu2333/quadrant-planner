/** Calendar days are stored as local `YYYY-MM-DD` strings, independent of time zone shifts. */
export type DateKey = string;

export const WEEKDAYS = '日一二三四五六';
/** Column headers for a Monday-first week. */
export const WEEK_HEADER = ['一', '二', '三', '四', '五', '六', '日'];

const pad = (n: number) => String(n).padStart(2, '0');

export function toKey(d: Date): DateKey {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromKey(key: DateKey): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: DateKey, days: number): DateKey {
  const d = fromKey(key);
  d.setDate(d.getDate() + days);
  return toKey(d);
}

export const todayKey = () => toKey(new Date());

/** "今天" / "明天" / "昨天", otherwise "10月31日". */
export function relativeLabel(key: DateKey): string {
  const today = todayKey();
  if (key === today) return '今天';
  if (key === addDays(today, 1)) return '明天';
  if (key === addDays(today, -1)) return '昨天';
  const d = fromKey(key);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

/** "10月29日 · 星期四" */
export function longLabel(key: DateKey): string {
  const d = fromKey(key);
  return `${d.getMonth() + 1}月${d.getDate()}日 · 星期${WEEKDAYS[d.getDay()]}`;
}

/** The 42 days (6 Monday-first weeks) shown for the month containing `month`. */
export function monthGrid(month: Date): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7; // days since Monday
  return Array.from({ length: 42 }, (_, i) => new Date(first.getFullYear(), first.getMonth(), i - offset + 1));
}
