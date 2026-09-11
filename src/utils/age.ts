import { lunarToSolar } from 'manseryeok';
import type { PersonInput } from '../types';
export const todayKst = () =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
/** Explicit evaluation date keeps replays deterministic. Lunar birthdays are converted first. */
export function ageAt(input: PersonInput, asOfDate: string): number {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(asOfDate) ||
    Number.isNaN(Date.parse(asOfDate)) ||
    new Date(asOfDate).toISOString().slice(0, 10) !== asOfDate
  )
    throw new Error('기준 날짜를 확인해주세요.');
  const [y, m, d] = asOfDate.split('-').map(Number);
  const birth =
    input.calendar === 'lunar'
      ? lunarToSolar(Number(input.year), Number(input.month), Number(input.day), input.leapMonth)
      : { year: Number(input.year), month: Number(input.month), day: Number(input.day) };
  const age = y - birth.year - (m < birth.month || (m === birth.month && d < birth.day) ? 1 : 0);
  if (age < 0) throw new Error('기준 날짜보다 나중에 태어난 아이예요.');
  return age;
}
