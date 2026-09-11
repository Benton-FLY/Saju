import { useCallback, useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { InputPage } from './pages/InputPage';
import { LoadingPage } from './pages/LoadingPage';
import { ResultPage } from './pages/ResultPage';
import { SharedPage } from './pages/SharedPage';
import { readSharedResult } from './utils/share';
import type { RelationshipReport } from './types/report';
import { serviceCopy as copy } from './data/serviceCopy';
type Page = 'home' | 'input' | 'loading' | 'result' | 'shared';
export default function App() {
  const [shared, setShared] = useState(() => readSharedResult(location.hash));
  const [report, setReport] = useState<RelationshipReport | null>(null),
    [page, setPage] = useState<Page>(shared ? 'shared' : 'home');
  const [badLink, setBadLink] = useState(Boolean(location.hash && !shared));
  const complete = useCallback(() => setPage('result'), []);
  const goHome = () => {
    setPage('home');
    setReport(null);
    setShared(null);
    setBadLink(false);
    history.replaceState(null, '', location.pathname);
  };
  const start = () => {
    goHome();
    setPage('input');
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (page !== 'input' && page !== 'loading') {
      const title = document.querySelector<HTMLElement>('#main h1');
      title?.setAttribute('tabindex', '-1');
      title?.focus({ preventScroll: true });
    }
    document.title = copy.name + ' · ' + copy.subtitle;
  }, [page]);
  useEffect(() => {
    const onHash = () => {
      const next = readSharedResult(location.hash);
      setReport(null);
      setShared(next);
      setBadLink(Boolean(location.hash && !next));
      setPage(next ? 'shared' : 'home');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return (
    <Layout onHome={goHome}>
      {badLink && (
        <div role="alert" className="invalid-link preserve-lines">
          {copy.invalidLink}
        </div>
      )}
      {page === 'home' && <LandingPage onStart={start} />}
      {page === 'input' && (
        <InputPage
          onBack={goHome}
          onResult={(r) => {
            setReport(r);
            setPage('loading');
          }}
        />
      )}
      {page === 'loading' && <LoadingPage onComplete={complete} />}
      {page === 'result' && report && <ResultPage report={report} onRestart={start} />}
      {page === 'shared' && shared && <SharedPage summary={shared} onStart={start} />}
    </Layout>
  );
}
