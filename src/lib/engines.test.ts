import { describe, it, expect } from 'vitest';
import { calculateSaju } from './saju';
import { branchAffinity, compatibility } from './compatibility';
import { pairRelations, sharedTriples } from '../data/branchRelations';
import { testCases } from '../data/testCases';
import { createShareUrl, readSharedResult, sharePayload } from '../utils/share';
import { familyName } from '../data/relationshipTypes';
const { parent, child } = testCases[0];
const calculate = (p = parent, c = child) =>
  compatibility(p, c, calculateSaju(p), calculateSaju(c));
describe('사주 계산: manseryeok 2.0', () => {
  it('말띠 엄마 + 쥐띠 딸, 자오충', () => {
    const p = calculateSaju(parent),
      c = calculateSaju(child);
    expect(p.zodiac).toBe('말');
    expect(c.zodiac).toBe('쥐');
    expect(p.pillars.year).toEqual({ heavenlyStem: '경', earthlyBranch: '오' });
    expect(pairRelations(p.pillars.year.earthlyBranch, c.pillars.year.earthlyBranch)).toContain(
      '충',
    );
    expect(calculate().title).toBe('불꽃 모녀');
  });
  it('같은 띠', () => {
    const t = testCases[1];
    expect(calculateSaju(t.parent).zodiac).toBe(calculateSaju(t.child).zodiac);
  });
  it('미상 시주 및 해당 오행 제외; 잔존 time 값에 영향받지 않음', () => {
    const p = calculateSaju({ ...parent, unknownTime: true, time: '23:59' });
    expect(p.pillars.hour).toBeUndefined();
    expect(Object.values(p.elements).reduce((a, b) => a + b, 0)).toBe(6);
    expect(p).toEqual(calculateSaju({ ...parent, unknownTime: true, time: '00:00' }));
    expect(calculateSaju(parent).pillars.hour).toBeDefined();
    expect(Object.values(calculateSaju(parent).elements).reduce((a, b) => a + b, 0)).toBe(8);
  });
  it('음력과 대응 양력은 동일 원국', () => {
    const p = testCases[3].parent;
    expect(calculateSaju(p)).toEqual(
      calculateSaju({ ...p, calendar: 'solar', month: '10', day: '24' }),
    );
  });
  it('2020 윤4월 1일 = 2020-05-23', () => {
    const c = testCases[3].child;
    expect(calculateSaju(c)).toEqual(
      calculateSaju({ ...c, calendar: 'solar', leapMonth: false, month: '5', day: '23' }),
    );
  });
  it('입춘 17:27 KST 경계 전후 연주·월주 변경', () => {
    const before = calculateSaju(testCases[4].child),
      after = calculateSaju(testCases[5].child);
    expect(before.zodiac).toBe('토끼');
    expect(after.zodiac).toBe('용');
    expect(before.pillars.month).not.toEqual(after.pillars.month);
    expect(calculateSaju({ ...testCases[4].child, unknownTime: true }).boundaryUncertain).toBe(
      true,
    );
  });
  it.each([
    { month: '2', day: '30' },
    { month: '13' },
    { day: '0' },
    { year: '1899' },
    { year: '2101' },
    { year: '2050' },
    { time: '24:00' },
    { time: '12:60' },
    { nickname: ' ' },
    { year: '2000.1' },
    { calendar: 'lunar' as const, year: '2021', month: '4', day: '1', leapMonth: true },
  ])('잘못된 입력 거부: %j', (patch) => {
    expect(() => calculateSaju({ ...parent, ...patch })).toThrow();
  });
});
describe('지지 관계 및 결정론적 케미', () => {
  it('육합/형/파/해를 개별 인식', () => {
    expect(pairRelations('자', '축')).toContain('육합');
    expect(pairRelations('자', '묘')).toContain('형');
    expect(pairRelations('자', '유')).toContain('파');
    expect(pairRelations('자', '미')).toContain('해');
    expect(pairRelations('진', '진')).toContain('형');
    expect(branchAffinity('자', '오')).toBe(branchAffinity('오', '자'));
  });
  it('삼합은 세 종류의 지지가 모두 있어야 성립', () => {
    expect(sharedTriples(['신'], ['자'])).toEqual([]);
    expect(sharedTriples(['신', '자'], ['진'])).toEqual(['신자진']);
    expect(sharedTriples(['신', '자', '진'], ['묘'])).toEqual([]);
  });
  it.each(testCases)('$name 반복 입력 시 완전히 동일', ({ parent, child }) => {
    const a = calculate(parent, child);
    for (let i = 0; i < 10; i++) expect(calculate(parent, child)).toEqual(a);
    expect(a.score).toBeGreaterThanOrEqual(45);
    expect(a.score).toBeLessThanOrEqual(98);
    expect(new Set(Object.values(a.metrics)).size).toBeGreaterThan(1);
  });
  it('부모 및 자녀 성별·별명은 점수에 영향 없음', () => {
    const a = calculate(),
      b = calculate({ ...parent, role: '아빠', nickname: '별명 변경' }, { ...child, role: '아들' });
    expect(b.score).toBe(a.score);
    expect(b.metrics).toEqual(a.metrics);
    expect(b.title).toBe('불꽃 부자');
    expect([
      familyName('엄마', '딸'),
      familyName('엄마', '아들'),
      familyName('아빠', '딸'),
      familyName('아빠', '아들'),
    ]).toEqual(['모녀', '모자', '부녀', '부자']);
  });
  it('여러 출생일의 점수 범위와 변별성', () => {
    const scores = new Set<number>();
    for (let month = 1; month <= 12; month++)
      for (let day = 1; day <= 28; day += 3) {
        const r = calculate(parent, { ...child, month: String(month), day: String(day) });
        scores.add(r.score);
        for (const n of [r.score, ...Object.values(r.metrics)]) {
          expect(n).toBeGreaterThanOrEqual(45);
          expect(n).toBeLessThanOrEqual(98);
        }
      }
    expect(scores.size).toBeGreaterThan(8);
  });
  it('한쪽 출생시간만 없어도 정상 처리', () => {
    expect(calculate({ ...parent, unknownTime: true }).unknownTime).toBe(true);
  });
});
describe('공유 데이터 개인정보 경계', () => {
  it('유니코드 별명 포함 결과 링크 왕복 복원', () => {
    const r = calculate({ ...parent, nickname: '엄마 🌷' }),
      url = new URL(createShareUrl(r, 'https://example.com/?birth=private#old'));
    expect(url.search).toBe('');
    expect(readSharedResult(url.hash)).toEqual(r);
    expect(url.href.length).toBeLessThan(16000);
  });
  it('allowlist 직렬화: raw birth info는 추가 주입되어도 제외', () => {
    const r = { ...calculate(), birth: parent, year: '1990', time: '11:30' };
    const data = JSON.stringify(sharePayload(r));
    for (const key of ['year', 'month', 'day', 'time', 'birth', 'calendar', 'pillars'])
      expect(data).not.toContain(`"${key}":`);
    expect(data).not.toContain('1990');
    expect(data).not.toContain('11:30');
  });
  it.each(['#result=garbage', '#result=', '#!wrong', '#result=' + 'a'.repeat(16001)])(
    '손상되거나 과도한 링크 거부',
    (hash) => expect(readSharedResult(hash)).toBeNull(),
  );
  it('범위 밖 점수나 잘못된 역할 거부', () => {
    const r = calculate();
    expect(
      readSharedResult(new URL(createShareUrl({ ...r, score: 999 }, 'https://example.com')).hash),
    ).toBeNull();
  });
});
