import type { ShareSummary } from '../types/report';
import { serviceCopy as copy } from '../data/serviceCopy';
import { ShareCard } from '../components/ShareCard';
export function SharedPage({ summary, onStart }: { summary: ShareSummary; onStart: () => void }) {
  return (
    <section className="shared-page page-enter">
      <div className="section-eyebrow">{copy.share.summaryTitle}</div>
      <h1>
        {summary.parent.nickname} × {summary.child.nickname}
      </h1>
      <p>{summary.legacy ? copy.share.legacyNote : copy.share.summaryNote}</p>
      <ShareCard summary={summary} />
      <button className="primary" onClick={onStart}>
        {copy.share.makeOwn}
      </button>
      <p className="share-privacy">{copy.share.summaryDisclaimer}</p>
    </section>
  );
}
