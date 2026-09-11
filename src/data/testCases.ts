import type { PersonInput } from '../types';
const parent: PersonInput = {
  role: '엄마',
  nickname: '엄마',
  calendar: 'solar',
  year: '1990',
  month: '6',
  day: '15',
  time: '11:30',
  unknownTime: false,
  leapMonth: false,
};
const child: PersonInput = {
  role: '딸',
  nickname: '서윤',
  calendar: 'solar',
  year: '2020',
  month: '8',
  day: '20',
  time: '09:00',
  unknownTime: false,
  leapMonth: false,
};
export const testCases = [
  { name: '말띠 엄마 + 쥐띠 딸', parent, child },
  { name: '같은 띠 부모 + 자녀', parent, child: { ...child, year: '2014' } },
  {
    name: '출생시간 모름',
    parent: { ...parent, unknownTime: true, time: '' },
    child: { ...child, unknownTime: true, time: '' },
  },
  {
    name: '음력 입력',
    parent: {
      ...parent,
      year: '1992',
      month: '9',
      day: '29',
      calendar: 'lunar' as const,
      time: '05:30',
    },
    child: { ...child, month: '4', day: '1', calendar: 'lunar' as const, leapMonth: true },
  },
  {
    name: '입춘 직전',
    parent,
    child: { ...child, year: '2024', month: '2', day: '4', time: '17:26' },
  },
  {
    name: '입춘 직후',
    parent,
    child: { ...child, year: '2024', month: '2', day: '4', time: '17:28' },
  },
];
