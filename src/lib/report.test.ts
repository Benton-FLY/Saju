import { describe, it, expect } from 'vitest';
import { createReport } from './report';
import { reportTestCases } from '../data/reportTestCases';
import { relationshipArchetypes } from '../data/relationshipArchetypes';
import { conflictTriggers } from '../data/conflictTriggers';
import { naggingTranslator } from '../data/naggingTranslator';
import { childPerspective } from '../data/childPerspective';
import { reconciliationTips } from '../data/reconciliationTips';
import { powerPhrases } from '../data/powerPhrases';
import { eligible, rankCopies, selectCopy } from './copySelector';
import { calculateSaju } from './saju';
import { buildRelationshipTraits } from './relationshipTraits';
import { ageAt } from '../utils/age';
import { createShareUrl, readSharedResult, sharePayload } from '../utils/share';
import { createShareUrl as createLegacyUrl } from '../utils/legacyShare';
import { compatibility } from './compatibility';
import { pairRelations } from '../data/branchRelations';
const asOf = '2026-09-11';
const reports = reportTestCases.map((t) => createReport(t.parent, t.child, asOf));
const selected = (r: (typeof reports)[number]) => [
  r.archetype,
  ...r.triggers,
  r.translator,
  ...r.perspectives,
  r.reconciliation,
  r.powerPhrase,
];
describe('조건 기반 관계 리포트', () => {
  it('37개 archetype과 27개 연령별 대화 장면', () => {
    expect(relationshipArchetypes.length).toBeGreaterThanOrEqual(30);
    expect(relationshipArchetypes.length).toBeLessThanOrEqual(50);
    expect(naggingTranslator.length).toBeGreaterThanOrEqual(20);
  });
  it.each(reportTestCases)('$name 동일 입력·기준일의 원국, 특성, 카피, 공유는 동일', (t) => {
    const a = createReport(t.parent, t.child, asOf);
    for (let i = 0; i < 5; i++) expect(createReport(t.parent, t.child, asOf)).toEqual(a);
  });
  it('12개 고정 조합의 결과 다양성', () => {
    const stats = {
      archetypes: new Set(reports.map((r) => r.archetype.id)).size,
      scenarios: new Set(reports.map((r) => r.translator.id)).size,
      triggerSets: new Set(reports.map((r) => r.triggers.map((t) => t.id).join(','))).size,
    };
    expect(stats.archetypes).toBeGreaterThanOrEqual(8);
    expect(stats.scenarios).toBeGreaterThanOrEqual(8);
    expect(stats.triggerSets).toBeGreaterThanOrEqual(9);
  });
  it('모든 선택은 실제 조건·연령에 맞으며 근거를 역추적할 수 있음', () => {
    for (const r of reports) {
      const ctx = { traits: r.traits, age: r.age, parentType: r.parent.role as '엄마' | '아빠' };
      const sources = [
        relationshipArchetypes,
        conflictTriggers,
        naggingTranslator,
        childPerspective,
        reconciliationTips,
        powerPhrases,
      ].flat();
      for (const sel of selected(r)) {
        const rule = sources.find((x) => x.id === sel.id)!;
        expect(rule).toBeDefined();
        expect(eligible(rule as (typeof relationshipArchetypes)[number], ctx)).toBe(true);
        for (const id of sel.trace.evidenceIds)
          expect(r.evidence.some((e) => e.id === id)).toBe(true);
      }
      expect(r.triggers.length).toBeGreaterThan(0);
      expect(r.triggers.length).toBeLessThanOrEqual(3);
      expect(new Set(r.triggers.map((t) => t.tags[0])).size).toBe(r.triggers.length);
      expect(r.perspectives.length).toBeGreaterThanOrEqual(2);
      expect(r.perspectives.length).toBeLessThanOrEqual(3);
      for (const t of Object.values(r.traits)) {
        expect(t.value).toBeGreaterThanOrEqual(0);
        expect(t.value).toBeLessThanOrEqual(100);
        for (const id of t.evidenceIds) expect(r.evidence.some((e) => e.id === id)).toBe(true);
      }
    }
  });
  it('근거는 실제 원국의 해당 지지 관계와 일치', () => {
    for (let i = 0; i < reports.length; i++) {
      const r = reports[i],
        p = calculateSaju(reportTestCases[i].parent),
        c = calculateSaju(reportTestCases[i].child);
      for (const e of r.evidence.filter((e) => e.id.startsWith('branch-'))) {
        const [, pk, ck, relation] = e.id.split('-');
        const a = p.pillars[pk as keyof typeof p.pillars],
          b = c.pillars[ck as keyof typeof c.pillars];
        expect(a).toBeDefined();
        expect(b).toBeDefined();
        expect(pairRelations(a!.earthlyBranch, b!.earthlyBranch)).toContain(relation);
      }
    }
    expect(reports[0].evidence.find((e) => e.id === 'branch-year-year-충')?.fact).toContain('午');
    expect(reports[0].evidence.find((e) => e.id === 'branch-year-year-충')?.fact).toContain('子');
  });
  it('시간 미상은 시주 관련 근거를 만들지 않음', () => {
    const r = reports[8];
    expect(r.unknownTime).toBe(true);
    expect(r.evidence.some((e) => e.id.includes('hour'))).toBe(false);
    expect(r.evidence.find((e) => e.id === 'child-elements')?.fact).toContain('총 6개');
  });
  it('3세에게 성적·스마트폰·숙제·학교 장면을 출력하지 않음', () => {
    for (const i of [3, 9]) {
      const r = reports[i];
      expect(r.age).toBe(3);
      expect(JSON.stringify(r.translator.copy)).not.toMatch(/성적|스마트폰|숙제|공부|게임|학교/);
    }
  });
  it('영아 및 성인 나이별 필터', () => {
    expect(reports[7].translator.id).toMatch(/^infant-/);
    expect(reports[7].archetype.id).toBe('infant-signals');
    expect(reports[7].reconciliation.id).toBe('little-repair');
    expect(reports[5].translator.id).toMatch(/^adult-/);
  });
  it('음력 변환 후 만 나이를 계산하고 생일 경계를 반영', () => {
    const t = reportTestCases[10].child;
    expect(ageAt(t, '2026-05-22')).toBe(5);
    expect(ageAt(t, '2026-05-23')).toBe(6);
    expect(() => ageAt(t, '2026-02-30')).toThrow();
    expect(() => ageAt(t, '1900-01-01')).toThrow();
  });
  it('성별·이름은 수치·선택 ID를 바꾸지 않고 호칭만 변경', () => {
    const t = reportTestCases[0],
      a = reports[0],
      b = createReport(
        { ...t.parent, role: '아빠', nickname: '별명' },
        { ...t.child, role: '아들' },
        asOf,
      );
    expect(b.traits).toEqual(a.traits);
    expect(b.archetype.id).toBe(a.archetype.id);
    expect(b.translator.id).toBe(a.translator.id);
    expect(JSON.stringify(b.archetype.copy)).not.toContain('엄마');
  });
  it('메타데이터 parentType·ageRange 필터와 안정적인 ID tie break', () => {
    const r = reports[0],
      ctx = { traits: r.traits, age: r.age, parentType: '엄마' as const },
      base = powerPhrases[0];
    const entries = [
      { ...base, id: 'b', conditions: [], parentType: '아빠' as const },
      { ...base, id: 'z', conditions: [], ageRange: [90, 100] as const },
      { ...base, id: 'a', conditions: [] },
      { ...base, id: 'c', conditions: [] },
    ];
    expect(rankCopies(entries, ctx).map((i) => i.id)).toEqual(['a', 'c']);
    expect(
      selectCopy({ ...base, conditions: [{ trait: 'similarityLevel', min: 0 }] }, ctx, (s) => s)
        .trace.evidenceIds,
    ).toEqual([]);
  });
  it('카피 ID 중복 및 fake statistics 없음', () => {
    const all = [
      ...relationshipArchetypes,
      ...conflictTriggers,
      ...naggingTranslator,
      ...childPerspective,
      ...reconciliationTips,
      ...powerPhrases,
    ];
    expect(new Set(all.map((i) => i.id)).size).toBe(all.length);
    expect(JSON.stringify(all)).not.toMatch(/전국 상위|\d+% 확률|한국 부모 중/);
  });
  it('시간·기기·이름 무작위성을 사용하지 않는 traits', () => {
    const p = calculateSaju(reportTestCases[0].parent),
      c = calculateSaju(reportTestCases[0].child);
    expect(buildRelationshipTraits(p, c)).toEqual(buildRelationshipTraits(p, c));
  });
});
describe('공유 요약 v2와 v1 호환', () => {
  it('PNG와 URL의 공용 payload에 출생 정보·나이·원국·trait·근거가 없음', () => {
    const data = sharePayload({
      ...reports[0],
      secretBirth: reportTestCases[0],
    } as (typeof reports)[number]);
    expect(Object.keys(data).sort()).toEqual([
      'child',
      'parent',
      'phrase',
      'title',
      'trigger',
      'type',
      'version',
    ]);
    const text = JSON.stringify(data);
    for (const key of [
      'year',
      'month',
      'day',
      'time',
      'age',
      'asOfDate',
      'traits',
      'evidence',
      'pillars',
      'secretBirth',
      'unknownTime',
    ])
      expect(text).not.toContain(`"${key}"`);
    expect(text).not.toContain('1990');
    expect(text).not.toContain('11:30');
  });
  it('Unicode·URL roundtrip, query 삭제, 짧은 링크', () => {
    const summary = sharePayload(reports[0]);
    summary.parent.nickname = '엄마 🌷';
    const url = new URL(createShareUrl(summary, 'https://example.com/?birth=private'));
    expect(url.search).toBe('');
    expect(readSharedResult(url.hash)).toEqual(summary);
    expect(url.href.length).toBeLessThan(2000);
  });
  it('기존 v1 공유 링크도 요약으로 복원', () => {
    const t = reportTestCases[0],
      legacy = compatibility(t.parent, t.child, calculateSaju(t.parent), calculateSaju(t.child));
    const url = createLegacyUrl(legacy, 'https://example.com');
    expect(readSharedResult(new URL(url).hash)?.legacy).toBe(true);
  });
  it.each(['#report=nope', '#report=' + 'a'.repeat(6001), '#other', ''])(
    '잘못된 링크 거부: %s',
    (hash) => expect(readSharedResult(hash)).toBeNull(),
  );
  it('긴 nickname 및 타입 위변조 거부', () => {
    const summary = sharePayload(reports[0]);
    summary.parent.nickname = 'a'.repeat(13);
    expect(
      readSharedResult(new URL(createShareUrl(summary, 'https://example.com')).hash),
    ).toBeNull();
  });
});
