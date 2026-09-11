import { useEffect, useState } from 'react';
import type { ShareSummary } from '../types/report';
import { copyUrl, createShareUrl } from '../utils/share';
import { renderShareImage } from '../utils/shareImage';
import { LinkIcon, ShareIcon } from './Icons';
import { ShareCard } from './ShareCard';
import { serviceCopy } from '../data/serviceCopy';
const copy = serviceCopy.share;
export function ShareActions({
  summary,
  onRestart,
}: {
  summary: ShareSummary;
  onRestart: () => void;
}) {
  const [notice, setNotice] = useState(''),
    [manualUrl, setManualUrl] = useState('');
  const [image, setImage] = useState<{ blob: Blob; url: string } | null>(null),
    [imageError, setImageError] = useState(false),
    [preview, setPreview] = useState(false);
  useEffect(() => {
    let cancelled = false,
      url = '';
    setImage(null);
    setImageError(false);
    void renderShareImage(summary)
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setImage({ blob, url });
      })
      .catch(() => {
        if (!cancelled) setImageError(true);
      });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [summary]);
  async function shareLink(native: boolean) {
    const url = createShareUrl(summary);
    setNotice('');
    setManualUrl('');
    if (native && navigator.share) {
      try {
        await navigator.share({
          title: serviceCopy.name,
          text: summary.title.replaceAll('\n', ' '),
          url,
        });
        return;
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return;
      }
    }
    try {
      await copyUrl(url);
      setNotice(copy.copied);
    } catch {
      setManualUrl(url);
      setNotice(copy.manual);
    }
  }
  function save() {
    if (!image) return;
    const a = document.createElement('a');
    a.href = image.url;
    a.download = 'our-family-report.png';
    document.body.append(a);
    a.click();
    a.remove();
    setNotice(copy.downloaded);
    setPreview(true);
  }
  async function shareImage() {
    if (!image) return;
    setNotice('');
    const file = new File([image.blob], 'our-family-report.png', { type: 'image/png' });
    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: serviceCopy.name });
        return;
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return;
    }
    save();
  }
  return (
    <section className="share-section report-share">
      <div className="section-eyebrow">{copy.eyebrow}</div>
      <h2>{copy.title}</h2>
      <p className="preserve-lines">{copy.description}</p>
      <ShareCard summary={summary} />
      <button className="primary" disabled={!image} onClick={() => void shareImage()}>
        <ShareIcon />
        {!image && !imageError ? copy.busy : copy.imageButton}
      </button>
      {imageError && <p role="status">{copy.imageError}</p>}
      <div className="share-secondary">
        <button disabled={!image} onClick={save}>
          ↓ {copy.save}
        </button>
        <span />
        <button onClick={() => void shareLink(true)}>
          <ShareIcon />
          {copy.linkButton}
        </button>
      </div>
      <div className="share-secondary">
        <button onClick={() => void shareLink(false)}>
          <LinkIcon />
          {copy.copy}
        </button>
        <span />
        <button onClick={onRestart}>↻ {copy.restart}</button>
      </div>
      <p className="share-privacy">{copy.publicNote}</p>
      <div role="status" className="share-notice">
        {notice}
      </div>
      {manualUrl && (
        <textarea
          className="manual-url"
          aria-label="공유 링크 직접 복사"
          readOnly
          value={manualUrl}
          onFocus={(e) => e.target.select()}
        />
      )}
      {preview && image && (
        <div className="saved-image">
          <p>{copy.preview}</p>
          <img
            src={image.url}
            alt={`${summary.parent.nickname}와 ${summary.child.nickname}의 공유용 관계 카드`}
          />
        </div>
      )}
    </section>
  );
}
