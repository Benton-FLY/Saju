import {
  calculateFourPillars,
  getEarthlyBranchElement,
  getHeavenlyStemElement,
  lunarToSolar,
} from 'manseryeok';
import type { PersonInput, Saju } from '../types';
import { zodiac } from '../data/zodiac';

export function calculateSaju(input: PersonInput): Saju {
  const year = Number(input.year),
    month = Number(input.month),
    day = Number(input.day);
  if (!input.nickname.trim() || input.nickname.trim().length > 12)
    throw new Error('별명은 1~12자로 입력해주세요.');
  if (
    !/^\d{4}$/.test(input.year) ||
    !/^\d{1,2}$/.test(input.month) ||
    !/^\d{1,2}$/.test(input.day) ||
    year < 1900 ||
    year > 2100
  )
    throw new Error('생년월일을 확인해주세요. 연도는 1900~2100년까지 입력할 수 있어요.');
  if (!input.unknownTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time))
    throw new Error('태어난 시간을 00:00~23:59로 입력해주세요.');
  const [hour, minute] = input.unknownTime ? [12, 0] : input.time.split(':').map(Number);
  const birth = {
    year,
    month,
    day,
    hour,
    minute,
    isLunar: input.calendar === 'lunar',
    isLeapMonth: input.calendar === 'lunar' && input.leapMonth,
    dayBoundary: 'midnight' as const,
  };
  try {
    const r = calculateFourPillars(birth);
    const solar = birth.isLunar
      ? lunarToSolar(year, month, day, birth.isLeapMonth)
      : { year, month, day };
    const today = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
    const date = `${solar.year}-${String(solar.month).padStart(2, '0')}-${String(solar.day).padStart(2, '0')}`;
    if (date > today) throw new Error('아직 태어나지 않은 날짜예요. 생년월일을 다시 확인해주세요.');
    const pillars = {
      year: r.year,
      month: r.month,
      day: r.day,
      ...(input.unknownTime ? {} : { hour: r.hour }),
    };
    const counts: Saju['elements'] = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    Object.values(pillars).forEach((p) => {
      counts[getHeavenlyStemElement(p.heavenlyStem)]++;
      counts[getEarthlyBranchElement(p.earthlyBranch)]++;
    });
    let boundaryUncertain = false;
    if (input.unknownTime) {
      const early = calculateFourPillars({ ...birth, hour: 0, minute: 0 });
      const late = calculateFourPillars({ ...birth, hour: 23, minute: 59 });
      boundaryUncertain =
        early.year.earthlyBranch !== late.year.earthlyBranch ||
        early.month.earthlyBranch !== late.month.earthlyBranch;
    }
    return {
      pillars,
      elements: counts,
      dayElement: getHeavenlyStemElement(r.day.heavenlyStem),
      zodiac: zodiac[r.year.earthlyBranch],
      unknownTime: input.unknownTime,
      boundaryUncertain,
    };
  } catch (error) {
    if (error instanceof RangeError)
      throw new Error('존재하지 않는 날짜 또는 윤달이에요. 달력과 생년월일을 다시 확인해주세요.');
    throw error;
  }
}
