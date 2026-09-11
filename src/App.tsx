import { useCallback, useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { InputPage } from './pages/InputPage';
import { LoadingPage } from './pages/LoadingPage';
import { ResultPage } from './pages/ResultPage';
import { readSharedResult } from './utils/share';
import type { Result } from './types';
type Page = 'home' | 'input' | 'loading' | 'result';
export default function App() {
  const [initial] = useState(() => readSharedResult(window.location.hash));
  const [result, setResult] = useState<Result | null>(initial),
    [page, setPage] = useState<Page>(initial ? 'result' : 'home'),
    [shared, setShared] = useState(Boolean(initial));
  const [badLink, setBadLink] = useState(Boolean(window.location.hash && !initial));
  const complete = useCallback(() => setPage('result'), []);
  const goHome = () => {
    setPage('home');
    setResult(null);
    setShared(false);
    setBadLink(false);
    history.replaceState(null, '', location.pathname);
  };
  const start = () => {
    goHome();
    setPage('input');
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (page === 'home' || page === 'result') {
      const title = document.querySelector<HTMLElement>('#main h1');
      title?.setAttribute('tabindex', '-1');
      title?.focus({ preventScroll: true });
    }
    document.title =
      page === 'result' && result
        ? `${result.title} · 타고난 우리 사이`
        : '타고난 우리 사이 · 부모와 아이의 케미';
  }, [page, result]);
  useEffect(() => {
    const onHash = () => {
      const next = readSharedResult(location.hash);
      setResult(next);
      setShared(Boolean(next));
      setBadLink(Boolean(location.hash && !next));
      setPage(next ? 'result' : 'home');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return (
    <Layout onHome={goHome}>
      {badLink && (
        <div role="alert" className="invalid-link">
          공유 링크가 올바르지 않거나 손상되었어요.
          <br />
          새로운 우리 사이 이야기를 만들어보세요.
        </div>
      )}
      {page === 'home' && <LandingPage onStart={start} />}
      {page === 'input' && (
        <InputPage
          onBack={goHome}
          onResult={(r) => {
            setResult(r);
            setPage('loading');
          }}
        />
      )}
      {page === 'loading' && <LoadingPage onComplete={complete} />}
      {page === 'result' && result && (
        <ResultPage result={result} shared={shared} onRestart={start} />
      )}
    </Layout>
  );
}
