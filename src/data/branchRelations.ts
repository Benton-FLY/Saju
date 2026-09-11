import type { EarthlyBranch } from 'manseryeok';
export type Relation = '육합' | '삼합' | '충' | '형' | '파' | '해';
export const relationPairs: Record<Exclude<Relation, '삼합'>, readonly string[]> = {
  육합: ['자축', '인해', '묘술', '진유', '사신', '오미'],
  충: ['자오', '축미', '인신', '묘유', '진술', '사해'],
  형: ['자묘', '인사', '사신', '신인', '축술', '술미', '미축', '진진', '오오', '유유', '해해'],
  파: ['자유', '축진', '인해', '묘오', '사신', '미술'],
  해: ['자미', '축오', '인사', '묘진', '신해', '유술'],
};
export const tripleGroups = ['신자진', '해묘미', '인오술', '사유축'];
export function pairRelations(a: EarthlyBranch, b: EarthlyBranch): Exclude<Relation, '삼합'>[] {
  return (Object.keys(relationPairs) as Exclude<Relation, '삼합'>[]).filter((k) =>
    relationPairs[k].some((p) => p === a + b || p === b + a),
  );
}
// A complete 삼합 requires all three distinct branches, with a contribution from both people.
export function sharedTriples(a: EarthlyBranch[], b: EarthlyBranch[]) {
  return tripleGroups.filter(
    (g) =>
      [...g].every((x) => a.includes(x as EarthlyBranch) || b.includes(x as EarthlyBranch)) &&
      a.some((x) => g.includes(x)) &&
      b.some((x) => g.includes(x)),
  );
}
