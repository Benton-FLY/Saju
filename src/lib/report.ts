import type { ParentRole, PersonInput } from '../types';
import type { CopyRule, RelationshipReport, Selection } from '../types/report';
import { calculateSaju } from './saju';
import { compatibility } from './compatibility';
import { buildRelationshipTraits } from './relationshipTraits';
import { rankCopies, selectCopy, type CopyContext } from './copySelector';
import { relationshipArchetypes } from '../data/relationshipArchetypes';
import { conflictTriggers } from '../data/conflictTriggers';
import { naggingTranslator } from '../data/naggingTranslator';
import { childPerspective } from '../data/childPerspective';
import { reconciliationTips } from '../data/reconciliationTips';
import { powerPhrases } from '../data/powerPhrases';
import { formatCopy, serviceCopy } from '../data/serviceCopy';
import { ageAt, todayKst } from '../utils/age';
export function createReport(
  parent: PersonInput,
  child: PersonInput,
  asOfDate = todayKst(),
): RelationshipReport {
  const p = calculateSaju(parent),
    c = calculateSaju(child);
  const base = compatibility(parent, child, p, c);
  const { traits, evidence } = buildRelationshipTraits(p, c);
  const age = ageAt(child, asOfDate);
  const context: CopyContext = { traits, age, parentType: parent.role as ParentRole };
  const fill = (s: string) => formatCopy(s, parent.role, child.role);
  const choose = <T>(data: CopyRule<T>[]): Selection<T> => {
    const item = rankCopies(data, context)[0];
    if (!item)
      throw new Error('이 연령에 맞는 문장을 준비하지 못했어요. 입력을 다시 확인해주세요.');
    return selectCopy(item, context, fill);
  };
  const rankedTriggers = rankCopies(conflictTriggers, context);
  const categories = new Set<string>();
  const triggers = rankedTriggers
    .filter((x) => {
      if (categories.has(x.tags[0])) return false;
      categories.add(x.tags[0]);
      return true;
    })
    .slice(0, 3)
    .map((x) => selectCopy(x, context, fill));
  const perspectives = rankCopies(childPerspective, context)
    .slice(0, 3)
    .map((x) => selectCopy(x, context, fill));
  const labels = serviceCopy.result.scoreLabels;
  return {
    version: 2,
    modelVersion: 'traits-v1',
    asOfDate,
    age,
    parent: base.parent,
    child: base.child,
    traits,
    evidence,
    archetype: choose(relationshipArchetypes),
    triggers,
    translator: choose(naggingTranslator),
    perspectives,
    reconciliation: choose(reconciliationTips),
    powerPhrase: choose(powerPhrases),
    score: base.score,
    indicators: [
      { key: 'connection', label: labels[0], value: base.metrics.conversation },
      { key: 'rhythm', label: labels[1], value: base.metrics.rhythm },
      {
        key: 'control',
        label: labels[2],
        value: Math.round(
          ((traits.parentControlNeed.value + traits.childAutonomyNeed.value) / 2) * 0.7 +
            traits.frictionLevel.value * 0.3,
        ),
        inverse: true,
      },
      { key: 'recovery', label: labels[3], value: base.metrics.recovery },
      { key: 'complement', label: labels[4], value: traits.complementLevel.value },
    ],
    unknownTime: base.unknownTime,
    boundaryUncertain: base.boundaryUncertain,
  };
}
