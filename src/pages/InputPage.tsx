import { useEffect, useRef, useState } from 'react';
import type { PersonInput, Result } from '../types';
import { PersonForm } from '../components/PersonForm';
import { Arrow, Spark } from '../components/Icons';
import { calculateSaju } from '../lib/saju';
import { compatibility } from '../lib/compatibility';
export const blankPerson = (role: PersonInput['role']): PersonInput => ({
  role,
  nickname: '',
  year: '',
  month: '',
  day: '',
  calendar: 'solar',
  time: '',
  unknownTime: false,
  leapMonth: false,
});
export function InputPage({
  onBack,
  onResult,
}: {
  onBack: () => void;
  onResult: (r: Result) => void;
}) {
  const [step, setStep] = useState(0),
    [parent, setParent] = useState(blankPerson('엄마')),
    [child, setChild] = useState(blankPerson('딸')),
    [error, setError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [step]);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const p = calculateSaju(parent);
      if (step === 0) {
        setStep(1);
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }
      const c = calculateSaju(child);
      onResult(compatibility(parent, child, p, c));
    } catch (e) {
      setError(e instanceof Error ? e.message : '입력 정보를 다시 확인해주세요.');
    }
  }
  return (
    <section className="input-page page-enter">
      <div className="step-top">
        <button
          className="back-button"
          aria-label="이전 단계"
          onClick={() => (step === 0 ? onBack() : (setStep(0), setError('')))}
        >
          <Arrow back />
        </button>
        <div className="step-indicator">
          <span className="done">1</span>
          <i />
          <span className={step === 1 ? 'done' : ''}>2</span>
        </div>
        <span className="step-count">0{step + 1} / 02</span>
      </div>
      <div className="form-heading">
        <span className="section-eyebrow">
          {step === 0 ? '먼저, 부모님의 이야기' : '이제, 우리 아이의 이야기'}
        </span>
        <h1 tabIndex={-1} ref={heading} key={step}>
          {step === 0 ? (
            <>
              어떤 기운을 가진
              <br />
              <em>부모님인가요?</em>
            </>
          ) : (
            <>
              세상에 하나뿐인
              <br />
              <em>아이를 알려주세요.</em>
            </>
          )}
        </h1>
        <p>서로를 알아가는 데 필요한 작은 단서들이에요.</p>
      </div>
      <form onSubmit={submit} key={`form-${step}`}>
        <PersonForm
          isParent={step === 0}
          person={step === 0 ? parent : child}
          onChange={step === 0 ? setParent : setChild}
        />
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <div className="form-note">
          <Spark />
          <p>
            타고난 기운은 이해의 힌트일 뿐,
            <br />
            우리의 관계는 함께 만들어가는 거예요.
          </p>
        </div>
        <button className="primary" type="submit">
          {step === 0 ? '아이 정보 입력하기' : '우리 궁합 확인하기'}
          <Arrow />
        </button>
        <p className="private-caption">생년월일시를 서버에 저장하거나 전송하지 않아요.</p>
      </form>
    </section>
  );
}
