import type { Element } from '../types';
export type PersonAxis = 'speed' | 'control' | 'autonomy' | 'expression' | 'explanation' | 'order';
/** Editorial translations of elemental metaphors, NOT measured psychology. */
export const elementProfiles: Record<Element, Record<PersonAxis, number>> = {
  목: { speed: 75, control: 45, autonomy: 90, expression: 65, explanation: 45, order: 30 },
  화: { speed: 95, control: 30, autonomy: 60, expression: 95, explanation: 20, order: 20 },
  토: { speed: 30, control: 75, autonomy: 35, expression: 40, explanation: 45, order: 90 },
  금: { speed: 55, control: 90, autonomy: 75, expression: 25, explanation: 90, order: 85 },
  수: { speed: 15, control: 20, autonomy: 50, expression: 15, explanation: 80, order: 40 },
};
export const traitLabels = {
  parentSpeed: '부모의 진행 속도',
  childSpeed: '아이의 진행 속도',
  parentControlNeed: '부모의 방향 설정',
  childAutonomyNeed: '아이의 선택권',
  parentEmotionExpression: '부모의 즉각적인 표현',
  childEmotionExpression: '아이의 즉각적인 표현',
  parentConflictStyle: '부모의 바로 말하는 방식',
  childConflictStyle: '아이의 바로 말하는 방식',
  parentRecoverySpeed: '부모의 대화 재개 속도',
  childRecoverySpeed: '아이의 대화 재개 속도',
  parentCommunicationStyle: '부모의 이유·설명 선호',
  childCommunicationStyle: '아이의 이유·설명 선호',
  parentOrderNeed: '부모의 순서·기준',
  childOrderNeed: '아이의 순서·기준',
  similarityLevel: '오행 구성의 닮음',
  complementLevel: '오행의 빈자리 보완',
  frictionLevel: '지지 관계의 긴장',
  yearClash: '연지 충',
  dayClash: '일지 충',
  bondLevel: '지지 관계의 연결',
};
