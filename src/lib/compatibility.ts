import type { EarthlyBranch } from 'manseryeok';
import type { Element, PersonInput, Result, Saju } from '../types';
import { elements } from '../data/zodiac';
import { pairRelations, sharedTriples } from '../data/branchRelations';
import { familyName, relationshipTypes } from '../data/relationshipTypes';
import { elementCopy, frictionCopy } from '../data/resultMessages';

const clamp = (n: number) => Math.max(45, Math.min(98, Math.round(n)));
const weights = { 육합: 1, 충: -1, 형: -0.55, 파: -0.35, 해: -0.45 };
export function branchAffinity(a: EarthlyBranch, b: EarthlyBranch) {
  return Math.max(
    -1,
    Math.min(
      1,
      pairRelations(a, b).reduce((n, r) => n + weights[r], a === b ? 0.15 : 0),
    ),
  );
}
export function elementRelation(a: Element, b: Element) {
  const delta = (elements.indexOf(b) - elements.indexOf(a) + 5) % 5;
  return delta === 0 ? 'same' : delta === 1 || delta === 4 ? 'support' : 'control';
}
export function compatibility(
  parentInput: PersonInput,
  childInput: PersonInput,
  p: Saju,
  c: Saju,
): Result {
  const pb = Object.values(p.pillars).map((x) => x.earthlyBranch),
    cb = Object.values(c.pillars).map((x) => x.earthlyBranch);
  const year = branchAffinity(pb[0], cb[0]);
  const all = pb.flatMap((a) => cb.map((b) => branchAffinity(a, b)));
  const triple = sharedTriples(pb, cb).length;
  const branches = Math.max(
    -1,
    Math.min(1, all.reduce((a, b) => a + b, 0) / all.length + triple * 0.15),
  );
  const relation = elementRelation(p.dayElement, c.dayElement);
  const day = relation === 'support' ? 1 : relation === 'same' ? 0.45 : -0.45;
  const totalP = pb.length * 2,
    totalC = cb.length * 2;
  // How much does each person provide an element that the other lacks? 0..1.
  const complement = elements.reduce(
    (sum, e) =>
      sum +
      Math.min(p.elements[e] / totalP, Math.max(0, 0.2 - c.elements[e] / totalC)) +
      Math.min(c.elements[e] / totalC, Math.max(0, 0.2 - p.elements[e] / totalP)),
    0,
  );
  const balance = Math.min(1, complement / 0.8);
  const hour =
    p.pillars.hour && c.pillars.hour
      ? branchAffinity(p.pillars.hour.earthlyBranch, c.pillars.hour.earthlyBranch)
      : undefined;
  const month = branchAffinity(p.pillars.month.earthlyBranch, c.pillars.month.earthlyBranch);
  const dayBranch = branchAffinity(p.pillars.day.earthlyBranch, c.pillars.day.earthlyBranch);
  const weighted =
    0.2 * year +
    0.3 * branches +
    0.2 * day +
    0.2 * (balance * 2 - 1) +
    (hour === undefined ? 0 : 0.1 * hour);
  const core = 76 + (20 * weighted) / (hour === undefined ? 0.9 : 1);
  const metrics = {
    personality: clamp(core * 0.5 + (77 + 12 * day + 6 * dayBranch) * 0.5),
    conversation: clamp(core * 0.5 + (76 + 13 * branches + 7 * day) * 0.5),
    rhythm: clamp(core * 0.45 + (74 + 12 * month + (hour === undefined ? 0 : 10 * hour)) * 0.55),
    recovery: clamp(core * 0.5 + (76 + 13 * balance + 6 * branches) * 0.5),
    growth: clamp(
      core * 0.4 + (79 + 14 * balance + (relation === 'control' ? 4 : 0) + 3 * triple) * 0.6,
    ),
  };
  const score = clamp(core * 0.65 + (Object.values(metrics).reduce((a, b) => a + b, 0) / 5) * 0.35);
  const clash =
    pairRelations(p.pillars.year.earthlyBranch, c.pillars.year.earthlyBranch).includes('충') ||
    pairRelations(p.pillars.day.earthlyBranch, c.pillars.day.earthlyBranch).includes('충');
  const id = clash
    ? 'spark'
    : score >= 85
      ? 'perfect'
      : balance > 0.55
        ? 'growth'
        : p.zodiac === c.zodiac
          ? 'similar'
          : score >= 74
            ? 'steady'
            : 'learning';
  const type = relationshipTypes.find((x) => x.id === id)!;
  const fill = (s: string) =>
    s
      .replaceAll('{family}', familyName(parentInput.role, childInput.role))
      .replaceAll('{parent}', parentInput.role)
      .replaceAll('{child}', childInput.role);
  const pCopy = elementCopy[p.dayElement],
    cCopy = elementCopy[c.dayElement];
  return {
    version: 1,
    parent: {
      nickname: parentInput.nickname.trim(),
      role: parentInput.role,
      zodiac: p.zodiac,
      element: p.dayElement,
    },
    child: {
      nickname: childInput.nickname.trim(),
      role: childInput.role,
      zodiac: c.zodiac,
      element: c.dayElement,
    },
    score,
    metrics,
    typeId: id,
    title: fill(type.title),
    subtitle: fill(type.subtitle),
    good: `${parentInput.role}는 ${pCopy.nature} 기운, 아이는 ${cCopy.nature} 기운으로 읽혀요. ${relation === 'same' ? '비슷한 감각을 나눌 때 편안함이 커지는 조합이에요.' : relation === 'support' ? '한 사람의 에너지가 다른 사람의 시도에 힘을 보태는 조합이에요.' : '다른 시선을 보태며 서로의 가능성을 넓혀가는 조합이에요.'} ${cCopy.strength} 순간에 우리만의 케미가 빛나요.`,
    friction: clash
      ? frictionCopy.clash
      : relation === 'control'
        ? frictionCopy.control
        : relation === 'same'
          ? frictionCopy.same
          : frictionCopy.different,
    tip: cCopy.tip,
    wish: cCopy.wish,
    quote: fill(type.quote),
    unknownTime: p.unknownTime || c.unknownTime,
    boundaryUncertain: p.boundaryUncertain || c.boundaryUncertain,
  };
}
