import type { PersonInput } from '../types';
function person(
  role: PersonInput['role'],
  nickname: string,
  date: string,
  time = '09:30',
  calendar: PersonInput['calendar'] = 'solar',
  leapMonth = false,
): PersonInput {
  const [year, month, day] = date.split('-');
  return { role, nickname, year, month, day, time, calendar, leapMonth, unknownTime: time === '' };
}
export const reportTestCases = [
  {
    name: '말띠 엄마와 쥐띠 딸',
    parent: person('엄마', '엄마', '1990-06-15', '11:30'),
    child: person('딸', '서윤', '2020-08-20', '09:00'),
  },
  {
    name: '초등 아들과 아빠',
    parent: person('아빠', '아빠', '1985-03-07', '07:10'),
    child: person('아들', '도윤', '2015-05-02', '16:20'),
  },
  {
    name: '사춘기 딸과 엄마',
    parent: person('엄마', '지은', '1988-11-03', '22:10'),
    child: person('딸', '봄', '2011-12-18', '05:40'),
  },
  {
    name: '3세 아들과 엄마',
    parent: person('엄마', '엄마', '1992-02-22', '13:15'),
    child: person('아들', '우주', '2023-03-02', '08:10'),
  },
  {
    name: '고등학생과 아빠',
    parent: person('아빠', '아빠', '1982-09-09', '18:10'),
    child: person('딸', '하늘', '2008-11-08', '21:35'),
  },
  {
    name: '성인 자녀',
    parent: person('엄마', '엄마', '1970-07-12', '06:00'),
    child: person('아들', '준', '1995-04-15', '14:50'),
  },
  {
    name: '초등 딸과 엄마',
    parent: person('엄마', '수아', '1989-04-19', '15:25'),
    child: person('딸', '별', '2018-06-04', '12:05'),
  },
  {
    name: '영아 돌봄',
    parent: person('아빠', '아빠', '1991-12-01', '02:30'),
    child: person('아들', '콩', '2025-11-20', '17:15'),
  },
  {
    name: '입춘 경계와 시간 미상',
    parent: person('엄마', '엄마', '1987-08-23', ''),
    child: person('아들', '달', '2016-02-04', ''),
  },
  {
    name: '어린이집 나이 아이',
    parent: person('아빠', '아빠', '1993-05-30', '11:25'),
    child: person('딸', '나무', '2022-09-18', '03:20'),
  },
  {
    name: '음력과 윤달',
    parent: person('엄마', '엄마', '1992-09-29', '05:30', 'lunar'),
    child: person('딸', '서윤', '2020-04-01', '09:00', 'lunar', true),
  },
  {
    name: '같은 띠 부자',
    parent: person('아빠', '아빠', '1990-06-15', '23:10'),
    child: person('아들', '유준', '2014-08-20', '10:00'),
  },
];
