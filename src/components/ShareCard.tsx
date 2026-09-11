import type { ShareSummary } from '../types/report';
import { serviceCopy as copy } from '../data/serviceCopy';
import { Spark } from './Icons';
export function ShareCard({ summary }: { summary: ShareSummary }) {
  return (
    <div className="share-poster" data-testid="share-card">
      <div className="poster-top">
        <span>{copy.result.eyebrow}</span>
        <Spark />
      </div>
      <p className="poster-names">
        {summary.parent.nickname}
        <span> × </span>
        {summary.child.nickname}
      </p>
      <h3 className="preserve-lines">{summary.title}</h3>
      <span className="poster-type">{summary.type}</span>
      {summary.trigger && (
        <div className="poster-button war">
          <small>↯ {copy.share.war}</small>
          <p>{summary.trigger}</p>
        </div>
      )}
      <div className="poster-button peace">
        <small>♡ {copy.share.peace}</small>
        <p>{summary.phrase}</p>
      </div>
      <div className="poster-sign">
        {copy.name}
        <Spark />
      </div>
    </div>
  );
}
