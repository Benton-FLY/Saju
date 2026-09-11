import { useState } from 'react';
import type { Result } from '../types';
import { copyUrl, createShareUrl } from '../utils/share';
import { LinkIcon, ShareIcon } from './Icons';
export function ShareActions({ result, onRestart }: { result: Result; onRestart: () => void }) {
  const [notice, setNotice] = useState(''),
    [manualUrl, setManualUrl] = useState('');
  async function share(native: boolean) {
    const url = createShareUrl(result);
    setNotice('');
    setManualUrl('');
    if (native && navigator.share) {
      try {
        await navigator.share({
          title: `${result.title} · 타고난 우리 사이`,
          text: `${result.parent.nickname} × ${result.child.nickname}, 우리의 케미는 ${result.score}점!`,
          url,
        });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
      }
    }
    try {
      await copyUrl(url);
      setNotice('링크를 복사했어요. 소중한 사람에게 보내보세요.');
    } catch {
      setManualUrl(url);
      setNotice('자동 복사가 어려워요. 아래 링크를 길게 눌러 복사해주세요.');
    }
  }
  return (
    <section className="share-section">
      <div className="section-eyebrow">좋은 이야기는 함께</div>
      <h2>우리 사이, 자랑해볼까요?</h2>
      <p>
        별명과 결과만 공유돼요.
        <br />
        생년월일과 태어난 시간은 담지 않아요.
      </p>
      <button className="primary" onClick={() => void share(true)}>
        <ShareIcon />
        결과 공유하기
      </button>
      <div className="share-secondary">
        <button onClick={() => void share(false)}>
          <LinkIcon />
          링크 복사
        </button>
        <span />
        <button onClick={onRestart}>↻ 다시 궁합 보기</button>
      </div>
      <p className="share-privacy">링크를 받은 사람은 별명과 결과를 볼 수 있어요.</p>
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
    </section>
  );
}
