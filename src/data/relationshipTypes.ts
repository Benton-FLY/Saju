export const relationshipTypes = [
  {
    id: 'spark',
    title: '불꽃 {family}',
    subtitle: '서로 다른 불빛으로\n함께 더 환해지는 사이',
    quote: '티격태격하는 날에도,\n내 편이라는 사실은 변하지 않아.',
  },
  {
    id: 'perfect',
    title: '찰떡 {family}',
    subtitle: '어쩌면 태어나기 전부터\n우리는 같은 팀이었나 봐',
    quote: '말하지 않아도 통하는 순간,\n우리는 역시 한 팀.',
  },
  {
    id: 'growth',
    title: '서로 키우는 사이',
    subtitle: '아이는 자라고, 부모도 자라는\n우리만의 다정한 성장기',
    quote: '{parent}도 처음, {child}도 처음.\n우리는 서로를 키우는 중.',
  },
  {
    id: 'similar',
    title: '닮은 듯 다른 {family}',
    subtitle: '익숙한 모습 속 새로운 발견,\n알아갈수록 재미있는 우리',
    quote: '같은 듯 다른 너와 나.\n그래서 매일이 새로운 이야기.',
  },
  {
    id: 'steady',
    title: '든든한 한 팀',
    subtitle: '속도는 조금 달라도\n결국 같은 곳을 향하는 사이',
    quote: '조금 느려도 괜찮아.\n우리는 같이 가고 있으니까.',
  },
  {
    id: 'learning',
    title: '밀당 {family}',
    subtitle: '한 걸음 다가가고, 한 걸음 기다리는\n우리 사이의 예쁜 균형',
    quote: '너의 속도를 배우는 일.\n그게 나의 사랑이 되는 중.',
  },
] as const;
export const familyName = (parent: string, child: string) =>
  `${parent === '엄마' ? '모' : '부'}${child === '딸' ? '녀' : '자'}`;
