import { useEffect, useRef, useState } from 'react';
import type { PersonInput } from '../types';
import type { RelationshipReport } from '../types/report';
import { serviceCopy } from '../data/serviceCopy';
import { PersonForm } from '../components/PersonForm';
import { Arrow, Spark } from '../components/Icons';
import { calculateSaju } from '../lib/saju';
import { createReport } from '../lib/report';
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
  onResult: (r: RelationshipReport) => void;
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
      calculateSaju(parent);
      if (step === 0) {
        setStep(1);
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }
      onResult(createReport(parent, child));
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
          {step === 0 ? serviceCopy.input.parentEyebrow : serviceCopy.input.childEyebrow}
        </span>
        <h1 tabIndex={-1} ref={heading} key={step}>
          <span className="preserve-lines">
            {step === 0 ? serviceCopy.input.parentTitle : serviceCopy.input.childTitle}
          </span>
        </h1>
        <p>{serviceCopy.input.description}</p>
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
          <p className="preserve-lines">{serviceCopy.input.note}</p>
        </div>
        <button className="primary" type="submit">
          {step === 0 ? serviceCopy.input.next : serviceCopy.input.submit}
          <Arrow />
        </button>
        <p className="private-caption">{serviceCopy.input.private}</p>
      </form>
    </section>
  );
}
