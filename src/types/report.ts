import type { DisplayPerson, ParentRole } from './index';
export type TraitKey =
  | 'parentSpeed'
  | 'childSpeed'
  | 'parentControlNeed'
  | 'childAutonomyNeed'
  | 'parentEmotionExpression'
  | 'childEmotionExpression'
  | 'parentConflictStyle'
  | 'childConflictStyle'
  | 'parentRecoverySpeed'
  | 'childRecoverySpeed'
  | 'parentCommunicationStyle'
  | 'childCommunicationStyle'
  | 'parentOrderNeed'
  | 'childOrderNeed'
  | 'similarityLevel'
  | 'complementLevel'
  | 'frictionLevel'
  | 'yearClash'
  | 'dayClash'
  | 'bondLevel';
export interface TraitValue {
  value: number;
  evidenceIds: string[];
  ruleId: string;
}
export type RelationshipTraits = Record<TraitKey, TraitValue>;
export type TriggerCategory =
  | 'SPEED'
  | 'CONTROL'
  | 'INDEPENDENCE'
  | 'EMOTION'
  | 'EXPLANATION'
  | 'ORDER'
  | 'COMPETITION'
  | 'SILENCE'
  | 'CRITICISM'
  | 'EXPECTATION';
export interface Condition {
  trait: TraitKey;
  min?: number;
  max?: number;
  comparedTo?: TraitKey;
  gap?: number;
}
export interface CopyRule<T> {
  id: string;
  tags: string[];
  conditions: Condition[];
  ageRange?: readonly [number, number];
  parentType?: ParentRole;
  priority: number;
  copy: T;
}
export interface ArchetypeCopy {
  title: string;
  subtitle: string;
  scene: string;
  type: string;
}
export interface TriggerCopy {
  title: string;
  explanation: string;
  tryInstead: string;
}
export interface TranslatorCopy {
  scene: string;
  said: string;
  heard: string;
  instead: string;
  why: string;
}
export interface PerspectiveCopy {
  seen: string;
  reframed: string;
  practice: string;
}
export interface ReconciliationCopy {
  title: string;
  explanation: string;
  avoid: string;
  say: string;
  next: string;
}
export interface PhraseCopy {
  phrase: string;
  why: string;
}
export interface Selection<T> {
  id: string;
  tags: string[];
  copy: T;
  trace: { traitKeys: TraitKey[]; evidenceIds: string[]; ruleId: string };
}
export interface Evidence {
  id: string;
  title: string;
  fact: string;
  interpretation: string;
}
export interface RelationshipReport {
  version: 2;
  modelVersion: 'traits-v1';
  asOfDate: string;
  age: number;
  parent: DisplayPerson;
  child: DisplayPerson;
  traits: RelationshipTraits;
  evidence: Evidence[];
  archetype: Selection<ArchetypeCopy>;
  triggers: Selection<TriggerCopy>[];
  translator: Selection<TranslatorCopy>;
  perspectives: Selection<PerspectiveCopy>[];
  reconciliation: Selection<ReconciliationCopy>;
  powerPhrase: Selection<PhraseCopy>;
  score: number;
  indicators: { key: string; label: string; value: number; inverse?: boolean }[];
  unknownTime: boolean;
  boundaryUncertain: boolean;
}
/** Public summary only. No age, dates, birth times, traits, evidence or pillars. */
export interface ShareSummary {
  version: 2;
  parent: { nickname: string; role: string };
  child: { nickname: string; role: string };
  title: string;
  type: string;
  trigger: string;
  phrase: string;
  legacy?: boolean;
}
