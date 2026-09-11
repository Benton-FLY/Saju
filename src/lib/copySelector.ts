import type { ParentRole } from '../types';
import type { Condition, CopyRule, RelationshipTraits, Selection } from '../types/report';
export interface CopyContext {
  traits: RelationshipTraits;
  age: number;
  parentType: ParentRole;
}
export function matchesCondition(c: Condition, t: RelationshipTraits) {
  const value = t[c.trait].value;
  return (
    (c.min === undefined || value >= c.min) &&
    (c.max === undefined || value <= c.max) &&
    (!c.comparedTo || value - t[c.comparedTo].value >= (c.gap ?? 0))
  );
}
export function eligible<T>(item: CopyRule<T>, ctx: CopyContext) {
  return (
    (!item.ageRange || (ctx.age >= item.ageRange[0] && ctx.age <= item.ageRange[1])) &&
    (!item.parentType || item.parentType === ctx.parentType) &&
    item.conditions.every((c) => matchesCondition(c, ctx.traits))
  );
}
export function rankCopies<T>(items: CopyRule<T>[], ctx: CopyContext) {
  return items
    .filter((item) => eligible(item, ctx))
    .sort(
      (a, b) =>
        b.priority - a.priority ||
        b.conditions.length - a.conditions.length ||
        (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
    );
}
export function selectCopy<T>(
  item: CopyRule<T>,
  ctx: CopyContext,
  fill: (s: string) => string,
): Selection<T> {
  const isGeneral =
    item.conditions.length === 1 &&
    item.conditions[0].trait === 'similarityLevel' &&
    item.conditions[0].min === 0;
  const keys = isGeneral
    ? []
    : [
        ...new Set(
          item.conditions.flatMap((c) => (c.comparedTo ? [c.trait, c.comparedTo] : [c.trait])),
        ),
      ];
  const copy = Object.fromEntries(
    Object.entries(item.copy as Record<string, string>).map(([k, v]) => [k, fill(v)]),
  ) as T;
  return {
    id: item.id,
    tags: item.tags,
    copy,
    trace: {
      traitKeys: keys,
      evidenceIds: [...new Set(keys.flatMap((k) => ctx.traits[k].evidenceIds))],
      ruleId: item.id,
    },
  };
}
