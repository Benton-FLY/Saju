import { useEffect, useMemo, useRef } from 'react';
import type { RelationshipReport } from '../types/report';
import { serviceCopy as ui } from '../data/serviceCopy';
import { Spark } from '../components/Icons';
import { ShareActions } from '../components/ShareActions';
import { ReportEvidence } from '../components/ReportEvidence';
import { sharePayload } from '../utils/share';
const copy = ui.result;
export function ResultPage({
  report: r,
  onRestart,
}: {
  report: RelationshipReport;
  onRestart: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const summary = useMemo(() => sharePayload(r), [r]);
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
      { threshold: 0.08 },
    );
    nodes.forEach((n) => {
      n.classList.add('reveal-ready');
      observer.observe(n);
    });
    return () => observer.disconnect();
  }, []);
  const jump = (id: string) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
  return (
    <div className="report-page page-enter" ref={ref}>
      <section className="report-hero">
        <div className="report-hero-top">
          <span>{copy.eyebrow}</span>
          <Spark />
        </div>
        <p className="report-names">
          {r.parent.nickname}
          <span> × </span>
          {r.child.nickname}
        </p>
        <h1 className="preserve-lines">{r.archetype.copy.title}</h1>
        <p className="report-subtitle preserve-lines">{r.archetype.copy.subtitle}</p>
        <span className="report-type">{r.archetype.copy.type}</span>
        <div className="hero-mini-scene">
          <small>{copy.scene}</small>
          <p>{r.archetype.copy.scene}</p>
        </div>
        <p className="hero-invitation">
          {copy.intro}
          <span>↓</span>
        </p>
      </section>
      <div className="report-content">
        <p className="report-interpretation">{copy.interpretation}</p>
        <nav className="report-nav" aria-label="리포트 바로가기">
          {['triggers', 'translator', 'reconciliation'].map((id, i) => (
            <button key={id} onClick={() => jump(id)}>
              {copy.navigation[i]}
              <span>↘</span>
            </button>
          ))}
        </nav>
        {r.unknownTime && (
          <p className="time-note">
            {copy.unknown}
            {r.boundaryUncertain && <span>{copy.boundary}</span>}
          </p>
        )}
        <section className="report-section reveal" id="triggers">
          <div className="report-kicker">
            <span>01</span> 말 한마디에서 시작되는 일
          </div>
          <h2>
            {copy.triggers}
            <span className="section-symbol">↯</span>
          </h2>
          <p className="section-description">{copy.triggerIntro}</p>
          <div className="trigger-list">
            {r.triggers.map((t, i) => (
              <article className="trigger-card" key={t.id} data-trigger-id={t.id}>
                <div className="trigger-rank">
                  0{i + 1}
                  <span>버튼</span>
                </div>
                <div>
                  <h3>{t.copy.title}</h3>
                  <p>{t.copy.explanation}</p>
                  <div className="trigger-alternative">
                    <small>{copy.triggerInstead}</small>
                    <p>{t.copy.tryInstead}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="report-section translator-section reveal" id="translator">
          <div className="report-kicker">
            <span>02</span> 같은 뜻, 다른 전달
          </div>
          <h2>
            {copy.translator}
            <span className="section-symbol">↔</span>
          </h2>
          <p className="section-description">{copy.translatorIntro}</p>
          <div className="scenario-tab">{r.translator.copy.scene}</div>
          <div className="translator-stack" data-scenario-id={r.translator.id}>
            <div className="translation said">
              <small>{copy.said}</small>
              <p>{r.translator.copy.said}</p>
              <span>{r.parent.role}</span>
            </div>
            <div className="translation-arrow" aria-hidden="true">
              ↓
            </div>
            <div className="translation heard">
              <small>{copy.heard}</small>
              <p>{r.translator.copy.heard}</p>
              <span>{r.child.role}</span>
            </div>
            <div className="translation-arrow" aria-hidden="true">
              ↓
            </div>
            <div className="translation instead">
              <small>
                <Spark />
                {copy.instead}
              </small>
              <p>{r.translator.copy.instead}</p>
            </div>
          </div>
          <p className="translator-why">{r.translator.copy.why}</p>
          <p className="age-caption">
            {copy.dateNote.replace('{date}', r.asOfDate).replace('{age}', String(r.age))}
          </p>
        </section>
        <section className="report-section reveal">
          <div className="report-kicker">
            <span>03</span> 아이를 보는 다른 창
          </div>
          <h2 className="preserve-lines">{copy.perspective}</h2>
          <div className="perspective-list">
            {r.perspectives.map((p) => (
              <article className="perspective-item" key={p.id}>
                <div>
                  <small>{copy.seen.replace('{parent}', r.parent.role)}</small>
                  <p>{p.copy.seen}</p>
                </div>
                <span aria-hidden="true">↓</span>
                <div>
                  <small>{copy.reframed}</small>
                  <h3>{p.copy.reframed}</h3>
                </div>
                <p className="perspective-practice">{p.copy.practice}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="report-section reconciliation-section reveal" id="reconciliation">
          <div className="report-kicker">
            <span>04</span> 먼저 손 내미는 방법
          </div>
          <h2>{copy.reconciliation}</h2>
          <h3 className="reconciliation-title">{r.reconciliation.copy.title}</h3>
          <p className="section-prose">{r.reconciliation.copy.explanation}</p>
          <div className="reconciliation-avoid">
            <small>− {copy.avoid}</small>
            <p>{r.reconciliation.copy.avoid}</p>
          </div>
          <div className="reconciliation-say">
            <small>＋ {copy.say}</small>
            <p>{r.reconciliation.copy.say}</p>
          </div>
          <p className="reconciliation-next">{r.reconciliation.copy.next}</p>
        </section>
        <section className="power-phrase reveal">
          <Spark />
          <div className="section-eyebrow">{copy.phraseKicker}</div>
          <h2 className="preserve-lines">{copy.phrase}</h2>
          <blockquote>{r.powerPhrase.copy.phrase}</blockquote>
          <p>{r.powerPhrase.copy.why}</p>
          <div className="power-sign">
            {r.parent.nickname}에게서 {r.child.nickname}에게
          </div>
        </section>
        <ReportEvidence report={r} />
        <details className="secondary-numbers">
          <summary>
            {copy.numbers}
            <span>＋</span>
          </summary>
          <div className="secondary-score">
            <span>{copy.total}</span>
            <strong>
              {r.score}
              <small> / 100</small>
            </strong>
          </div>
          <div className="small-indicators">
            {r.indicators.map((m) => (
              <div key={m.key}>
                <span>{m.label}</span>
                <div
                  className={`meter ${m.inverse ? 'inverse' : ''}`}
                  role="meter"
                  aria-label={m.label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={m.value}
                >
                  <span style={{ width: `${m.value}%` }} />
                </div>
                <strong>{m.value}</strong>
              </div>
            ))}
          </div>
          <p>{copy.numbersNote}</p>
        </details>
        <ShareActions summary={summary} onRestart={onRestart} />
      </div>
    </div>
  );
}
