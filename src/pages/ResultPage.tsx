import { useEffect, useRef } from 'react';
import type { MetricKey, Result } from '../types';
import { elementLabels } from '../data/zodiac';
import { FamilyArt } from '../components/FamilyArt';
import { Spark } from '../components/Icons';
import { Score } from '../components/Score';
import { ShareActions } from '../components/ShareActions';
const metrics: { key: MetricKey; label: string; note: string }[] = [
  { key: 'personality', label: '성격 케미', note: '서로의 다름을 알아보는 감각' },
  { key: 'conversation', label: '대화 케미', note: '마음이 말로 이어지는 순간' },
  { key: 'rhythm', label: '생활 리듬', note: '함께 맞춰가는 하루의 속도' },
  { key: 'recovery', label: '감정 회복력', note: '다시 손을 내밀 수 있는 힘' },
  { key: 'growth', label: '성장 시너지', note: '둘이 함께라서 자라는 가능성' },
];
export function ResultPage({
  result: r,
  shared,
  onRestart,
}: {
  result: Result;
  shared: boolean;
  onRestart: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const nodes = ref.current?.querySelectorAll('.reveal');
    if (!nodes || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    nodes.forEach((n) => {
      n.classList.add('reveal-ready');
      observer.observe(n);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="result-page page-enter">
      {shared && (
        <div className="shared-notice">
          공유받은 우리 사이 이야기 <span>· 입력 정보는 포함되지 않아요</span>
        </div>
      )}
      <section className="result-hero">
        <div className="result-topline">
          <span>우리의 타고난 인연록</span>
          <Spark />
        </div>
        <div className="result-names">
          {r.parent.nickname} <span>×</span> {r.child.nickname}
        </div>
        <div className="zodiac-line">
          {r.parent.zodiac}띠 {r.parent.role}
          <span>✧</span>
          {r.child.zodiac}띠 {r.child.role}
        </div>
        <div className="score-orbit">
          <span className="orbit-star one">✧</span>
          <span className="orbit-star two">✦</span>
          <span className="score-caption">타고난 케미</span>
          <Score value={r.score} />
          <span className="score-bottom">서로를 알아갈 가능성</span>
        </div>
        <div className="type-label">우리의 관계 이름</div>
        <h1>{r.title}</h1>
        <p className="result-subtitle">{r.subtitle}</p>
        <FamilyArt compact />
        <div className="result-hero-foot">
          <span>너라는 우주와 나라는 우주가 만났을 때</span>
          <span>↓</span>
        </div>
      </section>
      <div className="result-content">
        <div className="element-pair reveal">
          {[r.parent, r.child].map((p, i) => (
            <div key={i}>
              <span>{p.role}의 기운</span>
              <strong>
                {p.element}
                <small>{elementLabels[p.element]}</small>
              </strong>
            </div>
          ))}
        </div>
        {r.unknownTime && (
          <p className="time-note">
            출생시간을 입력하면 조금 더 상세하게 볼 수 있어요.
            {r.boundaryUncertain && (
              <span>
                절기가 바뀌는 날이라, 시간에 따라 띠나 월의 기운이 달라질 수 있어요. 현재는 정오
                기준이에요.
              </span>
            )}
          </p>
        )}
        <section className="metrics-card reveal">
          <div className="card-kicker">
            01 <span>다섯 가지 마음의 연결</span>
          </div>
          <h2>우리의 타고난 케미</h2>
          <p className="card-intro">같이 있을 때, 이런 힘이 생겨요.</p>
          <div className="meters">
            {metrics.map(({ key, label, note }, i) => (
              <div className="metric" key={key}>
                <div className="metric-label">
                  <span>{label}</span>
                  <strong>
                    {r.metrics[key]}
                    <small> / 100</small>
                  </strong>
                </div>
                <div
                  className="meter"
                  role="meter"
                  aria-label={label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={r.metrics[key]}
                >
                  <span style={{ width: `${r.metrics[key]}%`, animationDelay: `${i * 0.12}s` }} />
                </div>
                <p>{note}</p>
              </div>
            ))}
          </div>
          <p className="score-note">
            점수는 사주 요소를 조합한 재미 지표예요.
            <br />
            애정의 크기나 실제 관계의 좋고 나쁨을 뜻하지 않아요.
          </p>
        </section>
        <section className="story-card good-card reveal">
          <div className="card-kicker">
            02 <span>우리의 반짝이는 순간</span>
            <Spark />
          </div>
          <h2>둘이 잘 맞을 때</h2>
          <p>{r.good}</p>
          <span className="card-watermark">合</span>
        </section>
        <section className="story-card friction-card reveal">
          <div className="card-kicker">
            03 <span>다름을 이해하는 시간</span>
          </div>
          <h2>왜 자꾸 부딪힐까?</h2>
          <p>{r.friction}</p>
          <div className="gentle-note">다르다는 건, 서로에게 없는 걸 가졌다는 뜻.</div>
        </section>
        <section className="story-card tip-card reveal">
          <div className="card-kicker">
            04 <span>마음을 잇는 작은 연습</span>
          </div>
          <h2>
            {r.parent.role}가 기억하면
            <br />
            좋은 것
          </h2>
          <p>{r.tip}</p>
          <span className="tip-flower" aria-hidden="true">
            ✳
          </span>
        </section>
        <section className="wish-card reveal">
          <div className="card-kicker">
            05 <span>아이의 마음에서 온 편지</span>
          </div>
          <h2>우리 아이가 원하는 것</h2>
          <div className="wish-bubble">
            <span aria-hidden="true">“</span>
            <p>{r.wish.replace(/[“”]/g, '')}</p>
            <small>— {r.child.nickname}의 마음을 상상하며</small>
          </div>
        </section>
        <section className="quote-card reveal">
          <Spark />
          <div className="section-eyebrow">한 줄로 보는 우리 사이</div>
          <blockquote>{r.quote}</blockquote>
          <div className="quote-sign">
            {r.parent.nickname} × {r.child.nickname}
            <span>타고난 우리 사이</span>
          </div>
        </section>
        <ShareActions result={r} onRestart={onRestart} />
        <details className="calculation-note">
          <summary>이 결과는 어떻게 만들어졌나요?</summary>
          <p>
            만세력 라이브러리로 계산한 연·월·일·시의 지지 관계, 일간 오행과 두 사람의 오행 보완성을
            함께 살펴요. 같은 출생 정보에는 같은 결과를 보여드려요. 이름과 성별은 점수에 영향을 주지
            않아요.
          </p>
          <p>
            한국 표준시, 자정에 날짜가 바뀌는 기준이며 띠는 입춘 기준이에요. 시간 미상은 정오로
            연·월·일을 구한 뒤 시주를 제외해요. 출생지·진태양시 보정은 적용하지 않아요. 이 해석과
            점수는 과학적으로 검증된 성격·관계 진단이 아니에요.
          </p>
          {shared && <p>공유 결과는 링크에 담긴 요약이며, 서버에서 진위를 인증하지 않아요.</p>}
        </details>
      </div>
    </div>
  );
}
