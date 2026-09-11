import type { Condition, TraitKey } from '../types/report';
export const high = (trait: TraitKey, min = 60): Condition => ({ trait, min });
export const low = (trait: TraitKey, max = 40): Condition => ({ trait, max });
export const range = (trait: TraitKey, min: number, max: number): Condition => ({
  trait,
  min,
  max,
});
export const ahead = (trait: TraitKey, comparedTo: TraitKey, gap = 15): Condition => ({
  trait,
  comparedTo,
  gap,
});
