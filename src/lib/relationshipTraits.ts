import { getHeavenlyStemYinYang } from 'manseryeok';
import type { Saju } from '../types';
import type { Evidence, RelationshipTraits, TraitKey, TraitValue } from '../types/report';
import { elements } from '../data/zodiac';
import { elementProfiles, type PersonAxis } from '../data/traitRules';
import { evidenceDescriptions as text } from '../data/evidenceDescriptions';
import { pairRelations, sharedTriples } from '../data/branchRelations';
import { elementRelation } from './compatibility';
const bounded = (v: number) => Math.round(Math.max(0, Math.min(100, v)));
export function buildRelationshipTraits(
  p: Saju,
  c: Saju,
): { traits: RelationshipTraits; evidence: Evidence[] } {
  const evidence: Evidence[] = [];
  const profile = (s: Saju, who: 'parent' | 'child') => {
    const label = who === 'parent' ? '부모' : '아이';
    const pillars = Object.values(s.pillars),
      total = pillars.length * 2;
    const yang =
      pillars.filter((x) => getHeavenlyStemYinYang(x.heavenlyStem) === '양').length /
      pillars.length;
    evidence.push(
      {
        id: `${who}-day`,
        title: `${label}의 일간`,
        fact: `${s.pillars.day.heavenlyStem} · ${s.dayElement} 오행`,
        interpretation: `${text.elementMetaphors[s.dayElement]}를 출발점으로 삼았습니다. ${text.day}`,
      },
      {
        id: `${who}-elements`,
        title: `${label}의 오행 구성`,
        fact:
          elements.map((e) => `${e} ${s.elements[e]}개`).join(' · ') +
          ` (총 ${total}개${s.unknownTime ? ', 시주 제외' : ''})`,
        interpretation: text.distribution,
      },
      {
        id: `${who}-yin-yang`,
        title: `${label} 천간의 음양`,
        fact: `사용한 천간 ${pillars.length}개 중 양 ${Math.round(yang * pillars.length)}개`,
        interpretation: text.yinYang,
      },
    );
    const values = {} as Record<PersonAxis, number>;
    for (const axis of [
      'speed',
      'control',
      'autonomy',
      'expression',
      'explanation',
      'order',
    ] as const) {
      const mix = elements.reduce(
        (n, e) => n + (elementProfiles[e][axis] * s.elements[e]) / total,
        0,
      );
      values[axis] = bounded(
        0.55 * elementProfiles[s.dayElement][axis] +
          0.45 * mix +
          (['speed', 'expression'].includes(axis) ? (yang - 0.5) * 10 : 0),
      );
    }
    return values;
  };
  const pv = profile(p, 'parent'),
    cv = profile(c, 'child');
  const traits = {} as RelationshipTraits;
  const put = (key: TraitKey, value: number, ids: string[], ruleId: string) => {
    traits[key] = { value: bounded(value), evidenceIds: ids, ruleId };
  };
  const person = (side: 'parent' | 'child', v: Record<PersonAxis, number>) => {
    const ids = [`${side}-day`, `${side}-elements`];
    const axes = [
      ['Speed', 'speed'],
      [
        side === 'parent' ? 'ControlNeed' : 'AutonomyNeed',
        side === 'parent' ? 'control' : 'autonomy',
      ],
      ['EmotionExpression', 'expression'],
      ['CommunicationStyle', 'explanation'],
      ['OrderNeed', 'order'],
    ] as const;
    for (const [suffix, axis] of axes)
      put(
        `${side}${suffix}` as TraitKey,
        v[axis],
        ['speed', 'expression'].includes(axis) ? [...ids, `${side}-yin-yang`] : ids,
        `element-blend:${axis}:v1`,
      );
    put(
      `${side}ConflictStyle`,
      0.6 * v.expression + 0.4 * v.speed,
      [...ids, `${side}-yin-yang`],
      'expression-speed:60/40',
    );
    put(
      `${side}RecoverySpeed`,
      0.5 * v.expression + 0.5 * v.speed,
      [...ids, `${side}-yin-yang`],
      'expression-speed:50/50',
    );
  };
  person('parent', pv);
  person('child', cv);
  let tension = 0,
    bond = 0;
  const relationIds: string[] = [];
  const weights = { 육합: 0, 충: 1, 형: 0.55, 파: 0.35, 해: 0.45 };
  for (const [pk, a] of Object.entries(p.pillars))
    for (const [ck, b] of Object.entries(c.pillars)) {
      const rs = pairRelations(a.earthlyBranch, b.earthlyBranch);
      for (const r of rs) {
        const id = `branch-${pk}-${ck}-${r}`;
        relationIds.push(id);
        tension += weights[r];
        if (r === '육합') bond++;
        evidence.push({
          id,
          title: `${text.pillarNames[pk as keyof typeof text.pillarNames]} × ${text.pillarNames[ck as keyof typeof text.pillarNames]} · ${r}`,
          fact: `부모 ${text.hanja[a.earthlyBranch]}(${a.earthlyBranch})와 아이 ${text.hanja[b.earthlyBranch]}(${b.earthlyBranch})의 ${r}`,
          interpretation: text.relations[r],
        });
      }
    }
  const pb = Object.values(p.pillars).map((x) => x.earthlyBranch),
    cb = Object.values(c.pillars).map((x) => x.earthlyBranch);
  for (const triple of sharedTriples(pb, cb)) {
    const id = `triple-${triple}`;
    relationIds.push(id);
    bond += 1.5;
    evidence.push({
      id,
      title: '두 원국에 모인 삼합',
      fact: `${triple} 세 지지가 모두 존재하며 양쪽 원국에서 이 그룹에 기여합니다.`,
      interpretation: text.relations.삼합,
    });
  }
  if (!relationIds.length) {
    relationIds.push('branches-neutral');
    evidence.push({
      id: 'branches-neutral',
      title: '지지 교차 비교',
      fact: text.noRelation,
      interpretation: text.noRelationInterpretation,
    });
  }
  const denom = pb.length * cb.length;
  const relation = elementRelation(p.dayElement, c.dayElement);
  evidence.push({
    id: 'day-relation',
    title: '두 사람의 일간 오행 관계',
    fact: `부모 ${p.dayElement} · 아이 ${c.dayElement}: ${text.dayRelation[relation]}`,
    interpretation:
      '상생은 이어주는 이미지, 상극은 방향을 조절하는 이미지로 읽습니다. 상극이라고 나쁜 관계이거나 애정이 적다는 뜻은 아닙니다.',
  });
  const diff =
    elements.reduce(
      (n, e) => n + Math.abs(p.elements[e] / (pb.length * 2) - c.elements[e] / (cb.length * 2)),
      0,
    ) / 2;
  const complement =
    elements.reduce(
      (n, e) =>
        n +
        Math.min(
          p.elements[e] / (pb.length * 2),
          Math.max(0, 0.2 - c.elements[e] / (cb.length * 2)),
        ) +
        Math.min(
          c.elements[e] / (cb.length * 2),
          Math.max(0, 0.2 - p.elements[e] / (pb.length * 2)),
        ),
      0,
    ) / 0.8;
  evidence.push({
    id: 'element-comparison',
    title: '오행 구성의 닮음과 보완',
    fact: `구성 유사 지표 ${bounded((1 - diff) * 100)} / 빈자리 보완 지표 ${bounded(complement * 100)} (통계가 아닌 계산 지표)`,
    interpretation: text.complement,
  });
  put(
    'similarityLevel',
    (1 - diff) * 100,
    ['parent-elements', 'child-elements', 'element-comparison'],
    'distribution-distance:v1',
  );
  put(
    'complementLevel',
    complement * 100,
    ['parent-elements', 'child-elements', 'element-comparison'],
    'missing-fifths:v1',
  );
  put(
    'frictionLevel',
    (tension / denom) * 150 + (relation === 'control' ? 12 : 0),
    [...relationIds, 'day-relation'],
    'branch-tension:v1',
  );
  put(
    'bondLevel',
    (bond / denom) * 180 + (relation === 'support' ? 20 : 0),
    [...relationIds, 'day-relation'],
    'branch-bond:v1',
  );
  for (const k of ['year', 'day'] as const) {
    const clash = pairRelations(p.pillars[k].earthlyBranch, c.pillars[k].earthlyBranch).includes(
      '충',
    );
    put(
      `${k}Clash`,
      clash ? 100 : 0,
      clash ? [`branch-${k}-${k}-충`] : relationIds,
      'same-pillar-clash:v1',
    );
  }
  return { traits, evidence };
}
export const valueOf = (traits: RelationshipTraits, key: TraitKey) => traits[key].value;
export type { TraitValue };
