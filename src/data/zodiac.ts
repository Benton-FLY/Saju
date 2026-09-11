import type { EarthlyBranch } from 'manseryeok';
export const zodiac: Record<EarthlyBranch, string> = {
  자: '쥐',
  축: '소',
  인: '호랑이',
  묘: '토끼',
  진: '용',
  사: '뱀',
  오: '말',
  미: '양',
  신: '원숭이',
  유: '닭',
  술: '개',
  해: '돼지',
};
export const elements = ['목', '화', '토', '금', '수'] as const;
export const elementLabels = {
  목: '자라나는 나무',
  화: '따뜻한 불',
  토: '든든한 땅',
  금: '단단한 보석',
  수: '유연한 물',
};
