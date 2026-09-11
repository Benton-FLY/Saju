import { useEffect, useState } from 'react';
import { Spark } from '../components/Icons';
const messages = [
  '두 사람의 타고난 기운을 살펴보고 있어요',
  '닮은 점과 다른 점을 찾고 있어요',
  '우리만의 케미를 만들고 있어요',
];
export function LoadingPage({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const a = setTimeout(() => setStep(1), 900),
      b = setTimeout(() => setStep(2), 1800),
      c = setTimeout(onComplete, 2800);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      clearTimeout(c);
    };
  }, [onComplete]);
  return (
    <section className="loading-page page-enter" aria-busy="true">
      <div className="loading-orbit">
        <span />
        <Spark />
        <span />
      </div>
      <div className="section-eyebrow">우리의 인연을 읽는 중</div>
      <h1>
        둘의 이야기가
        <br />
        피어나고 있어요.
      </h1>
      <p role="status" key={step} className="page-enter">
        {messages[step]}
      </p>
      <div className="loading-dots">
        {messages.map((_, i) => (
          <i key={i} className={i === step ? 'active' : ''} />
        ))}
      </div>
    </section>
  );
}
