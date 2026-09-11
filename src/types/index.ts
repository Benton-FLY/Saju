import type { Pillar } from 'manseryeok';
export type Element = '목' | '화' | '토' | '금' | '수';
export type ParentRole = '엄마' | '아빠';
export type ChildRole = '딸' | '아들';
export interface PersonInput {
  role: ParentRole | ChildRole;
  nickname: string;
  calendar: 'solar' | 'lunar';
  year: string;
  month: string;
  day: string;
  time: string;
  unknownTime: boolean;
  leapMonth: boolean;
}
export interface Saju {
  pillars: { year: Pillar; month: Pillar; day: Pillar; hour?: Pillar };
  elements: Record<Element, number>;
  dayElement: Element;
  zodiac: string;
  unknownTime: boolean;
  boundaryUncertain: boolean;
}
export type MetricKey = 'personality' | 'conversation' | 'rhythm' | 'recovery' | 'growth';
export interface DisplayPerson {
  nickname: string;
  role: PersonInput['role'];
  zodiac: string;
  element: Element;
}
export interface Result {
  version: 1;
  parent: DisplayPerson;
  child: DisplayPerson;
  score: number;
  metrics: Record<MetricKey, number>;
  typeId: string;
  title: string;
  subtitle: string;
  good: string;
  friction: string;
  tip: string;
  wish: string;
  quote: string;
  unknownTime: boolean;
  boundaryUncertain: boolean;
}
