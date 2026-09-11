import { useEffect, useState } from 'react';
import { Spark } from '../components/Icons';
import { serviceCopy } from '../data/serviceCopy';
const copy = serviceCopy.loading;
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
      <div className="section-eyebrow">{copy.eyebrow}</div>
      <h1 className="preserve-lines">{copy.title}</h1>
      <p role="status" key={step} className="page-enter">
        {copy.messages[step]}
      </p>
      <div className="loading-dots">
        {copy.messages.map((_, i) => (
          <i key={i} className={i === step ? 'active' : ''} />
        ))}
      </div>
    </section>
  );
}
