import type { RelationshipReport } from '../types/report';
import { serviceCopy } from '../data/serviceCopy';
import { traitLabels } from '../data/traitRules';
const copy = serviceCopy.result;
export function ReportEvidence({ report: r }: { report: RelationshipReport }) {
  const selected = [
    r.archetype,
    ...r.triggers,
    r.translator,
    ...r.perspectives,
    r.reconciliation,
    r.powerPhrase,
  ];
  const coreIds = [
    'parent-day',
    'child-day',
    'day-relation',
    'parent-elements',
    'child-elements',
    'element-comparison',
  ];
  const firstClash = r.evidence.find((e) => e.id === 'branch-year-year-충');
  if (firstClash) coreIds.unshift(firstClash.id);
  const main = r.evidence.filter((e) => coreIds.includes(e.id));
  const more = r.evidence.filter((e) => !coreIds.includes(e.id));
  const evidenceBlock = (e: RelationshipReport['evidence'][number]) => (
    <article className="evidence-fact" key={e.id}>
      <h3>{e.title}</h3>
      <span className="evidence-label">{copy.fact}</span>
      <p className="fact-text">{e.fact}</p>
      <span className="evidence-label">{copy.interpretationLabel}</span>
      <p>{e.interpretation}</p>
      <small className="evidence-id">{e.id}</small>
    </article>
  );
  return (
    <details className="report-evidence" id="evidence">
      <summary>
        {copy.evidence}
        <span>＋</span>
      </summary>
      <div className="evidence-body">
        <p>{copy.evidenceIntro}</p>
        {main.map(evidenceBlock)}
        <details className="evidence-more">
          <summary>사용한 나머지 계산 근거 {more.length}개</summary>
          {more.map(evidenceBlock)}
        </details>
        <h3 className="trace-heading">{copy.trace}</h3>
        <div className="trace-list">
          {selected.map((item) => (
            <details key={item.id}>
              <summary>
                {'title' in item.copy
                  ? item.copy.title
                  : 'scene' in item.copy
                    ? item.copy.scene
                    : 'phrase' in item.copy
                      ? item.copy.phrase
                      : 'seen' in item.copy
                        ? item.copy.seen
                        : item.id}
              </summary>
              <p>
                {item.trace.traitKeys.length
                  ? item.trace.traitKeys
                      .map((k) => `${traitLabels[k]} ${r.traits[k].value}`)
                      .join(' · ')
                  : '연령에 맞춘 공통 안내 (개별 성격 판정 아님)'}
              </p>
              <p>
                {item.trace.evidenceIds
                  .map((id) => r.evidence.find((e) => e.id === id)?.title)
                  .filter(Boolean)
                  .join(' / ')}
              </p>
              <small>규칙: {item.trace.ruleId}</small>
            </details>
          ))}
        </div>
        <p className="model-note">{copy.modelNote}</p>
        <p className="model-note">
          모델 {r.modelVersion} · KST · 자정 일 경계 · 진태양시 보정 없음
        </p>
      </div>
    </details>
  );
}
